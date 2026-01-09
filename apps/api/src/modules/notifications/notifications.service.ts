import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * Get notification service status
   */
  getStatus() {
    return {
      email: {
        provider: 'sendgrid',
        mockMode: this.emailService.isMockMode(),
      },
      sms: {
        provider: 'twilio',
        mockMode: this.smsService.isMockMode(),
      },
    };
  }

  /**
   * Send welcome notifications
   */
  async sendWelcomeNotifications(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const results = {
      email: null as any,
      sms: null as any,
    };

    // Send welcome email
    if (user.email) {
      results.email = await this.emailService.sendWelcomeEmail(
        user.email,
        user.firstName,
      );
    }

    // Send welcome SMS if phone available
    if (user.phone) {
      results.sms = await this.smsService.sendSms({
        to: user.phone,
        message: `Welcome to Verified Care, ${user.firstName}! Your account is ready. Log in to get started.`,
      });
    }

    // Store notification
    await this.createNotificationRecord(userId, 'welcome', results);

    return results;
  }

  /**
   * Send booking confirmation notifications
   */
  async sendBookingConfirmationNotifications(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        participant: { include: { user: true } },
        provider: { include: { user: true } },
        providerService: true,
      },
    });

    if (!booking) return;

    const results = {
      participantEmail: null as any,
      participantSms: null as any,
      providerEmail: null as any,
      providerSms: null as any,
    };

    // Format time from DateTime
    const startTime = booking.scheduledStartTime
      ? new Date(booking.scheduledStartTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
      : 'TBD';

    const bookingData = {
      participantName: `${booking.participant.user.firstName} ${booking.participant.user.lastName}`,
      providerName: booking.provider.businessName || `${booking.provider.user.firstName} ${booking.provider.user.lastName}`,
      serviceName: booking.providerService?.serviceName || booking.serviceType,
      date: booking.scheduledDate.toLocaleDateString('en-AU'),
      time: startTime,
      address: [booking.serviceAddressLine1, booking.serviceSuburb, booking.serviceState].filter(Boolean).join(', '),
      bookingId: booking.id,
    };

    // Notify participant
    if (booking.participant.user.email) {
      results.participantEmail = await this.emailService.sendBookingConfirmationEmail(
        booking.participant.user.email,
        bookingData,
      );
    }

    if (booking.participant.user.phone) {
      results.participantSms = await this.smsService.sendBookingConfirmation(
        booking.participant.user.phone,
        bookingData,
      );
    }

    // Store notification
    await this.createNotificationRecord(
      booking.participant.userId,
      'booking_confirmed',
      results,
    );

    return results;
  }

  /**
   * Send provider check-in notification to participant
   */
  async sendProviderArrivedNotification(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        participant: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });

    if (!booking) return;

    const providerName = booking.provider.businessName ||
      `${booking.provider.user.firstName} ${booking.provider.user.lastName}`;

    const results = {
      sms: null as any,
    };

    if (booking.participant.user.phone) {
      results.sms = await this.smsService.sendProviderArrivedNotification(
        booking.participant.user.phone,
        { providerName },
      );
    }

    await this.createNotificationRecord(
      booking.participant.userId,
      'provider_arrived',
      results,
    );

    return results;
  }

  /**
   * Send service complete notification
   */
  async sendServiceCompleteNotification(bookingId: string, duration: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        participant: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });

    if (!booking) return;

    const providerName = booking.provider.businessName ||
      `${booking.provider.user.firstName} ${booking.provider.user.lastName}`;

    if (booking.participant.user.phone) {
      await this.smsService.sendServiceCompleteNotification(
        booking.participant.user.phone,
        { providerName, duration },
      );
    }
  }

  /**
   * Send invoice notification
   */
  async sendInvoiceNotification(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        participant: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });

    if (!invoice) return;

    const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/invoices/${invoice.id}`;

    if (invoice.participant.user.email) {
      await this.emailService.sendInvoiceEmail(invoice.participant.user.email, {
        participantName: `${invoice.participant.user.firstName} ${invoice.participant.user.lastName}`,
        providerName: invoice.provider.businessName || `${invoice.provider.user.firstName}`,
        invoiceNumber: invoice.invoiceNumber,
        amount: Number(invoice.totalAmount),
        dueDate: invoice.dueDate.toLocaleDateString('en-AU'),
        invoiceLink,
      });
    }
  }

  /**
   * Send payment received notification to provider
   */
  async sendPaymentReceivedNotification(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: {
          include: {
            provider: { include: { user: true } },
          },
        },
      },
    });

    if (!payment) return;

    const provider = payment.invoice.provider;

    if (provider.user.email) {
      await this.emailService.sendPaymentReceivedEmail(provider.user.email, {
        providerName: provider.businessName || provider.user.firstName,
        invoiceNumber: payment.invoice.invoiceNumber,
        amount: Number(payment.amount),
        paymentDate: new Date().toLocaleDateString('en-AU'),
      });
    }

    if (provider.user.phone) {
      await this.smsService.sendPaymentReceivedNotification(provider.user.phone, {
        amount: Number(payment.amount),
        invoiceNumber: payment.invoice.invoiceNumber,
      });
    }
  }

  /**
   * Create notification record in database
   */
  private async createNotificationRecord(
    userId: string,
    type: string,
    data: any,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title: this.getNotificationTitle(type),
        body: this.getNotificationMessage(type),
        actionData: data,
      },
    });
  }

  private getNotificationTitle(type: string): string {
    const titles: Record<string, string> = {
      welcome: 'Welcome to Verified Care',
      booking_confirmed: 'Booking Confirmed',
      provider_arrived: 'Provider Has Arrived',
      service_complete: 'Service Complete',
      invoice_sent: 'New Invoice',
      payment_received: 'Payment Received',
    };
    return titles[type] || 'Notification';
  }

  private getNotificationMessage(type: string): string {
    const messages: Record<string, string> = {
      welcome: 'Your account is ready. Start exploring services.',
      booking_confirmed: 'Your booking has been confirmed.',
      provider_arrived: 'Your service provider has checked in.',
      service_complete: 'Your service has been completed.',
      invoice_sent: 'You have received a new invoice.',
      payment_received: 'Payment has been received.',
    };
    return messages[type] || '';
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
