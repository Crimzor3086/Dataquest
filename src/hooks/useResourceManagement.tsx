import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url: string | null;
  preview_url?: string | null;
  file_size_mb?: number | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  category_id?: string | null;
  author_id?: string | null;
  is_free: boolean;
  featured?: boolean;
  download_count: number;
  created_at: string;
  // Virtual properties for compatibility
  category?: any;
  status?: string;
  tags?: string[];
  resource_categories?: { name: string; slug: string; icon: string };
  profiles?: { first_name: string; last_name: string };
}

export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
}

// Resources
export const useResources = (filters?: { 
  category?: string; 
  type?: string; 
  difficulty?: string; 
  search?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .order('download_count', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(resource => ({
        ...resource,
        preview_url: resource.file_url,
        file_size_mb: 0,
        difficulty_level: null,
        category_id: null,
        author_id: null,
        featured: false
      })) as Resource[];
    }
  });
};

export const useResource = (id: string) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        preview_url: data.file_url,
        file_size_mb: 0,
        difficulty_level: null,
        category_id: null,
        author_id: null,
        featured: false
      } as Resource;
    }
  });
};

// Resource Categories
export const useResourceCategories = () => {
  return useQuery({
    queryKey: ['resource-categories'],
    queryFn: async () => {
      // Return empty array as resource_categories table doesn't exist yet
      return [] as ResourceCategory[];
    }
  });
};

// Featured Resources
export const useFeaturedResources = (limit = 6) => {
  return useQuery({
    queryKey: ['featured-resources', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(resource => ({
        ...resource,
        preview_url: resource.file_url,
        file_size_mb: 0,
        difficulty_level: null,
        category_id: null,
        author_id: null,
        featured: true
      })) as Resource[];
    }
  });
};

// Most Downloaded Resources
export const useMostDownloadedResources = (limit = 6) => {
  return useQuery({
    queryKey: ['most-downloaded-resources', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(resource => ({
        ...resource,
        preview_url: resource.file_url,
        file_size_mb: 0,
        difficulty_level: null,
        category_id: null,
        author_id: null,
        featured: false
      })) as Resource[];
    }
  });
};

// Mutations
export const useResourceMutations = () => {
  const queryClient = useQueryClient();

  const createResource = useMutation({
    mutationFn: async (resourceData: { title: string; description: string; type: string; file_url?: string; is_free?: boolean }) => {
      const { data, error } = await supabase
        .from('resources')
        .insert(resourceData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create resource: ${error.message}`);
    }
  });

  const updateResource = useMutation({
    mutationFn: async ({ id, ...resourceData }: Partial<Resource> & { id: string }) => {
      const { data, error } = await supabase
        .from('resources')
        .update(resourceData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update resource: ${error.message}`);
    }
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    }
  });

  const downloadResource = useMutation({
    mutationFn: async (resourceId: string) => {
      // Temporarily disabled as function doesn't exist yet
      console.log('Download resource:', resourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });

  return {
    createResource,
    updateResource,
    deleteResource,
    downloadResource
  };
};