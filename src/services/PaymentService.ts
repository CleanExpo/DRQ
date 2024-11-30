import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: string;
    expiryYear?: string;
    bankName?: string;
    accountType?: string;
    email?: string;
  };
  metadata: {
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    lastUsed?: string;
  };
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  description: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    failedAt?: string;
    refundedAt?: string;
    error?: string;
    orderId?: string;
    customerId?: string;
    receiptUrl?: string;
  };
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'paid' | 'void' | 'cancelled';
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
    voidedAt?: string;
    cancelledAt?: string;
    customerId?: string;
    transactionId?: string;
  };
}

interface PaymentMetrics {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageTransactionValue: number;
  transactionsByStatus: Record<string, number>;
  transactionsByMethod: Record<string, number>;
  revenueByDay: Array<{
    date: string;
    amount: number;
  }>;
  lastUpdate: number;
}

class PaymentService {
  private static instance: PaymentService;
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private metrics: PaymentMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private initializeMetrics(): PaymentMetrics {
    return {
      totalTransactions: 0,
      totalAmount: 0,
      successRate: 0,
      averageTransactionValue: 0,
      transactionsByStatus: {},
      transactionsByMethod: {},
      revenueByDay: [],
      lastUpdate: Date.now()
    };
  }

  public async addPaymentMethod(
    type: PaymentMethod['type'],
    details: PaymentMethod['details']
  ): Promise<PaymentMethod> {
    try {
      // In production, this would integrate with a payment processor
      const paymentMethod: PaymentMethod = {
        id: this.generateId(),
        type,
        details,
        metadata: {
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      this.paymentMethods.set(paymentMethod.id, paymentMethod);
      this.notifyObservers('payment_method:added', paymentMethod);

      logger.debug('Payment method added', { id: paymentMethod.id, type });
      return paymentMethod;
    } catch (error) {
      logger.error('Failed to add payment method', { error });
      throw error;
    }
  }

  public async setDefaultPaymentMethod(id: string): Promise<void> {
    try {
      const paymentMethod = this.paymentMethods.get(id);
      if (!paymentMethod) {
        throw new Error(`Payment method not found: ${id}`);
      }

      // Reset all payment methods to non-default
      for (const [, method] of this.paymentMethods) {
        method.metadata.isDefault = false;
      }

      paymentMethod.metadata.isDefault = true;
      paymentMethod.metadata.updatedAt = new Date().toISOString();

      this.notifyObservers('payment_method:default_updated', paymentMethod);
      logger.debug('Default payment method updated', { id });
    } catch (error) {
      logger.error('Failed to set default payment method', { id, error });
      throw error;
    }
  }

  public async processPayment(
    amount: number,
    currency: string,
    paymentMethodId: string,
    description: string
  ): Promise<Transaction> {
    try {
      const paymentMethod = this.paymentMethods.get(paymentMethodId);
      if (!paymentMethod) {
        throw new Error(`Payment method not found: ${paymentMethodId}`);
      }

      // In production, this would integrate with a payment processor
      const transaction: Transaction = {
        id: this.generateId(),
        amount,
        currency,
        status: 'processing',
        paymentMethod,
        description,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      this.transactions.set(transaction.id, transaction);
      this.notifyObservers('transaction:created', transaction);

      // Simulate payment processing
      await this.simulatePaymentProcessing(transaction);

      this.updateMetrics();
      logger.debug('Payment processed', { id: transaction.id, amount, currency });
      return transaction;
    } catch (error) {
      logger.error('Payment processing failed', { error });
      throw error;
    }
  }

  private async simulatePaymentProcessing(transaction: Transaction): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          transaction.status = 'completed';
          transaction.metadata.completedAt = new Date().toISOString();
        } else {
          transaction.status = 'failed';
          transaction.metadata.failedAt = new Date().toISOString();
          transaction.metadata.error = 'Payment declined';
        }
        transaction.metadata.updatedAt = new Date().toISOString();
        this.notifyObservers('transaction:updated', transaction);
        resolve();
      }, 2000); // Simulate 2-second processing time
    });
  }

  public async refundTransaction(id: string): Promise<Transaction> {
    try {
      const transaction = this.transactions.get(id);
      if (!transaction) {
        throw new Error(`Transaction not found: ${id}`);
      }

      if (transaction.status !== 'completed') {
        throw new Error(`Cannot refund transaction with status: ${transaction.status}`);
      }

      // In production, this would integrate with a payment processor
      transaction.status = 'refunded';
      transaction.metadata.refundedAt = new Date().toISOString();
      transaction.metadata.updatedAt = new Date().toISOString();

      this.updateMetrics();
      this.notifyObservers('transaction:refunded', transaction);

      logger.debug('Transaction refunded', { id });
      return transaction;
    } catch (error) {
      logger.error('Refund failed', { id, error });
      throw error;
    }
  }

  public async createInvoice(
    amount: number,
    currency: string,
    items: Invoice['items'],
    dueDate: string
  ): Promise<Invoice> {
    try {
      const invoice: Invoice = {
        id: this.generateId(),
        amount,
        currency,
        status: 'draft',
        dueDate,
        items,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      this.invoices.set(invoice.id, invoice);
      this.notifyObservers('invoice:created', invoice);

      logger.debug('Invoice created', { id: invoice.id, amount, currency });
      return invoice;
    } catch (error) {
      logger.error('Failed to create invoice', { error });
      throw error;
    }
  }

  public async finalizeInvoice(id: string): Promise<Invoice> {
    try {
      const invoice = this.invoices.get(id);
      if (!invoice) {
        throw new Error(`Invoice not found: ${id}`);
      }

      if (invoice.status !== 'draft') {
        throw new Error(`Cannot finalize invoice with status: ${invoice.status}`);
      }

      invoice.status = 'pending';
      invoice.metadata.updatedAt = new Date().toISOString();

      this.notifyObservers('invoice:finalized', invoice);
      logger.debug('Invoice finalized', { id });
      return invoice;
    } catch (error) {
      logger.error('Failed to finalize invoice', { id, error });
      throw error;
    }
  }

  public async voidInvoice(id: string): Promise<Invoice> {
    try {
      const invoice = this.invoices.get(id);
      if (!invoice) {
        throw new Error(`Invoice not found: ${id}`);
      }

      if (!['draft', 'pending'].includes(invoice.status)) {
        throw new Error(`Cannot void invoice with status: ${invoice.status}`);
      }

      invoice.status = 'void';
      invoice.metadata.voidedAt = new Date().toISOString();
      invoice.metadata.updatedAt = new Date().toISOString();

      this.notifyObservers('invoice:voided', invoice);
      logger.debug('Invoice voided', { id });
      return invoice;
    } catch (error) {
      logger.error('Failed to void invoice', { id, error });
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onPaymentEvent(callback: (type: string, data: any) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(type: string, data: any): void {
    this.observers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        logger.error('Payment event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const transactions = Array.from(this.transactions.values());
    const completedTransactions = transactions.filter(t => t.status === 'completed');

    this.metrics = {
      totalTransactions: transactions.length,
      totalAmount: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
      successRate: transactions.length > 0
        ? (completedTransactions.length / transactions.length) * 100
        : 0,
      averageTransactionValue: completedTransactions.length > 0
        ? completedTransactions.reduce((sum, t) => sum + t.amount, 0) / completedTransactions.length
        : 0,
      transactionsByStatus: transactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      transactionsByMethod: transactions.reduce((acc, t) => {
        acc[t.paymentMethod.type] = (acc[t.paymentMethod.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      revenueByDay: this.calculateRevenueByDay(completedTransactions),
      lastUpdate: Date.now()
    };
  }

  private calculateRevenueByDay(transactions: Transaction[]): Array<{ date: string; amount: number }> {
    const revenueByDay = new Map<string, number>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.metadata.completedAt!).toISOString().split('T')[0];
      revenueByDay.set(date, (revenueByDay.get(date) || 0) + transaction.amount);
    });

    return Array.from(revenueByDay.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  public getMetrics(): PaymentMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      paymentMethods: Array.from(this.paymentMethods.values()).map(pm => ({
        id: pm.id,
        type: pm.type,
        isDefault: pm.metadata.isDefault,
        lastUsed: pm.metadata.lastUsed
      })),
      transactions: Array.from(this.transactions.values()).map(t => ({
        id: t.id,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        createdAt: t.metadata.createdAt
      })),
      invoices: Array.from(this.invoices.values()).map(i => ({
        id: i.id,
        amount: i.amount,
        currency: i.currency,
        status: i.status,
        dueDate: i.dueDate
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const paymentService = PaymentService.getInstance();
export default PaymentService;
