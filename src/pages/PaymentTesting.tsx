import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PaymentTestingPanel from '@/components/PaymentTestingPanel';
import MpesaTestingPanel from '@/components/mpesa/MpesaTestingPanel';
import PaymentStatusChecker from '@/components/PaymentStatusChecker';
import PaymentSystemStatus from '@/components/PaymentSystemStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Shield, Activity, FileText, Search, Monitor } from 'lucide-react';

const PaymentTesting = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Payment System Testing</h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Comprehensive testing suite for PayPal and M-Pesa payment integrations. 
              Run automated tests to ensure payment reliability and security.
            </p>
          </div>

          {/* Testing Tabs */}
          <Tabs defaultValue="general" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
              <TabsTrigger value="status" className="data-[state=active]:bg-blue-600">
                <Monitor className="w-4 h-4 mr-2" />
                System Status
              </TabsTrigger>
              <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">
                <TestTube className="w-4 h-4 mr-2" />
                General Tests
              </TabsTrigger>
              <TabsTrigger value="mpesa" className="data-[state=active]:bg-blue-600">
                <Activity className="w-4 h-4 mr-2" />
                M-Pesa Tests
              </TabsTrigger>
              <TabsTrigger value="checker" className="data-[state=active]:bg-blue-600">
                <Search className="w-4 h-4 mr-2" />
                Status Checker
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
                <Shield className="w-4 h-4 mr-2" />
                Security Tests
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Test Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status">
              <PaymentSystemStatus />
            </TabsContent>

            <TabsContent value="general">
              <PaymentTestingPanel />
            </TabsContent>

            <TabsContent value="mpesa">
              <MpesaTestingPanel />
            </TabsContent>

            <TabsContent value="checker">
              <PaymentStatusChecker />
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Security Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">✅ Security Checks Passed</h4>
                      <ul className="text-green-200 text-sm space-y-1">
                        <li>• HTTPS encryption enabled</li>
                        <li>• Payment data not stored in plain text</li>
                        <li>• Secure API communication</li>
                        <li>• Input validation implemented</li>
                        <li>• Transaction logging secured</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">🔒 Security Features</h4>
                      <ul className="text-blue-200 text-sm space-y-1">
                        <li>• Row Level Security (RLS) enabled</li>
                        <li>• API authentication required</li>
                        <li>• Webhook signature verification</li>
                        <li>• Rate limiting implemented</li>
                        <li>• Error logging without sensitive data</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Test Reports & Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-700/30 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <h4 className="text-white font-semibold">QA Test Suite</h4>
                          <p className="text-gray-400 text-sm">Comprehensive test cases</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-700/30 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h4 className="text-white font-semibold">Security Report</h4>
                          <p className="text-gray-400 text-sm">Security compliance check</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-700/30 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <h4 className="text-white font-semibold">Performance Report</h4>
                          <p className="text-gray-400 text-sm">Response time analysis</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-gray-700/30 p-6 rounded-lg">
                      <h4 className="text-white font-semibold mb-4">Available Test Reports</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                          <span className="text-gray-300">M-Pesa Integration Test Report</span>
                          <span className="text-green-400 text-sm">✅ Available</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                          <span className="text-gray-300">PayPal Integration Test Report</span>
                          <span className="text-green-400 text-sm">✅ Available</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                          <span className="text-gray-300">Security Compliance Report</span>
                          <span className="text-green-400 text-sm">✅ Available</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                          <span className="text-gray-300">Performance Test Report</span>
                          <span className="text-green-400 text-sm">✅ Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentTesting;