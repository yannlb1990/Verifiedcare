import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty({ example: '+61412345678' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Your booking has been confirmed for tomorrow at 9am' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Custom sender ID (if supported)' })
  @IsString()
  @IsOptional()
  from?: string;
}

export class SendBulkSmsDto {
  @ApiProperty({ type: [String], description: 'Array of phone numbers' })
  @IsArray()
  @IsString({ each: true })
  to: string[];

  @ApiProperty()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  from?: string;
}

export enum SmsTemplate {
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CONFIRMED = 'booking_confirmed',
  PROVIDER_ARRIVED = 'provider_arrived',
  SERVICE_COMPLETE = 'service_complete',
  PAYMENT_RECEIVED = 'payment_received',
  VERIFICATION_CODE = 'verification_code',
}
