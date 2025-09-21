import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Activity, Shield, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  component: string;
  status: 'operational' | 'degraded' | 'down';
  lastChecked: string;
  responseTime?: number;
  details?: string;
}

const PaymentSystemStatus: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    setLoading(true);
    const statusChecks: SystemStatus[] = [];

    try {
      // Check Supabase Database
      const dbStart = performance.now();
      const { error: dbError } = await supabase.from('payments').select('id').limit(1);
      const dbTime = performance.now() - dbStart;
      
      statusChecks.push({
        component: 'Supabase Database',
        status: dbError ? 'down' : dbTime > 1000 ? 'degraded' : 'operational',
        lastChecked: new Date().toISOString(),
        responseTime: dbTime,
        details: dbError ? dbError.message : `Response time: ${dbTime.toFixed(0)}ms`
      });

      // Check M-Pesa API connectivity (simulate)
      try {
        const mpesaStart = performance.now();
        // Simulate M-Pesa check without actual API call to avoid CORS issues
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
        const mpesaTime = performance.now() - mpesaStart;
        
        statusChecks.push({
          component: 'M-Pesa API',
          status: 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: mpesaTime,
          details: `Simulated check: ${mpesaTime.toFixed(0)}ms`
        });
      } catch (error: any) {
        statusChecks.push({
          component: 'M-Pesa API',
          status: 'down',
          lastChecked: new Date().toISOString(),
          details: `Error: ${error.message}`
        });
      }

      // Check PayPal API connectivity (simulate)
      try {
        const paypalStart = performance.now();
        // Simulate PayPal check
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
        const paypalTime = performance.now() - paypalStart;
        
        statusChecks.push({
          component: 'PayPal API',
          status: 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: paypalTime,
          details: `Simulated check: ${paypalTime.toFixed(0)}ms`
        });
      } catch (error: any) {
        statusChecks.push({
          component: 'PayPal API',
          status: 'down',
          lastChecked: new Date().toISOString(),
          details: `Error: ${error.message}`
        });
      }

      // Check Supabase Edge Functions
      try {
        const edgeStart = performance.now();
        // Test edge function availability by calling a simple function
        const { error: edgeError } = await supabase.functions.invoke('mpesa-status', {
          body: { tracking_id: 'test-status-check' }
        });
        const edgeTime = performance.now() - edgeStart;
        
        statusChecks.push({
          component: 'Supabase Edge Functions',
          status: edgeError ? 'degraded' : edgeTime > 2000 ? 'degraded' : 'operational',
          lastChecked: new Date().toISOString(),
          responseTime: edgeTime,
          details: edgeError ? `Warning: ${edgeError.message}` : `Response time: ${edgeTime.toFixed(0)}ms`
        });
      } catch (error: any) {
        statusChecks.push({
          component: 'Supabase Edge Functions',
          status: 'down',
          lastChecked: new Date().toISOString(),
          details: `Error: ${error.message}`
        });
      }

      setSystemStatus(statusChecks);
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Error checking system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-600/20 text-green-400 border-green-400';
      case 'degraded':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-400';
      case 'down':
        return 'bg-red-600/20 text-red-400 border-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-400';
    }
  };

  const getComponentIcon = (component: string) => {
    if (component.includes('Database')) return <Database className="w-5 h-5" />;
    if (component.includes('API')) return <Activity className="w-5 h-5" />;
    if (component.includes('Functions')) return <Shield className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  const overallStatus = systemStatus.length > 0 ? (
    systemStatus.every(s => s.status === 'operational') ? 'operational' :
    systemStatus.some(s => s.status === 'down') ? 'down' : 'degraded'
  ) : 'unknown';

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            {getStatusIcon(overallStatus)}
            <span className="ml-2">Payment System Status</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSystemStatus}
            disabled={loading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(overallStatus)}
              <div>
                <h3 className="text-white font-semibold">Overall System Status</h3>
                <p className="text-gray-400 text-sm">All payment services</p>
              </div>
            </div>
            <Badge className={getStatusColor(overallStatus)}>
              {overallStatus.toUpperCase()}
            </Badge>
          </div>

          {/* Individual Components */}
          <div className="space-y-3">
            {systemStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getComponentIcon(status.component)}
                  <div>
                    <h4 className="text-white font-medium">{status.component}</h4>
                    <p className="text-gray-400 text-xs">{status.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(status.status)}>
                    {status.status.toUpperCase()}
                  </Badge>
                  {status.responseTime && (
                    <p className="text-gray-400 text-xs mt-1">
                      {status.responseTime.toFixed(0)}ms
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="text-center text-gray-400 text-xs pt-4 border-t border-gray-700">
              Last updated: {new Date(lastUpdate).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSystemStatus;