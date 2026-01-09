import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import {
  CreatePaymentIntentDto,
  RefundPaymentDto,
  CreatePayoutDto,
} from './dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Get payment system status' })
  @ApiResponse({ status: 200, description: 'Payment system status' })
  getStatus() {
    return {
      provider: 'stripe',
      mockMode: this.stripeService.isMockMode(),
      message: this.stripeService.isMockMode()
        ? 'Stripe is in MOCK MODE - no real payments will be processed'
        : 'Stripe is configured and ready for live payments',
    };
  }

  @Post('intent')
  @ApiOperation({ summary: 'Create payment intent for an invoice' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async createPaymentIntent(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createPaymentIntent(userId, dto);
  }

  @Post('confirm/:paymentIntentId')
  @ApiOperation({ summary: 'Confirm a payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed' })
  async confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiResponse({ status: 200, description: 'Refund processed' })
  @ApiResponse({ status: 400, description: 'Cannot refund this payment' })
  async refundPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: RefundPaymentDto,
  ) {
    return this.paymentsService.refundPayment(userId, dto);
  }

  @Get('provider')
  @ApiOperation({ summary: 'Get provider payment history' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getProviderPayments(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getUserPayments(userId, 'provider', {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('participant')
  @ApiOperation({ summary: 'Get participant payment history' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getParticipantPayments(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getUserPayments(userId, 'participant', {
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('stats/provider')
  @ApiOperation({ summary: 'Get provider payment statistics' })
  async getProviderStats(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentStats(userId, 'provider');
  }

  @Get('stats/participant')
  @ApiOperation({ summary: 'Get participant payment statistics' })
  async getParticipantStats(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentStats(userId, 'participant');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentById(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) paymentId: string,
  ) {
    return this.paymentsService.getPaymentById(userId, paymentId);
  }

  @Post('payout')
  @ApiOperation({ summary: 'Create payout to provider (admin)' })
  @ApiResponse({ status: 201, description: 'Payout created' })
  async createPayout(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePayoutDto,
  ) {
    return this.paymentsService.createPayout(userId, dto);
  }

  @Get('payouts/provider')
  @ApiOperation({ summary: 'Get provider payout history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getProviderPayouts(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getProviderPayouts(userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get saved payment methods' })
  async getPaymentMethods(@CurrentUser('id') userId: string) {
    // Mock customer ID for now
    const methods = await this.stripeService.getPaymentMethods(`cus_${userId}`);
    return {
      methods,
      mockMode: this.stripeService.isMockMode(),
    };
  }
}
