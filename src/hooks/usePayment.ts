import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/PaymentService';
import { logger } from '@/utils/logger';

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

interface UsePaymentOptions {
  onPaymentSuccess?: (transaction: Transaction) => void;
  onPaymentError?: (error: Error) => void;
  onPaymentMethodAdded?: (paymentMethod: PaymentMethod) => void;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const {
    onPaymentSuccess,
    onPaymentError,
    onPaymentMethodAdded,
    onInvoiceCreated
  } = options;

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [metrics, setMetrics] = useState<PaymentMetrics>(paymentService.getMetrics());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = paymentService.onPaymentEvent((type, data) => {
      switch (type) {
        case 'payment_method:added':
          onPaymentMethodAdded?.(data);
          break;
        case 'transaction:completed':
          onPaymentSuccess?.(data);
          break;
        case 'transaction:failed':
          onPaymentError?.(new Error(data.metadata.error || 'Payment failed'));
          break;
        case 'invoice:created':
          onInvoiceCreated?.(data);
          break;
      }
      setMetrics(paymentService.getMetrics());
    });

    return unsubscribe;
  }, [onPaymentSuccess, onPaymentError, onPaymentMethodAdded, onInvoiceCreated]);

  const addPaymentMethod = useCallback(async (
    type: PaymentMethod['type'],
    details: PaymentMethod['details']
  ): Promise<PaymentMethod> => {
    try {
      const paymentMethod = await paymentService.addPaymentMethod(type, details);
      setPaymentMethods(prev => [...prev, paymentMethod]);
      return paymentMethod;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to add payment method');
      onPaymentError?.(err);
      logger.error('Failed to add payment method', { error });
      throw err;
    }
  }, [onPaymentError]);

  const setDefaultPaymentMethod = useCallback(async (id: string): Promise<void> => {
    try {
      await paymentService.setDefaultPaymentMethod(id);
      setPaymentMethods(prev =>
        prev.map(pm => ({
          ...pm,
          metadata: { ...pm.metadata, isDefault: pm.id === id }
        }))
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to set default payment method');
      onPaymentError?.(err);
      logger.error('Failed to set default payment method', { id, error });
      throw err;
    }
  }, [onPaymentError]);

  const processPayment = useCallback(async (
    amount: number,
    currency: string,
    paymentMethodId: string,
    description: string
  ): Promise<Transaction> => {
    try {
      setIsProcessing(true);
      const transaction = await paymentService.processPayment(
        amount,
        currency,
        paymentMethodId,
        description
      );
      setTransactions(prev => [...prev, transaction]);
      return transaction;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Payment processing failed');
      onPaymentError?.(err);
      logger.error('Payment processing failed', { error });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [onPaymentError]);

  const refundTransaction = useCallback(async (id: string): Promise<Transaction> => {
    try {
      setIsProcessing(true);
      const transaction = await paymentService.refundTransaction(id);
      setTransactions(prev =>
        prev.map(t => t.id === id ? transaction : t)
      );
      return transaction;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Refund failed');
      onPaymentError?.(err);
      logger.error('Refund failed', { id, error });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [onPaymentError]);

  const createInvoice = useCallback(async (
    amount: number,
    currency: string,
    items: Invoice['items'],
    dueDate: string
  ): Promise<Invoice> => {
    try {
      const invoice = await paymentService.createInvoice(amount, currency, items, dueDate);
      setInvoices(prev => [...prev, invoice]);
      return invoice;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create invoice');
      onPaymentError?.(err);
      logger.error('Failed to create invoice', { error });
      throw err;
    }
  }, [onPaymentError]);

  const finalizeInvoice = useCallback(async (id: string): Promise<Invoice> => {
    try {
      const invoice = await paymentService.finalizeInvoice(id);
      setInvoices(prev =>
        prev.map(i => i.id === id ? invoice : i)
      );
      return invoice;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to finalize invoice');
      onPaymentError?.(err);
      logger.error('Failed to finalize invoice', { id, error });
      throw err;
    }
  }, [onPaymentError]);

  const voidInvoice = useCallback(async (id: string): Promise<Invoice> => {
    try {
      const invoice = await paymentService.voidInvoice(id);
      setInvoices(prev =>
        prev.map(i => i.id === id ? invoice : i)
      );
      return invoice;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to void invoice');
      onPaymentError?.(err);
      logger.error('Failed to void invoice', { id, error });
      throw err;
    }
  }, [onPaymentError]);

  const generateReport = useCallback(async () => {
    try {
      return await paymentService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onPaymentError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onPaymentError]);

  return {
    paymentMethods,
    transactions,
    invoices,
    metrics,
    isProcessing,
    addPaymentMethod,
    setDefaultPaymentMethod,
    processPayment,
    refundTransaction,
    createInvoice,
    finalizeInvoice,
    voidInvoice,
    generateReport
  };
}

// Example usage:
/*
function PaymentComponent() {
  const {
    paymentMethods,
    metrics,
    isProcessing,
    addPaymentMethod,
    processPayment
  } = usePayment({
    onPaymentSuccess: (transaction) => {
      console.log('Payment successful:', transaction);
    },
    onPaymentError: (error) => {
      console.error('Payment error:', error);
    }
  });

  const handlePayment = async () => {
    try {
      const paymentMethod = paymentMethods[0];
      if (!paymentMethod) return;

      await processPayment(
        99.99,
        'USD',
        paymentMethod.id,
        'Test payment'
      );
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div>
      <div>Success Rate: {metrics.successRate}%</div>
      <button
        onClick={handlePayment}
        disabled={isProcessing || paymentMethods.length === 0}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
*/
