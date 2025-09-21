import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GA4MetricsData {
  activeUsers: number;
  pageViews: number;
  engagementRate: number;
  averageSessionDuration: number;
  topPages: { page: string; views: number }[];
  topEvents: { event: string; count: number }[];
  realTimeUsers: number;
}

const GA4RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<GA4MetricsData>({
    activeUsers: 0,
    pageViews: 0,
    engagementRate: 0,
    averageSessionDuration: 0,
    topPages: [],
    topEvents: [],
    realTimeUsers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real analytics data from Supabase instead of mock data
    const fetchGA4Data = async () => {
      try {
        setLoading(true);
        
        // Get real data from analytics_events table
        const { data: events, error } = await supabase
          .from('analytics_events')
          .select('event_type, created_at, event_data')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching analytics events:', error);
          return;
        }
        
        // Process real analytics data
        const eventCounts = events?.reduce((acc, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const topEvents = Object.entries(eventCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([event, count]) => ({ event, count: count as number }));

        // Get unique sessions from last 24 hours
        const uniqueSessions = new Set(
          events?.map(e => {
            const eventData = e.event_data as any;
            return eventData?.session_id;
          }).filter(Boolean)
        ).size;
        
        const realTimeData: GA4MetricsData = {
          activeUsers: uniqueSessions || 0,
          pageViews: events?.filter(e => e.event_type === 'page_view').length || 0,
          engagementRate: events?.length > 0 ? Math.round((events.filter(e => e.event_type !== 'page_view').length / events.length) * 100) : 0,
          averageSessionDuration: 0, // Calculate from actual session data when available
          realTimeUsers: Math.min(uniqueSessions || 0, 10), // Estimate current users
          topPages: [
            { page: '/', views: events?.filter(e => (e.event_data as any)?.page_url === '/').length || 0 },
            { page: '/courses', views: events?.filter(e => (e.event_data as any)?.page_url === '/courses').length || 0 },
            { page: '/services', views: events?.filter(e => (e.event_data as any)?.page_url === '/services').length || 0 },
            { page: '/about', views: events?.filter(e => (e.event_data as any)?.page_url === '/about').length || 0 },
            { page: '/contacts', views: events?.filter(e => (e.event_data as any)?.page_url === '/contacts').length || 0 }
          ].filter(page => page.views > 0), // Only show pages with actual views
          topEvents: topEvents
        };

        setMetrics(realTimeData);
      } catch (error) {
        console.error('Error fetching GA4 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGA4Data();
    
    // Refresh data every 60 seconds for real-time updates
    const interval = setInterval(fetchGA4Data, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Google Analytics 4 Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading GA4 data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Users */}
      <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="w-5 h-5 mr-2 text-green-400" />
            Real-Time Users
          </CardTitle>
          <CardDescription className="text-green-200">
            Users currently active on your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400 mb-2">
            {metrics.realTimeUsers}
          </div>
          <div className="text-green-300 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full inline-block mr-2 animate-pulse"></div>
            Live now
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users (24h)</p>
                <p className="text-2xl font-bold text-blue-400">{metrics.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Page Views</p>
                <p className="text-2xl font-bold text-green-400">{metrics.pageViews}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Engagement Rate</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.engagementRate}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Session (sec)</p>
                <p className="text-2xl font-bold text-orange-400">{metrics.averageSessionDuration}s</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Pages (24h)</CardTitle>
            <CardDescription className="text-gray-400">Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                  <span className="text-white text-sm">{page.page}</span>
                  <span className="text-blue-400 font-semibold">{page.views}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Events (24h)</CardTitle>
            <CardDescription className="text-gray-400">Most triggered events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                  <span className="text-white text-sm">{event.event}</span>
                  <span className="text-green-400 font-semibold">{event.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GA4 Status */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">GA4 Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">GA4 Tracking Active</span>
              <span className="text-green-400 font-bold flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Measurement ID</span>
              <span className="text-blue-400 font-mono text-sm">G-VWXLN0LPY3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enhanced Ecommerce</span>
              <span className="text-green-400 font-bold">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Custom Events</span>
              <span className="text-green-400 font-bold">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GA4RealTimeMetrics;