import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BusinessType {
  SOLE_TRADER = 'sole_trader',
  COMPANY = 'company',
  PARTNERSHIP = 'partnership',
  TRUST = 'trust',
}

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

export class CreateProviderDto {
  @ApiProperty({ example: 'Clean & Care Services' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  businessName: string;

  @ApiProperty({ example: '12345678901', description: 'Australian Business Number (11 digits)' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'ABN must be exactly 11 digits' })
  abn: string;

  @ApiPropertyOptional({ example: '123456789', description: 'Australian Company Number (9 digits)' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{9}$/, { message: 'ACN must be exactly 9 digits' })
  acn?: string;

  @ApiProperty({ enum: BusinessType, example: BusinessType.SOLE_TRADER })
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @ApiPropertyOptional({ example: '4-1234-5678' })
  @IsString()
  @IsOptional()
  ndisRegistrationNumber?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isNdisRegistered?: boolean;

  @ApiProperty({
    type: [String],
    enum: ServiceType,
    example: [ServiceType.DOMESTIC_CLEANING, ServiceType.YARD_MAINTENANCE]
  })
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  serviceTypes: ServiceType[];

  @ApiProperty({
    type: [String],
    enum: AustralianState,
    example: [AustralianState.VIC, AustralianState.NSW]
  })
  @IsArray()
  @IsEnum(AustralianState, { each: true })
  serviceStates: AustralianState[];

  @ApiPropertyOptional({ type: [String], example: ['3000', '3001', '3002'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  servicePostcodes?: string[];

  @ApiPropertyOptional({ example: 25, description: 'Service radius in kilometers' })
  @IsNumber()
  @IsOptional()
  serviceRadiusKm?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  travelsToClient?: boolean;

  @ApiPropertyOptional({ example: 'Professional cleaning services with 10+ years experience.' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  yearsExperience?: number;

  @ApiPropertyOptional({ type: [String], example: ['English', 'Mandarin'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languagesSpoken?: string[];
}
