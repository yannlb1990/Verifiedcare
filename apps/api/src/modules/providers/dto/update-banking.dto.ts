import { IsString, IsOptional, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBankingDto {
  @ApiProperty({ example: 'John Smith Trading' })
  @IsString()
  @MaxLength(255)
  bankAccountName: string;

  @ApiProperty({ example: '063-000', description: 'Bank BSB number' })
  @IsString()
  @Matches(/^\d{3}-?\d{3}$/, { message: 'BSB must be 6 digits (format: 000-000 or 000000)' })
  bankBsb: string;

  @ApiProperty({ example: '12345678', description: 'Bank account number' })
  @IsString()
  @Matches(/^\d{6,10}$/, { message: 'Account number must be 6-10 digits' })
  bankAccountNumber: string;
}
