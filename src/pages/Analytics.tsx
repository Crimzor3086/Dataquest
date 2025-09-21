import Navigation from '@/components/Navigation';
import VisitorAnalytics from '@/components/VisitorAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBar, Users, Briefcase, BookOpen, TrendingUp, DollarSign, Star, Globe, TestTube, Shield } from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useVisitorAnalytics } from '@/hooks/useVisitorAnalytics';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters';
import AnalyticsTimeSeries from '@/components/analytics/AnalyticsTimeSeries';
import TopEventsCard from '@/components/analytics/TopEventsCard';
import { useAnalyticsEvents } from '@/hooks/useAnalyticsEvents';
import GA4RealTimeMetrics from '@/components/GA4RealTimeMetrics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Analytics = () => {
  const { analytics, loading, trackEvent } = useRealTimeAnalytics();
  const { visitorData } = useVisitorAnalytics();
  const ga4 = useGA4Analytics();
  const [filters, setFilters] = useState<{ startDate: Date | null; endDate: Date | null; eventType: string | 'all' }>({ startDate: null, endDate: null, eventType: 'all' });
  const { loading: eventsLoading, timeSeries: series, topEvents } = useAnalyticsEvents(filters);

  // Fetch comprehensive analytics data from database
  const { data: realTimeStats } = useQuery({
    queryKey: ['real-time-stats'],
    queryFn: async () => {
      const [paymentsRes, coursesRes, studentsRes, clientsRes, projectsRes, enrollmentsRes] = await Promise.allSettled([
        supabase.from('payments').select('amount, payment_status, created_at'),
        supabase.from('courses').select('id, status, price'),
        supabase.from('enrollments').select('id, status, progress, enrolled_at'),
        supabase.from('clients').select('id, status'),
        supabase.from('projects').select('id, status, budget'),
        supabase.from('enrollments').select('id, status, progress, enrolled_at')
      ]);

      const payments = paymentsRes.status === 'fulfilled' ? paymentsRes.value.data || [] : [];
      const courses = coursesRes.status === 'fulfilled' ? coursesRes.value.data || [] : [];
      const students = studentsRes.status === 'fulfilled' ? studentsRes.value.data || [] : [];
      const clients = clientsRes.status === 'fulfilled' ? clientsRes.value.data || [] : [];
      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data || [] : [];
      const enrollments = enrollmentsRes.status === 'fulfilled' ? enrollmentsRes.value.data || [] : [];

      const totalRevenue = payments
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const monthlyRevenue = payments
        .filter(p => p.payment_status === 'completed' && p.created_at)
        .reduce((acc, p) => {
          const month = new Date(p.created_at).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + Number(p.amount);
          return acc;
        }, {} as Record<string, number>);

      const completionRate = enrollments.length > 0 
        ? (enrollments.filter(e => e.progress === 100).length / enrollments.length) * 100 
        : 0;

      const avgProgress = enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
        : 0;

      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in_progress').length,
        activeClients: clients.filter(c => c.status === 'active').length,
        totalClients: clients.length,
        totalStudents: students.length,
        activeStudents: enrollments.filter(e => e.status === 'active').length,
        totalRevenue,
        monthlyRevenue,
        activeCourses: courses.filter(c => c.status === 'published').length,
        totalCourses: courses.length,
        avgCourseRating: analytics.avgCourseRating,
        completionRate,
        avgProgress,
        totalEnrollments: enrollments.length
      };
    },
    refetchInterval: 30000
  });

  useEffect(() => {
    // Track page visit to both GA4 and Supabase
    trackEvent('page_visit', { page: 'analytics' });
    ga4.trackEvent('analytics_dashboard_view', { 
      page: 'analytics',
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, ga4]);

  const totalVisitors = visitorData.reduce((sum, country) => sum + country.visitor_count, 0);
  const stats = realTimeStats || analytics;

  const kpiData = [
    { 
      title: 'Total Projects', 
      value: stats.totalProjects?.toString() || '0',
      subtitle: `${stats.activeProjects || 0} active`,
      color: 'text-blue-400',
      icon: Briefcase,
      link: '/projects'
    },
    { 
      title: 'Active Clients', 
      value: stats.activeClients?.toString() || '0',
      subtitle: `${stats.totalClients || 0} total`,
      color: 'text-green-400',
      icon: Users,
      link: '/admin/clients'
    },
    { 
      title: 'Total Students', 
      value: stats.totalStudents?.toString() || '0',
      subtitle: `${stats.activeStudents || 0} active`,
      color: 'text-purple-400',
      icon: BookOpen,
      link: '/admin/students'
    },
    { 
      title: 'Course Completion', 
      value: `${stats.completionRate?.toFixed(1) || '0'}%`,
      subtitle: `${stats.avgProgress?.toFixed(1) || '0'}% avg progress`,
      color: 'text-orange-400',
      icon: TrendingUp,
      link: '/admin/courses'
    },
    { 
      title: 'Total Revenue', 
      value: `KES ${stats.totalRevenue?.toLocaleString() || '0'}`,
      subtitle: `${stats.totalEnrollments || 0} enrollments`,
      color: 'text-emerald-400',
      icon: DollarSign,
      link: '/admin/payments'
    },
    { 
      title: 'Active Courses', 
      value: stats.activeCourses?.toString() || '0',
      subtitle: `${stats.totalCourses || 0} total`,
      color: 'text-yellow-400',
      icon: Star,
      link: '/admin/courses'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-white mt-4">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Admin Dashboard</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time insights, quick actions, and comprehensive analytics for your business.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {kpiData.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Link key={index} to={kpi.link}>
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{kpi.title}</p>
                          <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* GA4 Real-time Metrics */}
          <div className="mb-12">
            <GA4RealTimeMetrics />
          </div>

          {/* Analytics Filters + Charts */}
          <div className="mb-12 space-y-6">
            <AnalyticsFilters
              filters={filters}
              onChange={setFilters}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalyticsTimeSeries data={series} title="Events over time" />
              </div>
              <TopEventsCard items={topEvents} />
            </div>
          </div>

          {/* Real-time Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Visitor Analytics */}
            <VisitorAnalytics />
            
            {/* Recent Activity Feed */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest system events and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {analytics.recentEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No recent activity
                    </div>
                  ) : (
                    analytics.recentEvents.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                        <ChartBar className="w-4 h-4 text-blue-400 mt-1" />
                        <div>
                          <p className="text-white text-sm font-semibold">{event.event_type}</p>
                          <p className="text-gray-400 text-xs">{new Date(event.created_at).toLocaleString()}</p>
                          {event.event_data?.page_url && (
                            <p className="text-gray-500 text-xs">Page: {event.event_data.page_url}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Metrics</CardTitle>
                <CardDescription className="text-gray-400">Current system statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Projects</span>
                    <span className="text-blue-400 font-bold">{stats.totalProjects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Students</span>
                    <span className="text-green-400 font-bold">{stats.totalStudents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Course Completions</span>
                    <span className="text-purple-400 font-bold">{analytics.coursesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Courses</span>
                    <span className="text-orange-400 font-bold">{stats.activeCourses || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
                <CardDescription className="text-gray-400">System performance and health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Revenue</span>
                    <span className="text-green-500 font-bold">KES {stats.totalRevenue?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Course Rating</span>
                    <span className="text-yellow-400 font-bold">
                      {stats.avgCourseRating > 0 ? `${stats.avgCourseRating.toFixed(1)}/5` : 'No ratings yet'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Global Visitors</span>
                    <span className="text-cyan-400 font-bold">{totalVisitors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">System Status</span>
                    <span className="text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Online
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment System Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Payment System Testing</CardTitle>
                <CardDescription className="text-gray-400">Test payment integrations and system reliability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">M-Pesa Integration</span>
                    <span className="text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">PayPal Integration</span>
                    <span className="text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database Logging</span>
                    <span className="text-green-400 font-bold flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Operational
                    </span>
                  </div>
                </div>
                <Link to="/admin/payment-testing">
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <TestTube className="w-4 h-4 mr-2" />
                    Run Payment Tests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Payment System Audit</CardTitle>
                <CardDescription className="text-gray-400">Comprehensive security and performance audit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Security Score</span>
                    <span className="text-gray-400 font-bold">Run audit to get score</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Performance Grade</span>
                    <span className="text-gray-400 font-bold">Run audit to get grade</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Audit</span>
                    <span className="text-gray-400">No recent audits</span>
                  </div>
                </div>
                <Link to="/admin/payment-audit">
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Full Audit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Navigation */}
          <div className="bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/admin/courses">
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                      <div>
                        <h3 className="text-white font-semibold">Course Management</h3>
                        <p className="text-gray-400 text-sm">Manage courses and curriculum</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/students">
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-green-400" />
                      <div>
                        <h3 className="text-white font-semibold">Student Management</h3>
                        <p className="text-gray-400 text-sm">Track student progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/clients">
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-8 h-8 text-purple-400" />
                      <div>
                        <h3 className="text-white font-semibold">Client Management</h3>
                        <p className="text-gray-400 text-sm">Manage client relationships</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/payments">
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-400" />
                      <div>
                        <h3 className="text-white font-semibold">Payment Dashboard</h3>
                        <p className="text-gray-400 text-sm">Monitor transactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/payment-testing">
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TestTube className="w-8 h-8 text-blue-400" />
                      <div>
                        <h3 className="text-white font-semibold">Payment Testing</h3>
                        <p className="text-gray-400 text-sm">Test payment systems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/payment-audit">
                <Card className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-purple-400" />
                      <div>
                        <h3 className="text-white font-semibold">Payment Audit</h3>
                        <p className="text-gray-400 text-sm">Security & compliance audit</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
