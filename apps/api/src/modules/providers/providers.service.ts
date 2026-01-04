import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';
import * as crypto from 'crypto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvider(userId: string, dto: CreateProviderDto) {
    // Check if user already has a provider profile
    const existingProvider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (existingProvider) {
      throw new ConflictException('User already has a provider profile');
    }

    // Check if user exists and is a provider type
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.userType !== 'provider') {
      throw new BadRequestException('User must be registered as a provider');
    }

    // Create provider profile
    const provider = await this.prisma.provider.create({
      data: {
        userId,
        businessName: dto.businessName,
        abn: dto.abn.replace(/\s/g, ''), // Remove spaces
        acn: dto.acn?.replace(/\s/g, ''),
        businessType: dto.businessType as any,
        ndisRegistrationNumber: dto.ndisRegistrationNumber,
        isNdisRegistered: dto.isNdisRegistered || false,
        serviceTypes: dto.serviceTypes as any[],
        serviceStates: dto.serviceStates as any[],
        servicePostcodes: dto.servicePostcodes || [],
        serviceRadiusKm: dto.serviceRadiusKm || 25,
        travelsToClient: dto.travelsToClient ?? true,
        bio: dto.bio,
        yearsExperience: dto.yearsExperience,
        languagesSpoken: dto.languagesSpoken || ['English'],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // Update user status to active
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'active' },
    });

    return provider;
  }

  async getProviderById(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            status: true,
          },
        },
        documents: {
          where: {
            verificationStatus: 'verified',
          },
          select: {
            id: true,
            documentType: true,
            expiryDate: true,
            verificationStatus: true,
          },
        },
        services: true,
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async getProviderByUserId(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            status: true,
          },
        },
        documents: {
          select: {
            id: true,
            documentType: true,
            expiryDate: true,
            verificationStatus: true,
          },
        },
        services: true,
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return provider;
  }

  async updateProvider(userId: string, dto: UpdateProviderDto) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const updated = await this.prisma.provider.update({
      where: { userId },
      data: {
        ...(dto.businessName && { businessName: dto.businessName }),
        ...(dto.businessType && { businessType: dto.businessType as any }),
        ...(dto.ndisRegistrationNumber !== undefined && {
          ndisRegistrationNumber: dto.ndisRegistrationNumber,
        }),
        ...(dto.isNdisRegistered !== undefined && {
          isNdisRegistered: dto.isNdisRegistered,
        }),
        ...(dto.serviceTypes && { serviceTypes: dto.serviceTypes as any[] }),
        ...(dto.serviceStates && { serviceStates: dto.serviceStates as any[] }),
        ...(dto.servicePostcodes && { servicePostcodes: dto.servicePostcodes }),
        ...(dto.serviceRadiusKm !== undefined && {
          serviceRadiusKm: dto.serviceRadiusKm,
        }),
        ...(dto.travelsToClient !== undefined && {
          travelsToClient: dto.travelsToClient,
        }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.yearsExperience !== undefined && {
          yearsExperience: dto.yearsExperience,
        }),
        ...(dto.languagesSpoken && { languagesSpoken: dto.languagesSpoken }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updated;
  }

  async updateServiceArea(userId: string, dto: UpdateServiceAreaDto) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.provider.update({
      where: { userId },
      data: {
        serviceStates: dto.serviceStates as any[],
        servicePostcodes: dto.servicePostcodes || [],
        serviceRadiusKm: dto.serviceRadiusKm ?? provider.serviceRadiusKm,
        travelsToClient: dto.travelsToClient ?? provider.travelsToClient,
      },
      select: {
        id: true,
        serviceStates: true,
        servicePostcodes: true,
        serviceRadiusKm: true,
        travelsToClient: true,
      },
    });
  }

  async updateBanking(userId: string, dto: UpdateBankingDto) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Encrypt account number before storing
    const encryptedAccountNumber = this.encryptAccountNumber(dto.bankAccountNumber);

    return this.prisma.provider.update({
      where: { userId },
      data: {
        bankAccountName: dto.bankAccountName,
        bankBsb: dto.bankBsb.replace('-', ''),
        bankAccountNumberEncrypted: encryptedAccountNumber,
      },
      select: {
        id: true,
        bankAccountName: true,
        bankBsb: true,
      },
    });
  }

  async searchProviders(options: {
    serviceType?: string;
    state?: string;
    postcode?: string;
    minRating?: number;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      complianceStatus: 'verified',
      user: {
        status: 'active',
      },
    };

    if (options.serviceType) {
      where.serviceTypes = {
        has: options.serviceType,
      };
    }

    if (options.state) {
      where.serviceStates = {
        has: options.state,
      };
    }

    if (options.postcode) {
      where.OR = [
        { servicePostcodes: { has: options.postcode } },
        { servicePostcodes: { isEmpty: true } }, // Serves entire state
      ];
    }

    if (options.minRating) {
      where.averageRating = {
        gte: options.minRating,
      };
    }

    const [providers, total] = await Promise.all([
      this.prisma.provider.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { averageRating: 'desc' },
          { totalCompletedBookings: 'desc' },
        ],
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
              suburb: true,
              state: true,
            },
          },
        },
      }),
      this.prisma.provider.count({ where }),
    ]);

    return {
      providers: providers.map((p) => ({
        id: p.id,
        businessName: p.businessName,
        firstName: p.user.firstName,
        lastName: p.user.lastName,
        avatarUrl: p.user.avatarUrl,
        location: p.user.suburb ? `${p.user.suburb}, ${p.user.state}` : null,
        serviceTypes: p.serviceTypes,
        averageRating: p.averageRating,
        totalReviews: p.totalReviews,
        fairPriceScore: p.fairPriceScore,
        bio: p.bio,
        yearsExperience: p.yearsExperience,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProviderStats(providerId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
      select: {
        averageRating: true,
        totalReviews: true,
        totalCompletedBookings: true,
        responseRate: true,
        averageResponseTimeHours: true,
        fairPriceScore: true,
        complianceStatus: true,
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  private encryptAccountNumber(accountNumber: string): string {
    // In production, use proper encryption with AWS KMS or similar
    const key = process.env.ENCRYPTION_KEY || 'default-dev-key-32-chars-long!!';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.slice(0, 32)), iv);
    let encrypted = cipher.update(accountNumber, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }
}
