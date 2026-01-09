import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  to: string;

  @ApiProperty({ example: 'Welcome to Verified Care' })
  @IsString()
  subject: string;

  @ApiPropertyOptional({ description: 'Plain text content' })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({ description: 'HTML content' })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiPropertyOptional({ description: 'SendGrid template ID' })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Dynamic template data' })
  @IsObject()
  @IsOptional()
  templateData?: Record<string, any>;
}

export class SendBulkEmailDto {
  @ApiProperty({ type: [String], description: 'Array of email addresses' })
  @IsArray()
  @IsEmail({}, { each: true })
  to: string[];

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  html?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  templateData?: Record<string, any>;
}

export enum EmailTemplate {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  INVOICE_SENT = 'invoice_sent',
  PAYMENT_RECEIVED = 'payment_received',
  PROVIDER_APPROVED = 'provider_approved',
  DOCUMENT_EXPIRING = 'document_expiring',
}
