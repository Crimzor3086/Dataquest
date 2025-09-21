
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PaymentTestingPanel from '@/components/PaymentTestingPanel';
import PaymentAuditRunner from '@/components/PaymentAuditRunner';
import PaymentSystemStatus from '@/components/PaymentSystemStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, CreditCard, Users, TestTube, Shield, Activity } from 'lucide-react';
import { format } from 'date-fns';

const PaymentDashboard = () => {
  // Fetch all payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses(title)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate summary statistics
  const totalRevenue = payments.reduce((sum, payment) => 
    payment.payment_status === 'completed' ? sum + Number(payment.amount) : sum, 0
  );
  
  const pendingPayments = payments.filter(p => p.payment_status === 'pending').length;
  const completedPayments = payments.filter(p => p.payment_status === 'completed').length;
  const uniqueCustomers = new Set(payments.map(p => p.user_id)).size;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Payment Dashboard</h1>
            <p className="text-gray-400">Monitor all transactions, payments, and revenue analytics</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">KES {totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold text-white">{payments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Pending Payments</p>
                    <p className="text-2xl font-bold text-white">{pendingPayments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Unique Customers</p>
                    <p className="text-2xl font-bold text-white">{uniqueCustomers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Management Tabs */}
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600">
                <CreditCard className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="testing" className="data-[state=active]:bg-blue-600">
                <TestTube className="w-4 h-4 mr-2" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-blue-600">
                <Shield className="w-4 h-4 mr-2" />
                Audit
              </TabsTrigger>
              <TabsTrigger value="status" className="data-[state=active]:bg-blue-600">
                <Activity className="w-4 h-4 mr-2" />
                System Status
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <CardDescription className="text-gray-400">Latest payment transactions and enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Loading transactions...</div>
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">No transactions found</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left text-gray-400 py-3">Transaction ID</th>
                            <th className="text-left text-gray-400 py-3">Customer</th>
                            <th className="text-left text-gray-400 py-3">Course/Service</th>
                            <th className="text-left text-gray-400 py-3">Amount</th>
                            <th className="text-left text-gray-400 py-3">Status</th>
                            <th className="text-left text-gray-400 py-3">Date</th>
                            <th className="text-left text-gray-400 py-3">Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-700/50">
                              <td className="py-4">
                                <span className="text-blue-400 font-mono text-sm">
                                  {payment.transaction_id || payment.id.slice(0, 8)}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="text-white">
                                  {payment.user_id}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  -
                                </div>
                              </td>
                              <td className="py-4">
                                <span className="text-white">
                                  {payment.courses?.title || 'Service Payment'}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className="text-white font-semibold">
                                  {payment.currency} {Number(payment.amount).toLocaleString()}
                                </span>
                              </td>
                              <td className="py-4">
                                <Badge className={`${getStatusColor(payment.payment_status)} text-white`}>
                                  {payment.payment_status}
                                </Badge>
                              </td>
                              <td className="py-4">
                                <span className="text-gray-400">
                                  {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className="text-gray-400">
                                  {payment.payment_method || 'Not specified'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing">
              <PaymentTestingPanel />
            </TabsContent>

            <TabsContent value="audit">
              <PaymentAuditRunner />
            </TabsContent>

            <TabsContent value="status">
              <PaymentSystemStatus />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentDashboard;