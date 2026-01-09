import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  NDIS_PLAN = 'ndis_plan',
}

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Invoice ID to pay' })
  @IsUUID()
  invoiceId: string;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Payment intent ID from Stripe' })
  @IsString()
  paymentIntentId: string;

  @ApiPropertyOptional({ description: 'Payment method ID from Stripe' })
  @IsString()
  @IsOptional()
  paymentMethodId?: string;
}

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsUUID()
  paymentId: string;

  @ApiPropertyOptional({ description: 'Amount to refund (partial refund)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'Reason for refund' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CreatePayoutDto {
  @ApiProperty({ description: 'Provider ID for payout' })
  @IsUUID()
  providerId: string;

  @ApiPropertyOptional({ description: 'Specific invoice IDs to payout' })
  @IsUUID('4', { each: true })
  @IsOptional()
  invoiceIds?: string[];
}
