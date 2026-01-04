import {
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceLineItemDto {
  @ApiProperty({ description: 'Booking ID for this line item' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ example: 'Domestic cleaning service - 3 hours' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({ example: '01_011_0107_1_1' })
  @IsString()
  @IsOptional()
  ndisItemNumber?: string;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  serviceDate: string;

  @ApiProperty({ example: 3, description: 'Quantity (hours or units)' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'hours' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 55.50, description: 'Rate per unit' })
  @IsNumber()
  unitRate: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  gstApplicable?: boolean;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsUUID()
  providerId: string;

  @ApiProperty({ description: 'Participant ID' })
  @IsUUID()
  participantId: string;

  @ApiPropertyOptional({ example: 'self', description: 'Bill to type: self, plan, agency' })
  @IsString()
  @IsOptional()
  billToType?: string;

  @ApiPropertyOptional({ description: 'Plan manager ID if plan managed' })
  @IsUUID()
  @IsOptional()
  planManagerId?: string;

  @ApiProperty({ type: [InvoiceLineItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineItemDto)
  lineItems: InvoiceLineItemDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
