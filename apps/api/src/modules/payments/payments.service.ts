import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto, RefundPaymentDto, CreatePayoutDto } from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Create a payment intent for an invoice
   */
  async createPaymentIntent(userId: string, dto: CreatePaymentIntentDto) {
    // Get the invoice
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: dto.invoiceId },
      include: {
        participant: true,
        provider: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Verify user has access (participant or their coordinator)
    if (invoice.participant.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice is already paid');
    }

    if (invoice.status === 'cancelled') {
      throw new BadRequestException('Invoice is cancelled');
    }

    // Convert to cents for Stripe
    const amountInCents = Math.round(Number(invoice.totalAmount) * 100);

    // Create payment intent
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amountInCents,
      'aud',
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        participantId: invoice.participantId,
        providerId: invoice.providerId,
      },
    );

    // Store payment record
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.totalAmount,
        status: 'pending',
        paymentMethod: dto.paymentMethod || 'card',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.clientSecret,
      amount: invoice.totalAmount,
      currency: 'AUD',
      invoiceNumber: invoice.invoiceNumber,
      mockMode: this.stripeService.isMockMode(),
    };
  }

  /**
   * Confirm a payment (webhook or manual)
   */
  async confirmPayment(paymentIntentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { invoice: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Confirm with Stripe
    const confirmed = await this.stripeService.confirmPaymentIntent(paymentIntentId);

    if (confirmed.status === 'succeeded') {
      // Update payment status
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      // Update invoice status
      await this.prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          status: 'paid',
          amountPaid: payment.amount,
          paidAt: new Date(),
          paymentMethod: payment.paymentMethod,
        },
      });

      return {
        success: true,
        message: 'Payment confirmed',
        paymentId: payment.id,
        invoiceId: payment.invoiceId,
      };
    }

    return {
      success: false,
      message: 'Payment not yet confirmed',
      status: confirmed.status,
    };
  }

  /**
   * Process refund
   */
  async refundPayment(userId: string, dto: RefundPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
      include: {
        invoice: {
          include: { provider: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Only provider can initiate refunds
    if (payment.invoice.provider.userId !== userId) {
      throw new ForbiddenException('Only provider can process refunds');
    }

    if (payment.status !== 'completed') {
      throw new BadRequestException('Can only refund completed payments');
    }

    const refundAmount = dto.amount
      ? Math.round(dto.amount * 100)
      : Math.round(Number(payment.amount) * 100);

    const refund = await this.stripeService.createRefund(
      payment.stripePaymentIntentId!,
      refundAmount,
      dto.reason,
    );

    // Update payment status
    const isFullRefund = !dto.amount || dto.amount >= Number(payment.amount);
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isFullRefund ? 'refunded' : 'partially_refunded',
        metadata: {
          refundedAmount: dto.amount || Number(payment.amount),
          refundedAt: new Date().toISOString(),
          refundReason: dto.reason,
        },
      },
    });

    // Update invoice if full refund
    if (isFullRefund) {
      await this.prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: 'cancelled' },
      });
    }

    return {
      success: true,
      refundId: refund.id,
      amount: refundAmount / 100,
      status: refund.status,
    };
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: {
          include: {
            provider: { include: { user: true } },
            participant: { include: { user: true } },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check access
    const hasAccess =
      payment.invoice.provider.userId === userId ||
      payment.invoice.participant.userId === userId;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: payment.id,
      amount: payment.amount,
      currency: 'AUD',
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      completedAt: payment.completedAt,
      invoice: {
        id: payment.invoice.id,
        invoiceNumber: payment.invoice.invoiceNumber,
      },
    };
  }

  /**
   * Get payments for a user (provider or participant)
   */
  async getUserPayments(
    userId: string,
    role: 'provider' | 'participant',
    options?: { status?: string; page?: number; limit?: number },
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (role === 'provider') {
      const provider = await this.prisma.provider.findUnique({
        where: { userId },
      });
      if (!provider) throw new NotFoundException('Provider not found');
      whereClause = { invoice: { providerId: provider.id } };
    } else {
      const participant = await this.prisma.participant.findUnique({
        where: { userId },
      });
      if (!participant) throw new NotFoundException('Participant not found');
      whereClause = { invoice: { participantId: participant.id } };
    }

    if (options?.status) {
      whereClause.status = options.status;
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { initiatedAt: 'desc' },
        include: {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
            },
          },
        },
      }),
      this.prisma.payment.count({ where: whereClause }),
    ]);

    return {
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: 'AUD',
        status: p.status,
        paymentMethod: p.paymentMethod,
        completedAt: p.completedAt,
        invoice: p.invoice,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create payout to provider
   */
  async createPayout(userId: string, dto: CreatePayoutDto) {
    // For now, only admins can create payouts
    // In production, this would be automated based on payment settlement

    const provider = await this.prisma.provider.findUnique({
      where: { id: dto.providerId },
      include: { user: true },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Get unpaid invoices for this provider
    const invoiceWhere: any = {
      providerId: provider.id,
      status: 'paid',
      payoutStatus: 'pending',
    };

    if (dto.invoiceIds?.length) {
      invoiceWhere.id = { in: dto.invoiceIds };
    }

    const invoices = await this.prisma.invoice.findMany({
      where: invoiceWhere,
      include: {
        payments: {
          where: { status: 'completed' },
        },
      },
    });

    if (!invoices.length) {
      throw new BadRequestException('No eligible invoices for payout');
    }

    // Calculate total payout amount
    const totalPayout = invoices.reduce(
      (sum, inv) => sum + Number(inv.providerPayout),
      0,
    );

    // Create transfer (mock)
    const transfer = await this.stripeService.createTransfer(
      Math.round(totalPayout * 100),
      provider.stripeConnectId || 'acct_mock',
      {
        providerId: provider.id,
        invoiceCount: String(invoices.length),
      },
    );

    // Create payout record
    const payout = await this.prisma.providerPayout.create({
      data: {
        providerId: provider.id,
        amount: totalPayout,
        status: 'pending',
        stripeTransferId: transfer.id,
        invoiceIds: invoices.map((i) => i.id),
      },
    });

    // Update invoices payout status
    await this.prisma.invoice.updateMany({
      where: { id: { in: invoices.map((i) => i.id) } },
      data: { payoutStatus: 'processing' },
    });

    return {
      payoutId: payout.id,
      amount: totalPayout,
      invoiceCount: invoices.length,
      status: 'pending',
      mockMode: this.stripeService.isMockMode(),
    };
  }

  /**
   * Get provider payout history
   */
  async getProviderPayouts(userId: string, options?: { page?: number; limit?: number }) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      this.prisma.providerPayout.findMany({
        where: { providerId: provider.id },
        skip,
        take: limit,
        orderBy: { initiatedAt: 'desc' },
      }),
      this.prisma.providerPayout.count({ where: { providerId: provider.id } }),
    ]);

    return {
      payouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(userId: string, role: 'provider' | 'participant') {
    let whereClause: any = {};

    if (role === 'provider') {
      const provider = await this.prisma.provider.findUnique({
        where: { userId },
      });
      if (!provider) throw new NotFoundException('Provider not found');
      whereClause = { invoice: { providerId: provider.id } };
    } else {
      const participant = await this.prisma.participant.findUnique({
        where: { userId },
      });
      if (!participant) throw new NotFoundException('Participant not found');
      whereClause = { invoice: { participantId: participant.id } };
    }

    const [totalPayments, completedPayments, pendingPayments, totalAmount] =
      await Promise.all([
        this.prisma.payment.count({ where: whereClause }),
        this.prisma.payment.count({
          where: { ...whereClause, status: 'completed' },
        }),
        this.prisma.payment.count({
          where: { ...whereClause, status: 'pending' },
        }),
        this.prisma.payment.aggregate({
          where: { ...whereClause, status: 'completed' },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      totalAmount: totalAmount._sum.amount || 0,
      mockMode: this.stripeService.isMockMode(),
    };
  }
}
