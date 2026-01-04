import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InvoicesService } from './invoices.service';
import { PdfService } from './pdf.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async createInvoice(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.invoicesService.createInvoice(userId, dto);
  }

  @Post('from-booking/:bookingId')
  @ApiOperation({ summary: 'Create invoice from a completed booking' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Booking not completed or already invoiced' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async createFromBooking(
    @CurrentUser('id') userId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return this.invoicesService.createFromBooking(bookingId, userId);
  }

  @Get('provider')
  @ApiOperation({ summary: 'Get invoices for current provider' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Provider invoices retrieved' })
  async getProviderInvoices(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invoicesService.getProviderInvoices(userId, {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('participant')
  @ApiOperation({ summary: 'Get invoices for current participant' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Participant invoices retrieved' })
  async getParticipantInvoices(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invoicesService.getParticipantInvoices(userId, {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get invoice statistics for provider' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getInvoiceStats(@CurrentUser('id') userId: string) {
    return this.invoicesService.getInvoiceStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getInvoiceById(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) invoiceId: string,
  ) {
    return this.invoicesService.getInvoiceById(userId, invoiceId);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send invoice to participant' })
  @ApiResponse({ status: 200, description: 'Invoice sent' })
  @ApiResponse({ status: 400, description: 'Invoice not in draft status' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async sendInvoice(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) invoiceId: string,
  ) {
    return this.invoicesService.sendInvoice(userId, invoiceId);
  }

  @Post(':id/mark-paid')
  @ApiOperation({ summary: 'Mark invoice as paid' })
  @ApiResponse({ status: 200, description: 'Invoice marked as paid' })
  @ApiResponse({ status: 400, description: 'Invalid invoice status' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async markAsPaid(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) invoiceId: string,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    return this.invoicesService.markAsPaid(userId, invoiceId, paymentMethod);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel invoice' })
  @ApiResponse({ status: 200, description: 'Invoice cancelled' })
  @ApiResponse({ status: 400, description: 'Invoice cannot be cancelled' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async cancelInvoice(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) invoiceId: string,
  ) {
    return this.invoicesService.cancelInvoice(userId, invoiceId);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download invoice as PDF' })
  @ApiResponse({ status: 200, description: 'PDF generated' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async downloadPdf(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) invoiceId: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.getInvoiceById(userId, invoiceId);
    const html = this.pdfService.generateInvoiceHtml({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      provider: {
        businessName: invoice.provider?.businessName ?? undefined,
        name: invoice.provider?.name ?? undefined,
        abn: invoice.provider?.abn ?? undefined,
        email: invoice.provider?.email ?? undefined,
      },
      participant: {
        name: invoice.participant?.name ?? undefined,
        email: invoice.participant?.email ?? undefined,
      },
      lineItems: invoice.lineItems || [],
      subtotal: invoice.subtotal,
      gstAmount: invoice.gstAmount,
      platformFee: invoice.platformFee,
      totalAmount: invoice.totalAmount,
      notes: invoice.notes,
    });

    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.html"`,
    );
    res.send(html);
  }

  @Get(':id/html')
  @ApiOperation({ summary: 'Get invoice as HTML (for printing)' })
  @ApiResponse({ status: 200, description: 'HTML generated' })
  async getInvoiceHtml(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) invoiceId: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.getInvoiceById(userId, invoiceId);
    const html = this.pdfService.generateInvoiceHtml({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      provider: {
        businessName: invoice.provider?.businessName ?? undefined,
        name: invoice.provider?.name ?? undefined,
        abn: invoice.provider?.abn ?? undefined,
        email: invoice.provider?.email ?? undefined,
      },
      participant: {
        name: invoice.participant?.name ?? undefined,
        email: invoice.participant?.email ?? undefined,
      },
      lineItems: invoice.lineItems || [],
      subtotal: invoice.subtotal,
      gstAmount: invoice.gstAmount,
      platformFee: invoice.platformFee,
      totalAmount: invoice.totalAmount,
      notes: invoice.notes,
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
