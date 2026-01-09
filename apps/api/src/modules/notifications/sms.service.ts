import { Injectable, Logger } from '@nestjs/common';
import { SendSmsDto, SmsTemplate } from './dto';

/**
 * SMS Service - Mock Mode
 *
 * This service provides mock implementations of Twilio functionality.
 * When TWILIO credentials are configured, it will use real Twilio API.
 * For now, all methods log SMS and return mock responses.
 *
 * To activate real Twilio:
 * 1. Add TWILIO_ACCOUNT_SID to .env
 * 2. Add TWILIO_AUTH_TOKEN to .env
 * 3. Add TWILIO_PHONE_NUMBER to .env
 * 4. Install twilio package: pnpm add twilio
 * 5. Uncomment the real Twilio implementation below
 */

export interface SmsResult {
  success: boolean;
  messageId: string;
  to: string;
  mockMode: boolean;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly mockMode: boolean;
  private readonly fromNumber: string;

  // Store sent SMS for testing
  private sentSms: Array<{
    to: string;
    message: string;
    sentAt: Date;
  }> = [];

  constructor() {
    this.mockMode = !process.env.TWILIO_ACCOUNT_SID;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+61400000000';

    if (this.mockMode) {
      this.logger.warn('SMS service running in MOCK MODE - no real SMS will be sent');
    }
  }

  /**
   * Check if service is in mock mode
   */
  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Get sent SMS (for testing)
   */
  getSentSms() {
    return this.sentSms;
  }

  /**
   * Clear sent SMS (for testing)
   */
  clearSentSms() {
    this.sentSms = [];
  }

  /**
   * Format Australian phone number
   */
  private formatPhoneNumber(phone: string): string {
    // Remove spaces and dashes
    let formatted = phone.replace(/[\s-]/g, '');

    // Convert 04xx to +614xx
    if (formatted.startsWith('04')) {
      formatted = '+61' + formatted.substring(1);
    }

    // Ensure it starts with +
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }

    return formatted;
  }

  /**
   * Send a single SMS
   */
  async sendSms(dto: SendSmsDto): Promise<SmsResult> {
    const messageId = `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const formattedTo = this.formatPhoneNumber(dto.to);

    if (this.mockMode) {
      this.logger.log(`[MOCK SMS] To: ${formattedTo} | Message: ${dto.message}`);

      this.sentSms.push({
        to: formattedTo,
        message: dto.message,
        sentAt: new Date(),
      });

      return {
        success: true,
        messageId,
        to: formattedTo,
        mockMode: true,
      };
    }

    // TODO: Real Twilio implementation
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilio.messages.create({ body: dto.message, from: this.fromNumber, to: formattedTo });
    throw new Error('Twilio not configured');
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSms(recipients: string[], message: string): Promise<SmsResult[]> {
    const results: SmsResult[] = [];

    for (const to of recipients) {
      const result = await this.sendSms({ to, message });
      results.push(result);
    }

    return results;
  }

  /**
   * Send booking reminder SMS
   */
  async sendBookingReminder(
    to: string,
    data: {
      providerName: string;
      serviceName: string;
      date: string;
      time: string;
    },
  ): Promise<SmsResult> {
    const message = `Verified Care: Reminder - Your ${data.serviceName} with ${data.providerName} is scheduled for ${data.date} at ${data.time}. Reply HELP for assistance.`;
    return this.sendSms({ to, message });
  }

  /**
   * Send booking confirmation SMS
   */
  async sendBookingConfirmation(
    to: string,
    data: {
      providerName: string;
      serviceName: string;
      date: string;
      time: string;
    },
  ): Promise<SmsResult> {
    const message = `Verified Care: Your booking is confirmed! ${data.serviceName} with ${data.providerName} on ${data.date} at ${data.time}. We'll notify you when your provider arrives.`;
    return this.sendSms({ to, message });
  }

  /**
   * Send provider arrived notification
   */
  async sendProviderArrivedNotification(
    to: string,
    data: {
      providerName: string;
    },
  ): Promise<SmsResult> {
    const message = `Verified Care: ${data.providerName} has arrived and checked in for your service. If this is unexpected, please contact us immediately.`;
    return this.sendSms({ to, message });
  }

  /**
   * Send service complete notification
   */
  async sendServiceCompleteNotification(
    to: string,
    data: {
      providerName: string;
      duration: string;
    },
  ): Promise<SmsResult> {
    const message = `Verified Care: Your service with ${data.providerName} is complete (${data.duration}). Please confirm the service in your app to approve the invoice.`;
    return this.sendSms({ to, message });
  }

  /**
   * Send payment received notification
   */
  async sendPaymentReceivedNotification(
    to: string,
    data: {
      amount: number;
      invoiceNumber: string;
    },
  ): Promise<SmsResult> {
    const message = `Verified Care: Payment of $${data.amount.toFixed(2)} received for invoice ${data.invoiceNumber}. Thank you!`;
    return this.sendSms({ to, message });
  }

  /**
   * Send verification code
   */
  async sendVerificationCode(to: string, code: string): Promise<SmsResult> {
    const message = `Your Verified Care verification code is: ${code}. This code expires in 10 minutes. Do not share this code with anyone.`;
    return this.sendSms({ to, message });
  }

  /**
   * Send provider approval notification
   */
  async sendProviderApprovedNotification(to: string, businessName: string): Promise<SmsResult> {
    const message = `Verified Care: Congratulations! ${businessName} has been approved. You can now receive bookings. Log in to set up your availability.`;
    return this.sendSms({ to, message });
  }

  /**
   * Send document expiry warning
   */
  async sendDocumentExpiryWarning(
    to: string,
    data: {
      documentName: string;
      expiryDate: string;
    },
  ): Promise<SmsResult> {
    const message = `Verified Care: Your ${data.documentName} expires on ${data.expiryDate}. Please upload a new document to continue receiving bookings.`;
    return this.sendSms({ to, message });
  }
}
