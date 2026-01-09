import { Injectable, Logger } from '@nestjs/common';

/**
 * Stripe Service - Mock Mode
 *
 * This service provides mock implementations of Stripe functionality.
 * When STRIPE_SECRET_KEY is configured, it will use real Stripe API.
 * For now, all methods return mock data for testing.
 *
 * To activate real Stripe:
 * 1. Add STRIPE_SECRET_KEY to .env
 * 2. Add STRIPE_WEBHOOK_SECRET to .env
 * 3. Install stripe package: pnpm add stripe
 * 4. Uncomment the real Stripe implementation below
 */

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  clientSecret: string;
  metadata: Record<string, string>;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface Refund {
  id: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  paymentIntentId: string;
}

export interface Transfer {
  id: string;
  amount: number;
  currency: string;
  destination: string;
  status: 'pending' | 'paid' | 'failed';
}

export interface ConnectedAccount {
  id: string;
  email: string;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly mockMode: boolean;

  constructor() {
    // Check if Stripe is configured
    this.mockMode = !process.env.STRIPE_SECRET_KEY;
    if (this.mockMode) {
      this.logger.warn('Stripe running in MOCK MODE - no real payments will be processed');
    }
  }

  /**
   * Check if Stripe is in mock mode
   */
  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Create a payment intent for an invoice
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'aud',
    metadata: Record<string, string> = {},
  ): Promise<PaymentIntent> {
    if (this.mockMode) {
      const mockId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.logger.log(`[MOCK] Created payment intent: ${mockId} for $${(amount / 100).toFixed(2)}`);

      return {
        id: mockId,
        amount,
        currency,
        status: 'requires_payment_method',
        clientSecret: `${mockId}_secret_mock`,
        metadata,
      };
    }

    // TODO: Real Stripe implementation
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // return stripe.paymentIntents.create({ amount, currency, metadata });
    throw new Error('Stripe not configured');
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string,
  ): Promise<PaymentIntent> {
    if (this.mockMode) {
      this.logger.log(`[MOCK] Confirmed payment intent: ${paymentIntentId}`);

      return {
        id: paymentIntentId,
        amount: 10000, // Mock amount
        currency: 'aud',
        status: 'succeeded',
        clientSecret: `${paymentIntentId}_secret_mock`,
        metadata: {},
      };
    }

    throw new Error('Stripe not configured');
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    if (this.mockMode) {
      this.logger.log(`[MOCK] Cancelled payment intent: ${paymentIntentId}`);

      return {
        id: paymentIntentId,
        amount: 0,
        currency: 'aud',
        status: 'canceled',
        clientSecret: `${paymentIntentId}_secret_mock`,
        metadata: {},
      };
    }

    throw new Error('Stripe not configured');
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<Refund> {
    if (this.mockMode) {
      const mockId = `re_mock_${Date.now()}`;
      this.logger.log(`[MOCK] Created refund: ${mockId} for payment ${paymentIntentId}`);

      return {
        id: mockId,
        amount: amount || 10000,
        status: 'succeeded',
        paymentIntentId,
      };
    }

    throw new Error('Stripe not configured');
  }

  /**
   * Create a connected account for a provider (for payouts)
   */
  async createConnectedAccount(
    email: string,
    businessName: string,
    metadata: Record<string, string> = {},
  ): Promise<ConnectedAccount> {
    if (this.mockMode) {
      const mockId = `acct_mock_${Date.now()}`;
      this.logger.log(`[MOCK] Created connected account: ${mockId} for ${email}`);

      return {
        id: mockId,
        email,
        payoutsEnabled: true,
        chargesEnabled: true,
      };
    }

    throw new Error('Stripe not configured');
  }

  /**
   * Create a transfer to a connected account (provider payout)
   */
  async createTransfer(
    amount: number,
    destinationAccountId: string,
    metadata: Record<string, string> = {},
  ): Promise<Transfer> {
    if (this.mockMode) {
      const mockId = `tr_mock_${Date.now()}`;
      this.logger.log(`[MOCK] Created transfer: ${mockId} of $${(amount / 100).toFixed(2)} to ${destinationAccountId}`);

      return {
        id: mockId,
        amount,
        currency: 'aud',
        destination: destinationAccountId,
        status: 'paid',
      };
    }

    throw new Error('Stripe not configured');
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<{ available: number; pending: number }> {
    if (this.mockMode) {
      return {
        available: 50000, // $500.00
        pending: 15000,   // $150.00
      };
    }

    throw new Error('Stripe not configured');
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (this.mockMode) {
      this.logger.log('[MOCK] Webhook signature verified');
      return true;
    }

    // TODO: Real verification
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    return false;
  }

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    if (this.mockMode) {
      return [
        {
          id: 'pm_mock_visa',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2027,
          },
        },
        {
          id: 'pm_mock_mastercard',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            expMonth: 6,
            expYear: 2026,
          },
        },
      ];
    }

    throw new Error('Stripe not configured');
  }
}
