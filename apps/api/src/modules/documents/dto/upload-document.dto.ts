import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DocumentType {
  PUBLIC_LIABILITY_INSURANCE = 'public_liability_insurance',
  PROFESSIONAL_INDEMNITY_INSURANCE = 'professional_indemnity_insurance',
  WORKERS_COMPENSATION = 'workers_compensation',
  NDIS_WORKER_SCREENING = 'ndis_worker_screening',
  WWCC = 'wwcc',
  POLICE_CHECK = 'police_check',
  FIRST_AID_CERTIFICATE = 'first_aid_certificate',
  COVID_VACCINATION = 'covid_vaccination',
  AHPRA_REGISTRATION = 'ahpra_registration',
  DRIVERS_LICENSE = 'drivers_license',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  VEHICLE_INSURANCE = 'vehicle_insurance',
  ABN_CERTIFICATE = 'abn_certificate',
  OTHER = 'other',
}

export class UploadDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.PUBLIC_LIABILITY_INSURANCE,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiPropertyOptional({
    example: 'PLI-12345678',
    description: 'Document or policy number',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  documentNumber?: string;

  @ApiPropertyOptional({
    example: 'QBE Insurance',
    description: 'Issuing authority or organization',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  issuingAuthority?: string;

  @ApiPropertyOptional({
    example: '2024-01-15',
    description: 'Date document was issued',
  })
  @IsDateString()
  @IsOptional()
  issuedDate?: string;

  @ApiPropertyOptional({
    example: '2025-01-15',
    description: 'Document expiry date',
  })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}
