import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface AbnLookupResult {
  abn: string;
  abnStatus: string;
  abnStatusEffectiveFrom: string;
  entityName: string;
  entityType: string;
  gstRegistered: boolean;
  gstRegisteredFrom?: string;
  state: string;
  postcode: string;
}

@Injectable()
export class AbnVerificationService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async verifyAbn(abn: string): Promise<AbnLookupResult> {
    // Remove spaces and validate format
    const cleanAbn = abn.replace(/\s/g, '');

    if (!/^\d{11}$/.test(cleanAbn)) {
      throw new BadRequestException('ABN must be exactly 11 digits');
    }

    // Validate ABN checksum
    if (!this.isValidAbnChecksum(cleanAbn)) {
      throw new BadRequestException('Invalid ABN checksum');
    }

    const guid = this.config.get<string>('ABR_GUID');

    // If no GUID configured, use mock data for development
    if (!guid) {
      console.warn('ABR_GUID not configured, using mock data');
      return this.getMockAbnData(cleanAbn);
    }

    try {
      // Call ABR Web Services API
      const response = await fetch(
        `https://abr.business.gov.au/abrxmlsearch/AbrXmlSearch.asmx/SearchByABNv202001?` +
        `searchString=${cleanAbn}&includeHistoricalDetails=N&authenticationGuid=${guid}`
      );

      if (!response.ok) {
        throw new Error('ABR API request failed');
      }

      const xmlText = await response.text();
      return this.parseAbrResponse(xmlText, cleanAbn);
    } catch (error) {
      console.error('ABR verification error:', error);
      // Fallback to mock data in development
      if (this.config.get('NODE_ENV') !== 'production') {
        return this.getMockAbnData(cleanAbn);
      }
      throw new BadRequestException('Unable to verify ABN at this time');
    }
  }

  async verifyAndUpdateProvider(userId: string, abn: string): Promise<AbnLookupResult> {
    const result = await this.verifyAbn(abn);

    // Update provider with verification result
    await this.prisma.provider.update({
      where: { userId },
      data: {
        abnVerifiedAt: new Date(),
        abnStatus: result.abnStatus,
        gstRegistered: result.gstRegistered,
      },
    });

    return result;
  }

  private isValidAbnChecksum(abn: string): boolean {
    // ABN validation algorithm
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const digits = abn.split('').map(Number);

    // Subtract 1 from first digit
    digits[0] -= 1;

    // Calculate weighted sum
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      sum += digits[i] * weights[i];
    }

    // Check if divisible by 89
    return sum % 89 === 0;
  }

  private parseAbrResponse(xml: string, abn: string): AbnLookupResult {
    // Simple XML parsing for ABR response
    const getTag = (tag: string): string => {
      const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
      return match ? match[1] : '';
    };

    const abnStatus = getTag('ABNStatus') || 'Unknown';
    const entityName = getTag('OrganisationName') || getTag('GivenName') + ' ' + getTag('FamilyName');
    const gstStatus = getTag('GSTStatus');
    const state = getTag('StateCode');
    const postcode = getTag('Postcode');

    return {
      abn,
      abnStatus,
      abnStatusEffectiveFrom: getTag('ABNStatusFromDate'),
      entityName: entityName.trim(),
      entityType: getTag('EntityTypeCode'),
      gstRegistered: gstStatus === 'Active',
      gstRegisteredFrom: getTag('GSTStatusFromDate'),
      state,
      postcode,
    };
  }

  private getMockAbnData(abn: string): AbnLookupResult {
    // Mock data for development/testing
    return {
      abn,
      abnStatus: 'Active',
      abnStatusEffectiveFrom: '2020-01-01',
      entityName: 'Mock Business Entity Pty Ltd',
      entityType: 'PRV',
      gstRegistered: true,
      gstRegisteredFrom: '2020-01-01',
      state: 'VIC',
      postcode: '3000',
    };
  }
}
