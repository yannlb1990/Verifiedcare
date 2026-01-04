import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateInvoiceDto, InvoiceLineItemDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  private readonly PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee
  private readonly GST_RATE = 0.10; // 10% GST

  constructor(private readonly prisma: PrismaService) {}

  async createInvoice(userId: string, dto: CreateInvoiceDto) {
    // Verify provider
    const provider = await this.prisma.provider.findUnique({
      where: { id: dto.providerId },
      include: { user: true },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Only provider can create their own invoices
    if (provider.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify participant
    const participant = await this.prisma.participant.findUnique({
      where: { id: dto.participantId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // Calculate totals
    const lineItems = await this.calculateLineItems(dto.lineItems, provider.gstRegistered);
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const gstAmount = lineItems.reduce((sum, item) => sum + item.gstAmount, 0);

    const platformFee = subtotal * this.PLATFORM_FEE_PERCENTAGE;
    const platformFeeGst = provider.gstRegistered ? platformFee * this.GST_RATE : 0;

    const totalAmount = subtotal + gstAmount;
    const providerPayout = totalAmount - platformFee - platformFeeGst;

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(dto.providerId);

    // Create invoice with line items
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        providerId: dto.providerId,
        participantId: dto.participantId,
        billToType: dto.billToType || 'self',
        planManagerId: dto.planManagerId,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        subtotal,
        gstAmount,
        platformFee,
        platformFeeGst,
        totalAmount,
        providerPayout,
        status: 'draft',
        notes: dto.notes,
        lineItems: {
          create: lineItems.map((item, index) => ({
            lineNumber: index + 1,
            bookingId: item.bookingId,
            description: item.description,
            ndisItemNumber: item.ndisItemNumber,
            serviceDate: new Date(item.serviceDate),
            quantity: item.quantity,
            unit: item.unit,
            unitRate: item.unitRate,
            lineTotal: item.lineTotal,
            gstApplicable: item.gstApplicable,
            gstAmount: item.gstAmount,
          })),
        },
      },
      include: {
        lineItems: true,
        provider: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
        participant: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });

    return this.formatInvoiceResponse(invoice);
  }

  async createFromBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        provider: { include: { user: true } },
        participant: { include: { user: true } },
        providerService: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'completed') {
      throw new BadRequestException('Can only invoice completed bookings');
    }

    // Check if invoice already exists for this booking
    const existingInvoice = await this.prisma.invoiceLineItem.findFirst({
      where: { bookingId },
    });

    if (existingInvoice) {
      throw new BadRequestException('Invoice already exists for this booking');
    }

    const duration = booking.actualDurationHours || booking.scheduledDurationHours;
    const rate = booking.quotedRate;
    const lineTotal = Number(duration) * Number(rate);

    const dto: CreateInvoiceDto = {
      providerId: booking.providerId,
      participantId: booking.participantId,
      lineItems: [
        {
          bookingId: booking.id,
          description: `${booking.serviceType.replace(/_/g, ' ')} - ${booking.providerService?.serviceName || 'Service'} (${duration} hours)`,
          serviceDate: booking.scheduledDate.toISOString().split('T')[0],
          quantity: Number(duration),
          unit: 'hours',
          unitRate: Number(rate),
          gstApplicable: booking.provider.gstRegistered,
        },
      ],
    };

    return this.createInvoice(userId, dto);
  }

  async getInvoiceById(userId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        lineItems: {
          orderBy: { lineNumber: 'asc' },
        },
        provider: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
        participant: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Check access
    const hasAccess =
      invoice.provider.userId === userId ||
      invoice.participant.userId === userId;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return this.formatInvoiceResponse(invoice);
  }

  async getProviderInvoices(userId: string, options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.getInvoices({
      providerId: provider.id,
      ...options,
    });
  }

  async getParticipantInvoices(userId: string, options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const participant = await this.prisma.participant.findUnique({
      where: { userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant profile not found');
    }

    return this.getInvoices({
      participantId: participant.id,
      ...options,
    });
  }

  async sendInvoice(userId: string, invoiceId: string) {
    const invoice = await this.getInvoiceForProvider(userId, invoiceId);

    if (invoice.status !== 'draft') {
      throw new BadRequestException('Only draft invoices can be sent');
    }

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'sent' },
    });

    // TODO: Send email notification to participant

    return { message: 'Invoice sent', status: updated.status };
  }

  async markAsPaid(userId: string, invoiceId: string, paymentMethod: string) {
    const invoice = await this.getInvoiceForProvider(userId, invoiceId);

    if (!['sent', 'viewed', 'partially_paid'].includes(invoice.status)) {
      throw new BadRequestException('Invoice cannot be marked as paid');
    }

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        amountPaid: invoice.totalAmount,
        paidAt: new Date(),
        paymentMethod,
      },
    });

    return { message: 'Invoice marked as paid', status: updated.status };
  }

  async cancelInvoice(userId: string, invoiceId: string) {
    const invoice = await this.getInvoiceForProvider(userId, invoiceId);

    if (['paid', 'cancelled'].includes(invoice.status)) {
      throw new BadRequestException('Invoice cannot be cancelled');
    }

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'cancelled' },
    });

    return { message: 'Invoice cancelled', status: updated.status };
  }

  async getInvoiceStats(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const [
      totalInvoices,
      draftCount,
      sentCount,
      paidCount,
      overdueCount,
      totalRevenue,
      pendingRevenue,
    ] = await Promise.all([
      this.prisma.invoice.count({ where: { providerId: provider.id } }),
      this.prisma.invoice.count({ where: { providerId: provider.id, status: 'draft' } }),
      this.prisma.invoice.count({ where: { providerId: provider.id, status: 'sent' } }),
      this.prisma.invoice.count({ where: { providerId: provider.id, status: 'paid' } }),
      this.prisma.invoice.count({ where: { providerId: provider.id, status: 'overdue' } }),
      this.prisma.invoice.aggregate({
        where: { providerId: provider.id, status: 'paid' },
        _sum: { providerPayout: true },
      }),
      this.prisma.invoice.aggregate({
        where: { providerId: provider.id, status: { in: ['sent', 'viewed'] } },
        _sum: { providerPayout: true },
      }),
    ]);

    return {
      totalInvoices,
      byStatus: {
        draft: draftCount,
        sent: sentCount,
        paid: paidCount,
        overdue: overdueCount,
      },
      totalRevenue: totalRevenue._sum.providerPayout || 0,
      pendingRevenue: pendingRevenue._sum.providerPayout || 0,
    };
  }

  // Helper methods
  private async calculateLineItems(
    items: InvoiceLineItemDto[],
    providerGstRegistered: boolean,
  ) {
    return items.map((item) => {
      const lineTotal = item.quantity * item.unitRate;
      const gstApplicable = item.gstApplicable ?? providerGstRegistered;
      const gstAmount = gstApplicable ? lineTotal * this.GST_RATE : 0;

      return {
        ...item,
        lineTotal,
        gstApplicable,
        gstAmount,
      };
    });
  }

  private async generateInvoiceNumber(providerId: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Count existing invoices for this provider this month
    const count = await this.prisma.invoice.count({
      where: {
        providerId,
        invoiceNumber: {
          startsWith: `INV-${year}${month}`,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}${month}-${sequence}`;
  }

  private async getInvoiceForProvider(userId: string, invoiceId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.providerId !== provider.id) {
      throw new ForbiddenException('Access denied');
    }

    return invoice;
  }

  private async getInvoices(options: {
    providerId?: string;
    participantId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.providerId) where.providerId = options.providerId;
    if (options.participantId) where.participantId = options.participantId;
    if (options.status) where.status = options.status;

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { invoiceDate: 'desc' },
        include: {
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          participant: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          _count: {
            select: { lineItems: true },
          },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        status: inv.status,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        totalAmount: inv.totalAmount,
        providerPayout: inv.providerPayout,
        provider: {
          id: inv.provider.id,
          name: `${inv.provider.user.firstName} ${inv.provider.user.lastName}`,
          businessName: inv.provider.businessName,
        },
        participant: {
          id: inv.participant.id,
          name: `${inv.participant.user.firstName} ${inv.participant.user.lastName}`,
        },
        lineItemCount: inv._count.lineItems,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private formatInvoiceResponse(invoice: any) {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      subtotal: invoice.subtotal,
      gstAmount: invoice.gstAmount,
      platformFee: invoice.platformFee,
      totalAmount: invoice.totalAmount,
      providerPayout: invoice.providerPayout,
      amountPaid: invoice.amountPaid,
      paidAt: invoice.paidAt,
      provider: invoice.provider
        ? {
            id: invoice.provider.id,
            businessName: invoice.provider.businessName,
            abn: invoice.provider.abn,
            name: invoice.provider.user
              ? `${invoice.provider.user.firstName} ${invoice.provider.user.lastName}`
              : null,
            email: invoice.provider.user?.email,
          }
        : null,
      participant: invoice.participant
        ? {
            id: invoice.participant.id,
            name: invoice.participant.user
              ? `${invoice.participant.user.firstName} ${invoice.participant.user.lastName}`
              : null,
            email: invoice.participant.user?.email,
          }
        : null,
      lineItems: invoice.lineItems?.map((item: any) => ({
        id: item.id,
        lineNumber: item.lineNumber,
        description: item.description,
        serviceDate: item.serviceDate,
        quantity: item.quantity,
        unit: item.unit,
        unitRate: item.unitRate,
        lineTotal: item.lineTotal,
        gstAmount: item.gstAmount,
      })),
      notes: invoice.notes,
      createdAt: invoice.createdAt,
    };
  }
}
