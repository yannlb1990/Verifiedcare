import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto, EmailTemplate } from './dto';

/**
 * Email Service - Mock Mode
 *
 * This service provides mock implementations of SendGrid functionality.
 * When SENDGRID_API_KEY is configured, it will use real SendGrid API.
 * For now, all methods log emails and return mock responses.
 *
 * To activate real SendGrid:
 * 1. Add SENDGRID_API_KEY to .env
 * 2. Add SENDGRID_FROM_EMAIL to .env
 * 3. Install sendgrid package: pnpm add @sendgrid/mail
 * 4. Uncomment the real SendGrid implementation below
 */

export interface EmailResult {
  success: boolean;
  messageId: string;
  to: string;
  subject: string;
  mockMode: boolean;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly mockMode: boolean;
  private readonly fromEmail: string;
  private readonly fromName: string = 'Verified Care';

  // Store sent emails for testing
  private sentEmails: Array<{
    to: string;
    subject: string;
    sentAt: Date;
    template?: string;
  }> = [];

  constructor() {
    this.mockMode = !process.env.SENDGRID_API_KEY;
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@verifiedcare.com.au';

    if (this.mockMode) {
      this.logger.warn('Email service running in MOCK MODE - no real emails will be sent');
    }
  }

  /**
   * Check if service is in mock mode
   */
  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Get sent emails (for testing)
   */
  getSentEmails() {
    return this.sentEmails;
  }

  /**
   * Clear sent emails (for testing)
   */
  clearSentEmails() {
    this.sentEmails = [];
  }

  /**
   * Send a single email
   */
  async sendEmail(dto: SendEmailDto): Promise<EmailResult> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (this.mockMode) {
      this.logger.log(`[MOCK EMAIL] To: ${dto.to} | Subject: ${dto.subject}`);
      if (dto.html) {
        this.logger.debug(`[MOCK EMAIL] HTML Content: ${dto.html.substring(0, 100)}...`);
      }

      this.sentEmails.push({
        to: dto.to,
        subject: dto.subject,
        sentAt: new Date(),
        template: dto.templateId,
      });

      return {
        success: true,
        messageId,
        to: dto.to,
        subject: dto.subject,
        mockMode: true,
      };
    }

    // TODO: Real SendGrid implementation
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from, subject, text, html });
    throw new Error('SendGrid not configured');
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmail(
    recipients: string[],
    subject: string,
    content: { text?: string; html?: string },
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const to of recipients) {
      const result = await this.sendEmail({
        to,
        subject,
        text: content.text,
        html: content.html,
      });
      results.push(result);
    }

    return results;
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: 'Welcome to Verified Care!',
      html: this.getWelcomeEmailHtml(name),
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: 'Reset Your Password - Verified Care',
      html: this.getPasswordResetEmailHtml(name, resetLink),
    });
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmationEmail(
    to: string,
    data: {
      participantName: string;
      providerName: string;
      serviceName: string;
      date: string;
      time: string;
      address: string;
      bookingId: string;
    },
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: `Booking Confirmed - ${data.serviceName}`,
      html: this.getBookingConfirmationEmailHtml(data),
    });
  }

  /**
   * Send invoice email
   */
  async sendInvoiceEmail(
    to: string,
    data: {
      participantName: string;
      providerName: string;
      invoiceNumber: string;
      amount: number;
      dueDate: string;
      invoiceLink: string;
    },
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: `Invoice ${data.invoiceNumber} from ${data.providerName}`,
      html: this.getInvoiceEmailHtml(data),
    });
  }

  /**
   * Send payment received email
   */
  async sendPaymentReceivedEmail(
    to: string,
    data: {
      providerName: string;
      invoiceNumber: string;
      amount: number;
      paymentDate: string;
    },
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: `Payment Received - Invoice ${data.invoiceNumber}`,
      html: this.getPaymentReceivedEmailHtml(data),
    });
  }

  // Email HTML Templates
  private getBaseEmailHtml(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f5f2ed; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #2D5A4A; padding: 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 32px 24px; }
    .button { display: inline-block; background: #2D5A4A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
    .button:hover { background: #1B4D3E; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; }
    .highlight { background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verified Care</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Verified Care - Connecting NDIS participants with verified providers</p>
      <p>This email was sent by Verified Care. If you didn't expect this email, please ignore it.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private getWelcomeEmailHtml(name: string): string {
    return this.getBaseEmailHtml(`
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for joining Verified Care. We're excited to have you on board.</p>
      <p>Verified Care connects NDIS participants with verified, quality service providers for:</p>
      <ul>
        <li>Domestic Cleaning</li>
        <li>Community Transport</li>
        <li>Yard Maintenance</li>
      </ul>
      <div class="highlight">
        <strong>What's next?</strong>
        <p>Complete your profile to start booking services or offering your services.</p>
      </div>
      <p style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard" class="button">Go to Dashboard</a>
      </p>
    `);
  }

  private getPasswordResetEmailHtml(name: string, resetLink: string): string {
    return this.getBaseEmailHtml(`
      <h2>Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      <p style="font-size: 14px; color: #6b7280;">This link will expire in 1 hour.</p>
      <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, you can safely ignore this email.</p>
    `);
  }

  private getBookingConfirmationEmailHtml(data: {
    participantName: string;
    providerName: string;
    serviceName: string;
    date: string;
    time: string;
    address: string;
    bookingId: string;
  }): string {
    return this.getBaseEmailHtml(`
      <h2>Booking Confirmed!</h2>
      <p>Hi ${data.participantName},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      <div class="highlight">
        <p><strong>Service:</strong> ${data.serviceName}</p>
        <p><strong>Provider:</strong> ${data.providerName}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Location:</strong> ${data.address}</p>
        <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      </div>
      <p>Your provider will arrive at the scheduled time. You'll receive a notification when they check in.</p>
      <p style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/bookings/${data.bookingId}" class="button">View Booking</a>
      </p>
    `);
  }

  private getInvoiceEmailHtml(data: {
    participantName: string;
    providerName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    invoiceLink: string;
  }): string {
    return this.getBaseEmailHtml(`
      <h2>New Invoice</h2>
      <p>Hi ${data.participantName},</p>
      <p>You have received a new invoice from ${data.providerName}.</p>
      <div class="highlight">
        <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
        <p><strong>Amount Due:</strong> $${data.amount.toFixed(2)} AUD</p>
        <p><strong>Due Date:</strong> ${data.dueDate}</p>
      </div>
      <p style="text-align: center; margin-top: 24px;">
        <a href="${data.invoiceLink}" class="button">View Invoice</a>
      </p>
    `);
  }

  private getPaymentReceivedEmailHtml(data: {
    providerName: string;
    invoiceNumber: string;
    amount: number;
    paymentDate: string;
  }): string {
    return this.getBaseEmailHtml(`
      <h2>Payment Received</h2>
      <p>Hi ${data.providerName},</p>
      <p>Great news! A payment has been received for your invoice.</p>
      <div class="highlight">
        <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
        <p><strong>Amount Received:</strong> $${data.amount.toFixed(2)} AUD</p>
        <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
      </div>
      <p>The funds will be transferred to your bank account within 2-3 business days.</p>
      <p style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/provider/invoices" class="button">View Invoices</a>
      </p>
    `);
  }
}
