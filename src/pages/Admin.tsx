
import Navigation from '@/components/Navigation';
import QuickActionModal from '@/components/QuickActionModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Users, UserCog, Settings, ChartBar, Briefcase, BookOpen, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeActivities } from '@/hooks/useRealTimeActivities';
import { format } from 'date-fns';
import AdminLinksManager from '@/components/AdminLinksManager';
import { useAuth } from '@/contexts/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'student' | 'client' | 'project' | 'course' | 'report' | null>(null);

  const { activities } = useRealTimeActivities();

  // Exclusive access check for enochosenwafulah@gmail.com
  if (!user || user.email !== 'enochosenwafulah@gmail.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Access Denied</h1>
            <p className="text-xl text-gray-400 mb-8">
              This admin dashboard is exclusively accessible by authorized administrators only.
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-semibold mb-2">Unauthorized Access Attempt</p>
              <p className="text-gray-400 text-sm">
                Email: {user?.email || 'Not authenticated'}
              </p>
              <p className="text-gray-400 text-sm">
                Time: {new Date().toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Required: enochosenwafulah@gmail.com
              </p>
            </div>
            <div className="mt-8">
              <Link to="/">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch real-time statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [studentsResult, clientsResult, projectsResult, coursesResult, paymentsResult] = await Promise.all([
        supabase.from('enrollments').select('id'),
        supabase.from('clients').select('id, status'),
        supabase.from('projects').select('id, status'),
        supabase.from('courses').select('id, status'),
        supabase.from('payments').select('amount, payment_status')
      ]);

      const totalRevenue = paymentsResult.data?.reduce((sum, payment) => 
        payment.payment_status === 'completed' ? sum + Number(payment.amount) : sum, 0
      ) || 0;

      return {
        totalStudents: studentsResult.data?.length || 0,
        activeClients: clientsResult.data?.filter(c => c.status === 'active').length || 0,
        totalClients: clientsResult.data?.length || 0,
        activeProjects: projectsResult.data?.filter(p => p.status === 'in_progress').length || 0,
        totalProjects: projectsResult.data?.length || 0,
        activeCourses: coursesResult.data?.filter(c => c.status === 'published').length || 0,
        totalCourses: coursesResult.data?.length || 0,
        totalRevenue
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const handleQuickAction = (type: 'student' | 'client' | 'project' | 'course' | 'report') => {
    setActionType(type);
    setModalOpen(true);
  };

  // Fetch additional statistics for admin modules
  const { data: moduleStats } = useQuery({
    queryKey: ['admin-module-stats'],
    queryFn: async () => {
      const [enrollmentsRes, paymentsRes, instructorsRes, blogsRes, resourcesRes, webinarsRes] = await Promise.all([
        supabase.from('enrollments').select('status'),
        supabase.from('payments').select('payment_status'),
        supabase.from('instructors').select('id, status'),
        supabase.from('blog_posts').select('id, status'),
        supabase.from('resources').select('id, status'),
        supabase.from('webinars').select('id, status')
      ]);

      const activeEnrollments = enrollmentsRes.data?.filter(e => e.status === 'active').length || 0;
      const completedEnrollments = enrollmentsRes.data?.filter(e => e.status === 'completed').length || 0;
      const pendingPayments = paymentsRes.data?.filter(p => p.payment_status === 'pending').length || 0;
      const completedPayments = paymentsRes.data?.filter(p => p.payment_status === 'completed').length || 0;
      const activeInstructors = instructorsRes.data?.filter(i => i.status === 'active').length || 0;
      const publishedBlogs = blogsRes.data?.filter(b => b.status === 'published').length || 0;
      const draftBlogs = blogsRes.data?.filter(b => b.status === 'draft').length || 0;
      const activeResources = resourcesRes.data?.filter(r => r.status === 'active').length || 0;
      const scheduledWebinars = webinarsRes.data?.filter(w => w.status === 'scheduled').length || 0;

      return {
        activeEnrollments,
        completedEnrollments,
        pendingPayments,
        completedPayments,
        activeInstructors,
        publishedBlogs,
        draftBlogs,
        activeResources,
        scheduledWebinars
      };
    },
    refetchInterval: 30000
  });

  const adminModules = [
    {
      title: 'Student Management',
      description: 'Manage student enrollments, progress tracking, and course assignments',
      icon: Users,
      link: '/admin/students',
      stats: { 
        total: stats?.totalStudents || 0, 
        active: moduleStats?.activeEnrollments || 0, 
        completed: moduleStats?.completedEnrollments || 0 
      },
      color: 'bg-blue-600'
    },
    {
      title: 'Client Management',
      description: 'Handle client relationships, project assignments, and billing information',
      icon: UserCog,
      link: '/admin/clients',
      stats: { 
        total: stats?.totalClients || 0, 
        active: stats?.activeClients || 0, 
        pending: moduleStats?.pendingPayments || 0 
      },
      color: 'bg-green-600'
    },
    {
      title: 'Project Management',
      description: 'Oversee project timelines, resource allocation, and deliverables',
      icon: Briefcase,
      link: '/projects',
      stats: { 
        total: stats?.totalProjects || 0, 
        active: stats?.activeProjects || 0, 
        completed: moduleStats?.completedPayments || 0 
      },
      color: 'bg-purple-600'
    },
    {
      title: 'Course Management',
      description: 'Create and manage training courses, schedules, and instructor assignments',
      icon: BookOpen,
      link: '/admin/courses',
      stats: { 
        total: stats?.totalCourses || 0, 
        active: stats?.activeCourses || 0, 
        draft: moduleStats?.draftBlogs || 0 
      },
      color: 'bg-orange-600'
    },
    {
      title: 'Payment Dashboard',
      description: 'Track payments, transactions, and revenue analytics',
      icon: CreditCard,
      link: '/admin/payments',
      stats: { 
        revenue: `KES ${stats?.totalRevenue?.toLocaleString() || '0'}`, 
        transactions: moduleStats?.completedPayments || 0, 
        pending: moduleStats?.pendingPayments || 0 
      },
      color: 'bg-emerald-600'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View comprehensive business analytics and performance metrics',
      icon: ChartBar,
      link: '/admin/analytics',
      stats: { 
        revenue: `KES ${stats?.totalRevenue?.toLocaleString() || '0'}`, 
        growth: '+0%', 
        satisfaction: '0%' 
      },
      color: 'bg-indigo-600'
    },
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage blog posts and content',
      icon: Users,
      link: '/admin/blog',
      stats: { 
        total: moduleStats?.publishedBlogs + moduleStats?.draftBlogs || 0, 
        published: moduleStats?.publishedBlogs || 0, 
        draft: moduleStats?.draftBlogs || 0 
      },
      color: 'bg-pink-600'
    },
    {
      title: 'Resource Management',
      description: 'Manage learning resources, documents, and materials',
      icon: Settings,
      link: '/admin/resources',
      stats: { 
        total: moduleStats?.activeResources || 0, 
        active: moduleStats?.activeResources || 0, 
        archived: 0 
      },
      color: 'bg-gray-600'
    },
    {
      title: 'Webinar Scheduling',
      description: 'Schedule and manage webinars and live sessions',
      icon: Settings,
      link: '/admin/webinars',
      stats: { 
        total: moduleStats?.scheduledWebinars || 0, 
        scheduled: moduleStats?.scheduledWebinars || 0, 
        completed: 0 
      },
      color: 'bg-teal-600'
    }
  ];

  // Fetch real system health metrics
  const { data: systemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      // Simulate system health checks (in production, these would be real metrics)
      const startTime = Date.now();
      
      // Test database connection
      const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
      const dbResponseTime = Date.now() - startTime;
      
      // Test API response
      const apiStartTime = Date.now();
      await supabase.auth.getSession();
      const apiResponseTime = Date.now() - apiStartTime;
      
      return [
        { 
          metric: 'Database Connection', 
          value: dbError ? 'Error' : 'Connected', 
          status: dbError ? 'Critical' : 'Excellent', 
          color: dbError ? 'text-red-400' : 'text-green-400' 
        },
        { 
          metric: 'Database Performance', 
          value: `${dbResponseTime}ms`, 
          status: dbResponseTime < 100 ? 'Excellent' : dbResponseTime < 500 ? 'Good' : 'Poor', 
          color: dbResponseTime < 100 ? 'text-green-400' : dbResponseTime < 500 ? 'text-blue-400' : 'text-red-400' 
        },
        { 
          metric: 'API Response Time', 
          value: `${apiResponseTime}ms`, 
          status: apiResponseTime < 200 ? 'Excellent' : apiResponseTime < 1000 ? 'Good' : 'Poor', 
          color: apiResponseTime < 200 ? 'text-green-400' : apiResponseTime < 1000 ? 'text-blue-400' : 'text-red-400' 
        },
        { 
          metric: 'System Status', 
          value: 'Online', 
          status: 'Excellent', 
          color: 'text-green-400' 
        }
      ];
    },
    refetchInterval: 60000 // Check every minute
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Admin Dashboard</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive management interface for all DataQuest Solutions operations, 
              analytics, and system administration.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats?.totalStudents || 0}</div>
                <div className="text-gray-400">Total Students</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats?.activeClients || 0}</div>
                <div className="text-gray-400">Active Clients</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{stats?.activeProjects || 0}</div>
                <div className="text-gray-400">Active Projects</div>
                <div className="text-blue-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">KES {stats?.totalRevenue?.toLocaleString() || '0'}</div>
                <div className="text-gray-400">Revenue YTD</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Modules */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Management Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Link key={index} to={module.link}>
                    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-400 mb-4">
                          {module.description}
                        </CardDescription>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {Object.entries(module.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-white font-semibold">{value}</div>
                              <div className="text-gray-500 capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activities and System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Recent Activities */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activities</CardTitle>
                <CardDescription className="text-gray-400">Real-time system and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No recent activities</div>
                  ) : (
                    activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                        <Badge variant="outline" className="border-blue-400 text-blue-400 text-xs">
                          {activity.activity_type}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-white text-sm font-semibold">{activity.activity_action}</p>
                          <p className="text-gray-400 text-xs">{activity.activity_details}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700">
                  View All Activities
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
                <CardDescription className="text-gray-400">Real-time system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth?.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{metric.metric}</p>
                        <p className="text-gray-400 text-sm">{metric.status}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${metric.color}`}>{metric.value}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-gray-400 text-center py-4">Loading system metrics...</div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-700">
                  System Diagnostics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Admin Links Manager */}
          <div className="mb-8">
            <AdminLinksManager />
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">Frequently used administrative functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleQuickAction('student')}
                >
                  Add Student
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleQuickAction('client')}
                >
                  New Client
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleQuickAction('project')}
                >
                  Create Project
                </Button>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleQuickAction('course')}
                >
                  New Course
                </Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleQuickAction('report')}
                >
                  Generate Report
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Backup Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuickActionModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType={actionType}
      />
    </div>
  );
};

export default Admin;
