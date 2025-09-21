
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorData {
  country_code: string;
  country_name: string;
  visitor_count: number;
}

export const useVisitorAnalytics = () => {
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const trackVisitor = async (data: {
    country_code?: string;
    country_name?: string;
    city?: string;
    page_url?: string;
    user_agent?: string;
    referrer?: string;
  }) => {
    try {
      const sessionId = sessionStorage.getItem('session_id') || 
        `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      console.log('Tracking visitor with data:', data);

      const { error } = await supabase.from('visitor_analytics').insert({
        session_id: sessionId,
        country_code: data.country_code,
        country_name: data.country_name,
        city: data.city,
        page_url: data.page_url || window.location.pathname,
        user_agent: data.user_agent || navigator.userAgent,
        referrer: data.referrer || document.referrer
      });

      if (error) {
        console.error('Error tracking visitor:', error);
      } else {
        console.log('Visitor tracked successfully');
        // Don't refresh data immediately to avoid excessive calls
        // Data will be refreshed by the real-time subscription
      }
    } catch (error) {
      console.error('Error in trackVisitor:', error);
    }
  };

  const fetchVisitorData = async () => {
    try {
      console.log('Fetching visitor analytics data...');
      
      // Check if supabase client is properly initialized
      if (!supabase) {
        console.error('Supabase client not initialized');
        setLoading(false);
        return;
      }

      // Get unique sessions per country for accurate visitor count
      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('country_code, country_name, session_id')
        .not('country_code', 'is', null)
        .not('country_name', 'is', null);

      if (error) {
        console.error('Error fetching visitor data:', error);
        return;
      }

      console.log('Raw visitor data:', data);

      // Use a Map to track unique sessions per country
      const sessionMap = new Map();
      data?.forEach(record => {
        const key = `${record.country_code}_${record.session_id}`;
        if (!sessionMap.has(key)) {
          sessionMap.set(key, {
            country_code: record.country_code,
            country_name: record.country_name
          });
        }
      });

      // Aggregate with unique sessions
      const aggregated: { [key: string]: VisitorData } = {};
      sessionMap.forEach((value) => {
        const key = value.country_code;
        if (!aggregated[key]) {
          aggregated[key] = {
            country_code: value.country_code,
            country_name: value.country_name,
            visitor_count: 0
          };
        }
        aggregated[key].visitor_count++;
      });

      const result = Object.values(aggregated).sort((a, b) => b.visitor_count - a.visitor_count);
      console.log('Aggregated visitor data:', result);
      setVisitorData(result);

    } catch (error) {
      console.error('Error in fetchVisitorData:', error);
      
      // Provide more specific error information
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Network connectivity issue detected. Please check:');
        console.error('1. Internet connection');
        console.error('2. Supabase service status');
        console.error('3. Browser extensions or firewall settings');
        console.error('4. CORS configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorData();

    // Set up real-time subscription for visitor analytics with unique channel name
    console.log('Setting up visitor analytics real-time subscription...');
    
    const channelId = `visitor-analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'visitor_analytics' }, 
        (payload) => {
          console.log('Visitor analytics change detected:', payload);
          
          // Debounce data fetching to prevent excessive calls
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
          }
          
          debounceTimer.current = setTimeout(() => {
            fetchVisitorData(); // Refresh data when changes occur
          }, 2000); // Wait 2 seconds before fetching
        }
      )
      .subscribe((status) => {
        console.log('Visitor analytics subscription status:', status);
      });

    return () => {
      console.log('Cleaning up visitor analytics subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { visitorData, loading, trackVisitor };
};
