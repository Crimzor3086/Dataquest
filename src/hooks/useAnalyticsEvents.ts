import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type EventTypeFilter = string | 'all';

export interface AnalyticsFiltersState {
  startDate: Date | null;
  endDate: Date | null;
  eventType: EventTypeFilter;
}

interface TimePoint {
  date: string; // YYYY-MM-DD
  count: number;
}

interface UseAnalyticsEventsResult {
  loading: boolean;
  timeSeries: TimePoint[];
  topEvents: { event_type: string; count: number }[];
  totalEvents: number;
  refresh: () => void;
}

export const useAnalyticsEvents = (filters: AnalyticsFiltersState): UseAnalyticsEventsResult => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<{ created_at: string; event_type: string }[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('analytics_events')
        .select('created_at, event_type')
        .order('created_at', { ascending: true });

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        // include end of day
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        query = query.lte('created_at', end.toISOString());
      }
      if (filters.eventType && filters.eventType !== 'all') {
        query = query.eq('event_type', filters.eventType);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Failed to fetch analytics_events:', error);
        setRows([]);
      } else {
        setRows((data || []).map(r => ({ created_at: r.created_at as unknown as string, event_type: r.event_type as unknown as string })));
      }
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Realtime updates
    const channel = supabase
      .channel(`analytics-events-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_events' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate?.toISOString(), filters.endDate?.toISOString(), filters.eventType]);

  const timeSeries = useMemo<TimePoint[]>(() => {
    const buckets = new Map<string, number>();
    rows.forEach(r => {
      const d = new Date(r.created_at);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));
  }, [rows]);

  const topEvents = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach(r => counts.set(r.event_type, (counts.get(r.event_type) || 0) + 1));
    return Array.from(counts.entries())
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [rows]);

  return {
    loading,
    timeSeries,
    topEvents,
    totalEvents: rows.length,
    refresh: fetchData,
  };
};