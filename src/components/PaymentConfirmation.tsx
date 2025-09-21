import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, RefreshCw, Download, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentConfirmationProps {
  paymentId: string;
  onClose: () => void;
}

interface PaymentDetails {
  id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
  course_id?: string;
  service_id?: string;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ paymentId, onClose }) => {
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReceipt, setSendingReceipt] = useState(false);

  useEffect(() => {
    fetchPaymentDetails();
    const interval = setInterval(fetchPaymentDetails, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      setPayment(data);
      
      // Stop polling if payment is completed or failed
      if (data.payment_status === 'completed' || data.payment_status === 'failed') {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setLoading(false);
    }
  };

  const sendReceipt = async () => {
    if (!payment) return;

    setSendingReceipt(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'customer@example.com', // This should come from payment data
          subject: 'Payment Receipt - DataQuest Solutions',
          type: 'receipt',
          data: {
            transactionId: payment.transaction_id,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.payment_method,
            status: payment.payment_status,
            date: new Date(payment.created_at).toLocaleDateString()
          }
        }
      });

      if (error) throw error;
      toast.success('Receipt sent successfully!');
    } catch (error) {
      console.error('Error sending receipt:', error);
      toast.error('Failed to send receipt');
    } finally {
      setSendingReceipt(false);
    }
  };

  const downloadReceipt = () => {
    if (!payment) return;

    const receiptData = {
      company: 'DataQuest Solutions',
      transactionId: payment.transaction_id,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.payment_method,
      status: payment.payment_status,
      date: new Date(payment.created_at).toLocaleDateString(),
      time: new Date(payment.created_at).toLocaleTimeString()
    };

    const receiptText = `
PAYMENT RECEIPT
===============

Company: ${receiptData.company}
Transaction ID: ${receiptData.transactionId}
Amount: ${receiptData.currency} ${receiptData.amount}
Payment Method: ${receiptData.paymentMethod}
Status: ${receiptData.status}
Date: ${receiptData.date}
Time: ${receiptData.time}

Thank you for your payment!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.transaction_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES'
    }).format(amount);
  };

  if (!payment) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading payment details...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Payment Confirmation</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPaymentDetails}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Display */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon(payment.payment_status)}
            </div>
            <Badge className={`${getStatusColor(payment.payment_status)} text-white text-lg px-4 py-2`}>
              {payment.payment_status.toUpperCase()}
            </Badge>
            {payment.payment_status === 'pending' && (
              <p className="text-yellow-300 text-sm mt-2">
                Payment is being processed. Please wait...
              </p>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h4 className="text-white font-semibold mb-4">Transaction Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Transaction ID:</span>
                <p className="text-white font-mono">{payment.transaction_id}</p>
              </div>
              <div>
                <span className="text-gray-400">Payment Method:</span>
                <p className="text-white capitalize">{payment.payment_method}</p>
              </div>
              <div>
                <span className="text-gray-400">Amount:</span>
                <p className="text-white font-semibold">{formatCurrency(payment.amount, payment.currency)}</p>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <p className="text-white">{new Date(payment.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={downloadReceipt}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={sendReceipt}
              disabled={sendingReceipt}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {sendingReceipt ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Email Receipt
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </div>

          {/* Support Information */}
          <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-lg">
            <h4 className="text-blue-300 font-semibold mb-2">Need Help?</h4>
            <p className="text-blue-200 text-sm mb-2">
              If you have questions about this payment, contact our support team:
            </p>
            <div className="text-blue-200 text-sm">
              <p>Email: dataquestsolutions2@gmail.com</p>
              <p>Phone: +254 707 612 395</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentConfirmation;