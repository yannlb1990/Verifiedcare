import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CheckType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
}

export class CheckInDto {
  @ApiProperty({ enum: CheckType })
  @IsEnum(CheckType)
  checkType: CheckType;

  @ApiProperty({ example: -37.8136, description: 'Current latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 144.9631, description: 'Current longitude' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 10.5, description: 'GPS accuracy in meters' })
  @IsNumber()
  @IsOptional()
  accuracyMeters?: number;

  @ApiPropertyOptional({ description: 'Photo URL for verification' })
  @IsString()
  @IsOptional()
  photoUrl?: string;
}
