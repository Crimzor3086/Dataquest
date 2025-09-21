import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentStatus {
  id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const PaymentStatusChecker: React.FC = () => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentPayments, setRecentPayments] = useState<PaymentStatus[]>([]);

  useEffect(() => {
    fetchRecentPayments();
  }, []);

  const fetchRecentPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentPayments(data || []);
    } catch (error) {
      console.error('Error fetching recent payments:', error);
    }
  };

  const checkPaymentStatus = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID');
      return;
    }

    setLoading(true);
    try {
      // Check in payments table first
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (paymentError && paymentError.code !== 'PGRST116') {
        throw paymentError;
      }

      if (payment) {
        setPaymentStatus(payment);
        toast.success('Payment status retrieved successfully');
      } else {
        // Check M-Pesa transactions table
        const { data: mpesaTx, error: mpesaError } = await supabase
          .from('mpesa_transactions')
          .select('*')
          .eq('tracking_id', transactionId)
          .single();

        if (mpesaError && mpesaError.code !== 'PGRST116') {
          throw mpesaError;
        }

        if (mpesaTx) {
          // Convert M-Pesa transaction to payment status format
          setPaymentStatus({
            id: mpesaTx.id,
            transaction_id: mpesaTx.tracking_id,
            payment_method: 'mpesa',
            amount: mpesaTx.amount,
            currency: mpesaTx.currency,
            payment_status: mpesaTx.status,
            created_at: mpesaTx.created_at,
            updated_at: mpesaTx.updated_at
          });
          toast.success('M-Pesa transaction status retrieved');
        } else {
          toast.error('Transaction not found');
          setPaymentStatus(null);
        }
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to check payment status');
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'failed':
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Payment Status Checker */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Status Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter Transaction ID or Tracking ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={checkPaymentStatus}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {paymentStatus && (
            <div className="bg-gray-700/30 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Payment Details</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(paymentStatus.payment_status)}
                  <Badge className={`${getStatusColor(paymentStatus.payment_status)} text-white`}>
                    {paymentStatus.payment_status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Transaction ID:</span>
                  <p className="text-white font-mono">{paymentStatus.transaction_id}</p>
                </div>
                <div>
                  <span className="text-gray-400">Payment Method:</span>
                  <p className="text-white capitalize">{paymentStatus.payment_method}</p>
                </div>
                <div>
                  <span className="text-gray-400">Amount:</span>
                  <p className="text-white">{formatCurrency(paymentStatus.amount, paymentStatus.currency)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <p className="text-white">{new Date(paymentStatus.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Last Updated:</span>
                  <p className="text-white">{new Date(paymentStatus.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Payments</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecentPayments}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No recent payments found
              </div>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.payment_status)}
                    <div>
                      <p className="text-white font-semibold">{payment.transaction_id}</p>
                      <p className="text-gray-400 text-sm">
                        {formatCurrency(payment.amount, payment.currency)} via {payment.payment_method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(payment.payment_status)} text-white`}>
                      {payment.payment_status}
                    </Badge>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusChecker;