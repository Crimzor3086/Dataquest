
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemUpdate {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  is_read: boolean;
  priority: number;
}

export const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState<SystemUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      console.log('Fetching system updates...');
      
      const { data, error } = await supabase
        .from('system_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching system updates:', error);
        return;
      }

      console.log('System updates fetched:', data);
      
      // Type assertion to ensure the data matches our interface
      const typedUpdates: SystemUpdate[] = (data || []).map(update => ({
        ...update,
        type: update.type as 'info' | 'success' | 'warning' | 'error'
      }));
      
      setUpdates(typedUpdates);
    } catch (error) {
      console.error('Error in fetchUpdates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();

    // Set up real-time subscription for system updates
    console.log('Setting up system updates real-time subscription...');
    
    const channel = supabase
      .channel('system-updates-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'system_updates' },
        (payload) => {
          console.log('System update change detected:', payload);
          fetchUpdates(); // Refresh data when changes occur
        }
      )
      .subscribe((status) => {
        console.log('System updates subscription status:', status);
      });

    return () => {
      console.log('Cleaning up system updates subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { updates, loading };
};
