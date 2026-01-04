import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { StorageService, UploadedFile } from './storage.service';
import { UploadDocumentDto, DocumentType } from './dto/upload-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadDocument(
    userId: string,
    file: UploadedFile,
    dto: UploadDocumentDto,
  ) {
    // Get provider for this user
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Check if document of this type already exists (not rejected)
    const existingDoc = await this.prisma.providerDocument.findFirst({
      where: {
        providerId: provider.id,
        documentType: dto.documentType as any,
        verificationStatus: {
          not: 'rejected',
        },
      },
    });

    if (existingDoc) {
      throw new BadRequestException(
        `A ${dto.documentType.replace(/_/g, ' ')} document already exists. Delete the existing one first.`,
      );
    }

    // Upload file to storage
    const uploadResult = await this.storageService.uploadFile(
      file,
      `providers/${provider.id}/documents`,
    );

    // Create document record
    const document = await this.prisma.providerDocument.create({
      data: {
        providerId: provider.id,
        documentType: dto.documentType as any,
        documentNumber: dto.documentNumber,
        issuingAuthority: dto.issuingAuthority,
        issuedDate: dto.issuedDate ? new Date(dto.issuedDate) : null,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        fileUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSizeBytes: uploadResult.sizeBytes,
        fileMimeType: uploadResult.mimeType,
        verificationStatus: 'pending',
      },
    });

    // Check and update provider compliance status
    await this.updateComplianceStatus(provider.id);

    return {
      id: document.id,
      documentType: document.documentType,
      fileName: document.fileName,
      verificationStatus: document.verificationStatus,
      expiryDate: document.expiryDate,
      uploadedAt: document.createdAt,
    };
  }

  async getProviderDocuments(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const documents = await this.prisma.providerDocument.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        documentType: true,
        documentNumber: true,
        issuingAuthority: true,
        issuedDate: true,
        expiryDate: true,
        fileName: true,
        verificationStatus: true,
        verifiedAt: true,
        rejectionReason: true,
        createdAt: true,
      },
    });

    return documents;
  }

  async getDocumentById(userId: string, documentId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const document = await this.prisma.providerDocument.findFirst({
      where: {
        id: documentId,
        providerId: provider.id,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Generate signed URL for download
    const downloadUrl = this.storageService.getSignedUrl(
      document.fileUrl.replace('/uploads/', ''),
      3600,
    );

    return {
      ...document,
      downloadUrl,
    };
  }

  async deleteDocument(userId: string, documentId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const document = await this.prisma.providerDocument.findFirst({
      where: {
        id: documentId,
        providerId: provider.id,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Cannot delete verified documents
    if (document.verificationStatus === 'verified') {
      throw new ForbiddenException(
        'Cannot delete verified documents. Contact support if needed.',
      );
    }

    // Delete from storage
    const key = document.fileUrl.replace('/uploads/', '');
    await this.storageService.deleteFile(key);

    // Delete record
    await this.prisma.providerDocument.delete({
      where: { id: documentId },
    });

    // Update compliance status
    await this.updateComplianceStatus(provider.id);

    return { message: 'Document deleted successfully' };
  }

  async getRequiredDocuments(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
      include: {
        documents: {
          select: {
            documentType: true,
            verificationStatus: true,
            expiryDate: true,
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Define required documents based on service types
    const requiredDocs = this.getRequiredDocumentTypes(provider.serviceTypes as string[]);

    const documentStatus = requiredDocs.map((docType) => {
      const existing = provider.documents.find(
        (d) => d.documentType === docType,
      );

      return {
        documentType: docType,
        displayName: this.getDocumentDisplayName(docType),
        required: true,
        status: existing?.verificationStatus || 'missing',
        expiryDate: existing?.expiryDate || null,
        isExpired: existing?.expiryDate
          ? new Date(existing.expiryDate) < new Date()
          : false,
      };
    });

    return documentStatus;
  }

  // Admin methods for document verification
  async verifyDocument(documentId: string, adminId: string) {
    const document = await this.prisma.providerDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.providerDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: 'verified',
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: null,
      },
    });

    // Update provider compliance status
    await this.updateComplianceStatus(document.providerId);

    return updated;
  }

  async rejectDocument(
    documentId: string,
    adminId: string,
    reason: string,
  ) {
    const document = await this.prisma.providerDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.providerDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: 'rejected',
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: reason,
      },
    });

    // Update provider compliance status
    await this.updateComplianceStatus(document.providerId);

    return updated;
  }

  private async updateComplianceStatus(providerId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
      include: { documents: true },
    });

    if (!provider) return;

    const requiredDocs = this.getRequiredDocumentTypes(provider.serviceTypes as string[]);

    const allVerified = requiredDocs.every((docType) => {
      const doc = provider.documents.find(
        (d) => d.documentType === docType && d.verificationStatus === 'verified',
      );
      return doc && (!doc.expiryDate || new Date(doc.expiryDate) > new Date());
    });

    const hasExpired = provider.documents.some(
      (d) =>
        d.verificationStatus === 'verified' &&
        d.expiryDate &&
        new Date(d.expiryDate) < new Date(),
    );

    let complianceStatus: 'pending' | 'verified' | 'expired' | 'suspended' = 'pending';

    if (hasExpired) {
      complianceStatus = 'expired';
    } else if (allVerified) {
      complianceStatus = 'verified';
    }

    await this.prisma.provider.update({
      where: { id: providerId },
      data: {
        complianceStatus,
        complianceVerifiedAt: allVerified ? new Date() : null,
      },
    });
  }

  private getRequiredDocumentTypes(serviceTypes: string[]): string[] {
    const baseDocs = [
      'public_liability_insurance',
      'ndis_worker_screening',
      'police_check',
    ];

    const additionalDocs: string[] = [];

    if (serviceTypes.includes('community_transport')) {
      additionalDocs.push('drivers_license', 'vehicle_registration', 'vehicle_insurance');
    }

    return [...baseDocs, ...additionalDocs];
  }

  private getDocumentDisplayName(docType: string): string {
    const names: Record<string, string> = {
      public_liability_insurance: 'Public Liability Insurance',
      professional_indemnity_insurance: 'Professional Indemnity Insurance',
      workers_compensation: 'Workers Compensation',
      ndis_worker_screening: 'NDIS Worker Screening Check',
      wwcc: 'Working With Children Check',
      police_check: 'National Police Check',
      first_aid_certificate: 'First Aid Certificate',
      covid_vaccination: 'COVID-19 Vaccination Certificate',
      ahpra_registration: 'AHPRA Registration',
      drivers_license: "Driver's License",
      vehicle_registration: 'Vehicle Registration',
      vehicle_insurance: 'Vehicle Insurance',
      abn_certificate: 'ABN Certificate',
      other: 'Other Document',
    };

    return names[docType] || docType.replace(/_/g, ' ');
  }
}
