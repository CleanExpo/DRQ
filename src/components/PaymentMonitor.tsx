'use client';

import React, { useState } from 'react';
import { usePayment } from '@/hooks/usePayment';

interface TransactionDisplayProps {
  transaction: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    paymentMethod: {
      type: string;
      details: {
        last4?: string;
        brand?: string;
      };
    };
    metadata: {
      createdAt: string;
      completedAt?: string;
      failedAt?: string;
      refundedAt?: string;
      error?: string;
    };
  };
  onRefund: (id: string) => void;
}

const TransactionDisplay: React.FC<TransactionDisplayProps> = ({ 
  transaction,
  onRefund
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'refunded': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="font-medium">
            {transaction.currency} {transaction.amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">{transaction.description}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <span className="font-medium">Payment Method: </span>
            <span className="text-gray-600">
              {transaction.paymentMethod.type}
              {transaction.paymentMethod.details.last4 && 
                ` (**** ${transaction.paymentMethod.details.last4})`}
              {transaction.paymentMethod.details.brand && 
                ` - ${transaction.paymentMethod.details.brand}`}
            </span>
          </div>
          <div>
            <span className="font-medium">Created: </span>
            <span className="text-gray-600">
              {new Date(transaction.metadata.createdAt).toLocaleString()}
            </span>
          </div>
          {transaction.metadata.completedAt && (
            <div>
              <span className="font-medium">Completed: </span>
              <span className="text-gray-600">
                {new Date(transaction.metadata.completedAt).toLocaleString()}
              </span>
            </div>
          )}
          {transaction.metadata.error && (
            <div className="text-red-600">
              <span className="font-medium">Error: </span>
              {transaction.metadata.error}
            </div>
          )}
          {transaction.status === 'completed' && !transaction.metadata.refundedAt && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefund(transaction.id);
              }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Refund
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface MetricDisplayProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ 
  label, 
  value, 
  color = 'green' 
}) => (
  <div className={`p-4 bg-${color}-50 rounded-lg`}>
    <div className="text-sm text-gray-600">{label}</div>
    <div className={`text-2xl font-bold text-${color}-600`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
    </div>
  </div>
);

interface PaymentMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PaymentMonitor: React.FC<PaymentMonitorProps> = ({
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');
  const [activeTab, setActiveTab] = useState<'transactions' | 'metrics' | 'test'>('transactions');

  const {
    transactions,
    metrics,
    isProcessing,
    processPayment,
    refundTransaction,
    generateReport
  } = usePayment({
    onPaymentSuccess: (transaction) => {
      console.log('Payment successful:', transaction);
    },
    onPaymentError: (error) => {
      console.error('Payment error:', error);
    }
  });

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isVisible) return null;

  const TabButton: React.FC<{
    tab: 'transactions' | 'metrics' | 'test';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === tab
          ? 'bg-white text-green-600 border-b-2 border-green-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const handleTestPayment = async (amount: number) => {
    try {
      await processPayment(
        amount,
        'USD',
        'test_payment_method',
        'Test payment'
      );
    } catch (error) {
      console.error('Test payment failed:', error);
    }
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50`}
      style={{ maxWidth: isExpanded ? '600px' : '50px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 z-10 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
      >
        {isExpanded ? '×' : '💳'}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Payment Monitor</h2>
            <div className="text-sm text-gray-600 mt-1">
              Success Rate: {metrics.successRate.toFixed(1)}%
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <TabButton tab="transactions" label="Transactions" />
              <TabButton tab="metrics" label="Metrics" />
              <TabButton tab="test" label="Test" />
            </div>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto">
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map(transaction => (
                    <TransactionDisplay
                      key={transaction.id}
                      transaction={transaction}
                      onRefund={refundTransaction}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    No transactions yet
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay 
                    label="Total Transactions" 
                    value={metrics.totalTransactions}
                  />
                  <MetricDisplay 
                    label="Total Amount" 
                    value={`$${metrics.totalAmount.toFixed(2)}`}
                  />
                  <MetricDisplay 
                    label="Success Rate" 
                    value={`${metrics.successRate.toFixed(1)}%`}
                    color="blue"
                  />
                  <MetricDisplay 
                    label="Average Value" 
                    value={`$${metrics.averageTransactionValue.toFixed(2)}`}
                    color="purple"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">By Status</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.transactionsByStatus).map(([status, count]) => (
                      <div 
                        key={status}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{status}</span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">By Method</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.transactionsByMethod).map(([method, count]) => (
                      <div 
                        key={method}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium capitalize">{method}</span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTestPayment(9.99)}
                    disabled={isProcessing}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Test $9.99</div>
                    <div className="text-sm text-gray-600">Small payment</div>
                  </button>
                  <button
                    onClick={() => handleTestPayment(99.99)}
                    disabled={isProcessing}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Test $99.99</div>
                    <div className="text-sm text-gray-600">Medium payment</div>
                  </button>
                  <button
                    onClick={() => handleTestPayment(999.99)}
                    disabled={isProcessing}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Test $999.99</div>
                    <div className="text-sm text-gray-600">Large payment</div>
                  </button>
                  <button
                    onClick={() => handleTestPayment(0.99)}
                    disabled={isProcessing}
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Test $0.99</div>
                    <div className="text-sm text-gray-600">Micro payment</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last Update: {new Date(metrics.lastUpdate).toLocaleTimeString()}
              </div>
              <button
                onClick={() => generateReport()}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMonitor;
