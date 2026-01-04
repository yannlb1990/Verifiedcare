import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a compliance document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (PDF, JPEG, PNG)',
        },
        documentType: {
          type: 'string',
          enum: [
            'public_liability_insurance',
            'professional_indemnity_insurance',
            'workers_compensation',
            'ndis_worker_screening',
            'wwcc',
            'police_check',
            'first_aid_certificate',
            'covid_vaccination',
            'ahpra_registration',
            'drivers_license',
            'vehicle_registration',
            'vehicle_insurance',
            'abn_certificate',
            'other',
          ],
        },
        documentNumber: { type: 'string' },
        issuingAuthority: { type: 'string' },
        issuedDate: { type: 'string', format: 'date' },
        expiryDate: { type: 'string', format: 'date' },
      },
      required: ['file', 'documentType'],
    },
  })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or document type' })
  async uploadDocument(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(pdf|jpeg|jpg|png|webp)$/i }),
        ],
      }),
    )
    file: any, // Multer file
    @Body() dto: UploadDocumentDto,
  ) {
    return this.documentsService.uploadDocument(
      user.id,
      {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      },
      dto,
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiOperation({ summary: 'Get all documents for current provider' })
  @ApiResponse({ status: 200, description: 'List of provider documents' })
  async getMyDocuments(@CurrentUser() user: CurrentUserData) {
    return this.documentsService.getProviderDocuments(user.id);
  }

  @Get('required')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiOperation({ summary: 'Get required documents status for provider' })
  @ApiResponse({ status: 200, description: 'Required documents with status' })
  async getRequiredDocuments(@CurrentUser() user: CurrentUserData) {
    return this.documentsService.getRequiredDocuments(user.id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiOperation({ summary: 'Get document by ID with download URL' })
  @ApiResponse({ status: 200, description: 'Document details with download URL' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.documentsService.getDocumentById(user.id, id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  @ApiResponse({ status: 403, description: 'Cannot delete verified documents' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.documentsService.deleteDocument(user.id, id);
  }

  // Admin endpoints
  @Post(':id/verify')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a document (admin only)' })
  @ApiResponse({ status: 200, description: 'Document verified' })
  async verifyDocument(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.documentsService.verifyDocument(id, user.id);
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a document (admin only)' })
  @ApiResponse({ status: 200, description: 'Document rejected' })
  async rejectDocument(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.documentsService.rejectDocument(id, user.id, reason);
  }
}
