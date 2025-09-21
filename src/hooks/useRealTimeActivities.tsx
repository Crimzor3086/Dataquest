
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeActivities = () => {
  const [activities, setActivities] = useState<any[]>([]);

  // Fetch initial activities
  const { data: initialActivities = [] } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          profiles!activities_user_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities'
        },
        async (payload) => {
          // Fetch the complete activity with profile data
          const { data } = await supabase
            .from('activities')
            .select(`
              *,
              profiles!activities_user_id_fkey(first_name, last_name)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setActivities(prev => [data, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Function to log new activities
  const logActivity = async (activityType: string, activityAction: string, activityDetails?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_activity_type: activityType,
      p_activity_action: activityAction,
      p_activity_details: activityDetails
    });
  };

  return { activities, logActivity };
};
