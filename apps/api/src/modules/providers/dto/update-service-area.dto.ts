import {
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AustralianState } from './create-provider.dto';

export class UpdateServiceAreaDto {
  @ApiProperty({
    type: [String],
    enum: AustralianState,
    example: ['VIC', 'NSW']
  })
  @IsArray()
  @IsEnum(AustralianState, { each: true })
  serviceStates: AustralianState[];

  @ApiPropertyOptional({
    type: [String],
    example: ['3000', '3001', '3002'],
    description: 'Specific postcodes to service (leave empty to service entire states)'
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  servicePostcodes?: string[];

  @ApiPropertyOptional({
    example: 25,
    description: 'Maximum distance willing to travel (in km)',
    minimum: 5,
    maximum: 200
  })
  @IsNumber()
  @Min(5)
  @Max(200)
  @IsOptional()
  serviceRadiusKm?: number;

  @ApiPropertyOptional({
    default: true,
    description: 'Whether provider travels to client location'
  })
  @IsBoolean()
  @IsOptional()
  travelsToClient?: boolean;
}
