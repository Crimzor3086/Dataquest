
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalStudents: number;
  activeProjects: number;
  totalRevenue: number;
  coursesCompleted: number;
  recentEvents: any[];
  totalCourses: number;
  totalClients: number;
  totalVisitors: number;
  avgCourseRating: number;
  // Additional properties for compatibility
  totalProjects?: number;
  activeClients?: number;
  activeCourses?: number;
}

export const useRealTimeAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    activeProjects: 0,
    totalRevenue: 0,
    coursesCompleted: 0,
    recentEvents: [],
    totalCourses: 0,
    totalClients: 0,
    totalVisitors: 0,
    avgCourseRating: 0,
    totalProjects: 0,
    activeClients: 0,
    activeCourses: 0
  });
  const [loading, setLoading] = useState(true);

  const trackEvent = async (eventType: string, eventData: any = {}, pageUrl?: string) => {
    try {
      console.log('Tracking analytics event:', eventType, eventData);
      
      const sessionId = sessionStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      const { error } = await supabase.from('analytics_events').insert({
        event_type: eventType,
        event_data: eventData,
        page_url: pageUrl || window.location.pathname,
        session_id: sessionId,
        user_id: (await supabase.auth.getUser()).data.user?.id || null
      });

      if (error) {
        console.error('Error tracking event:', error);
      } else {
        console.log('Event tracked successfully:', eventType);
      }
    } catch (error) {
      console.error('Error in trackEvent:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('Fetching real analytics data from database...');

      // Fetch all data in parallel with proper error handling
      const [
        enrollmentsRes,
        projectsRes,
        coursesRes,
        clientsRes,
        completedEnrollmentsRes,
        eventsRes,
        visitorsRes,
        ratingsRes,
        paymentsRes
      ] = await Promise.allSettled([
        // Total students (count from enrollments)
        supabase.from('enrollments').select('id', { count: 'exact' }),
        
        // Active projects
        supabase.from('projects').select('id', { count: 'exact' }).in('status', ['planning', 'in_progress']),
        
        // Total courses
        supabase.from('courses').select('id', { count: 'exact' }).eq('status', 'published'),
        
        // Total clients
        supabase.from('clients').select('id', { count: 'exact' }),
        
        // Completed courses
        supabase.from('enrollments').select('id', { count: 'exact' }).eq('status', 'completed'),
        
        // Recent events
        supabase.from('analytics_events').select('event_type, created_at, event_data, page_url').order('created_at', { ascending: false }).limit(10),
        
        // Total visitors (count from visitor analytics)
        supabase.from('visitor_analytics').select('id', { count: 'exact' }),
        
        // Course ratings for average
        supabase.from('course_ratings').select('rating'),
        
        // Revenue calculation from completed payments
        supabase.from('payments').select('amount, payment_status').eq('payment_status', 'completed')
      ]);

      // Process results with proper error handling
      const enrollments = enrollmentsRes.status === 'fulfilled' ? enrollmentsRes.value : { count: 0 };
      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : { count: 0 };
      const courses = coursesRes.status === 'fulfilled' ? coursesRes.value : { count: 0 };
      const clients = clientsRes.status === 'fulfilled' ? clientsRes.value : { count: 0 };
      const completedEnrollments = completedEnrollmentsRes.status === 'fulfilled' ? completedEnrollmentsRes.value : { count: 0 };
      const events = eventsRes.status === 'fulfilled' ? eventsRes.value : { data: [] };
      const visitors = visitorsRes.status === 'fulfilled' ? visitorsRes.value : { count: 0 };
      const ratings = ratingsRes.status === 'fulfilled' ? ratingsRes.value : { data: [] };
      const payments = paymentsRes.status === 'fulfilled' ? paymentsRes.value : { data: [] };

      // Calculate average rating
      const ratingsData = ratings.data || [];
      const avgCourseRating = ratingsData.length > 0
        ? ratingsData.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsData.length 
        : 0;

      // Calculate total revenue from completed payments
      const paymentsData = payments.data || [];
      const totalRevenue = paymentsData.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      const newAnalytics = {
        totalStudents: enrollments.count || 0,
        activeProjects: projects.count || 0,
        totalRevenue: totalRevenue,
        coursesCompleted: completedEnrollments.count || 0,
        recentEvents: events.data || [],
        totalCourses: courses.count || 0,
        totalClients: clients.count || 0,
        totalVisitors: visitors.count || 0,
        avgCourseRating: avgCourseRating
      };

      console.log('Analytics data fetched:', newAnalytics);
      setAnalytics(newAnalytics);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscriptions with unique channel names
    console.log('Setting up real-time analytics subscriptions...');
    
    const channelId = `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const mainChannel = supabase
      .channel(`${channelId}-main`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, 
        (payload) => {
          console.log('Enrollments change detected:', payload);
          fetchAnalytics();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, 
        (payload) => {
          console.log('Projects change detected:', payload);
          fetchAnalytics();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, 
        (payload) => {
          console.log('Courses change detected:', payload);
          fetchAnalytics();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, 
        (payload) => {
          console.log('Clients change detected:', payload);
          fetchAnalytics();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitor_analytics' }, 
        (payload) => {
          console.log('Visitor analytics change detected:', payload);
          fetchAnalytics();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'course_ratings' }, 
        (payload) => {
          console.log('Course ratings change detected:', payload);
          fetchAnalytics();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_events' }, 
        (payload) => {
          console.log('Analytics events change detected:', payload);
          fetchAnalytics();
        }
      )
      .subscribe((status) => {
        console.log('Analytics subscription status:', status);
      });

    return () => {
      console.log('Cleaning up analytics subscriptions');
      supabase.removeChannel(mainChannel);
    };
  }, []);

  return { analytics, loading, trackEvent, refreshAnalytics: fetchAnalytics };
};
