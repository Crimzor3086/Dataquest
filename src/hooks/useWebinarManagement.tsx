import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Webinar {
  id: string;
  title: string;
  description: string;
  presenter: string;
  scheduled_date: string;
  timezone: string;
  duration_minutes: number | null;
  max_attendees: number;
  registration_deadline: string | null;
  platform: 'zoom' | 'google_meet' | 'teams' | 'custom';
  webinar_type: 'live' | 'recorded' | 'hybrid';
  registration_link: string | null;
  meeting_link: string | null;
  image_url: string | null;
  tags: string[] | null;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  created_at: string;
}

export interface WebinarRegistration {
  id: string;
  webinar_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  registered_at: string;
  attendance_status: string | null;
}

export interface WebinarRecording {
  id: string;
  webinar_id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  file_size_mb: number | null;
  is_public: boolean;
  created_at: string;
}

// Webinars
export const useWebinars = (filters?: { status?: string; upcoming?: boolean }) => {
  return useQuery({
    queryKey: ['webinars', filters],
    queryFn: async () => {
      let query = supabase
        .from('webinars')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.upcoming) {
        query = query.gte('scheduled_date', new Date().toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Webinar[];
    }
  });
};

export const useWebinar = (id: string) => {
  return useQuery({
    queryKey: ['webinar', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Webinar;
    }
  });
};

// Webinar Registrations
export const useWebinarRegistrations = (webinarId?: string) => {
  return useQuery({
    queryKey: ['webinar-registrations', webinarId],
    queryFn: async () => {
      let query = supabase
        .from('webinar_registrations')
        .select('*')
        .order('registered_at', { ascending: false });

      if (webinarId) {
        query = query.eq('webinar_id', webinarId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WebinarRegistration[];
    },
    enabled: !!webinarId
  });
};

// Webinar Recordings - Not implemented yet
export const useWebinarRecordings = (webinarId?: string) => {
  return useQuery({
    queryKey: ['webinar-recordings', webinarId],
    queryFn: async () => {
      // Return empty array as webinar_recordings table doesn't exist yet
      return [] as WebinarRecording[];
    }
  });
};

// Mutations
export const useWebinarMutations = () => {
  const queryClient = useQueryClient();

  const createWebinar = useMutation({
    mutationFn: async (webinarData: { title: string; description: string; presenter: string; scheduled_date: string; duration_minutes?: number; registration_link?: string; meeting_link?: string; status?: string }) => {
      const { data, error } = await supabase
        .from('webinars')
        .insert(webinarData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create webinar: ${error.message}`);
    }
  });

  const updateWebinar = useMutation({
    mutationFn: async ({ id, ...webinarData }: Partial<Webinar> & { id: string }) => {
      const { data, error } = await supabase
        .from('webinars')
        .update(webinarData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update webinar: ${error.message}`);
    }
  });

  const registerForWebinar = useMutation({
    mutationFn: async (registrationData: { webinar_id?: string; first_name: string; last_name: string; email: string; phone?: string; company?: string; position?: string; user_id?: string }) => {
      const { data, error } = await supabase
        .from('webinar_registrations')
        .insert(registrationData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinar-registrations'] });
      toast.success('Successfully registered for webinar!');
    },
    onError: (error: any) => {
      toast.error(`Registration failed: ${error.message}`);
    }
  });

  const addRecording = useMutation({
    mutationFn: async (recordingData: Partial<WebinarRecording>) => {
      // Temporarily disabled as webinar_recordings table doesn't exist yet
      throw new Error('Recording functionality not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinar-recordings'] });
      toast.success('Recording added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add recording: ${error.message}`);
    }
  });

  return {
    createWebinar,
    updateWebinar,
    registerForWebinar,
    addRecording
  };
};