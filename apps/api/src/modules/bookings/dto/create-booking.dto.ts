import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ServiceType {
  DOMESTIC_CLEANING = 'domestic_cleaning',
  COMMUNITY_TRANSPORT = 'community_transport',
  YARD_MAINTENANCE = 'yard_maintenance',
}

export enum AustralianState {
  VIC = 'VIC',
  NSW = 'NSW',
  QLD = 'QLD',
  SA = 'SA',
  WA = 'WA',
  NT = 'NT',
  TAS = 'TAS',
  ACT = 'ACT',
}

export class CreateBookingDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Provider service ID' })
  @IsUUID()
  providerServiceId: string;

  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @ApiProperty({ example: '2026-01-15', description: 'Date of service' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ example: '09:00', description: 'Start time (HH:mm)' })
  @IsString()
  scheduledStartTime: string;

  @ApiProperty({ example: '12:00', description: 'End time (HH:mm)' })
  @IsString()
  scheduledEndTime: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  serviceAddressLine1?: string;

  @ApiPropertyOptional({ example: 'Unit 5' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  serviceAddressLine2?: string;

  @ApiPropertyOptional({ example: 'Melbourne' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  serviceSuburb?: string;

  @ApiPropertyOptional({ enum: AustralianState })
  @IsEnum(AustralianState)
  @IsOptional()
  serviceState?: AustralianState;

  @ApiPropertyOptional({ example: '3000' })
  @IsString()
  @IsOptional()
  servicePostcode?: string;

  @ApiPropertyOptional({ example: -37.8136 })
  @IsNumber()
  @IsOptional()
  serviceLatitude?: number;

  @ApiPropertyOptional({ example: 144.9631 })
  @IsNumber()
  @IsOptional()
  serviceLongitude?: number;

  @ApiPropertyOptional({ description: 'Notes for the provider' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  participantNotes?: string;
}
