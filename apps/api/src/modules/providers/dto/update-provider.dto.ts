import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessType, ServiceType, AustralianState } from './create-provider.dto';

export class UpdateProviderDto {
  @ApiPropertyOptional({ example: 'Clean & Care Services Updated' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  businessName?: string;

  @ApiPropertyOptional({ enum: BusinessType })
  @IsEnum(BusinessType)
  @IsOptional()
  businessType?: BusinessType;

  @ApiPropertyOptional({ example: '4-1234-5678' })
  @IsString()
  @IsOptional()
  ndisRegistrationNumber?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isNdisRegistered?: boolean;

  @ApiPropertyOptional({ type: [String], enum: ServiceType })
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  @IsOptional()
  serviceTypes?: ServiceType[];

  @ApiPropertyOptional({ type: [String], enum: AustralianState })
  @IsArray()
  @IsEnum(AustralianState, { each: true })
  @IsOptional()
  serviceStates?: AustralianState[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  servicePostcodes?: string[];

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  serviceRadiusKm?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  travelsToClient?: boolean;

  @ApiPropertyOptional({ example: 'Updated bio with more details.' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsNumber()
  @IsOptional()
  yearsExperience?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languagesSpoken?: string[];
}
