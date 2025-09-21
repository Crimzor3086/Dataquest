import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  image_url: string | null;
  author_id: string;
  category_id: string | null;
  published: boolean;
  featured: boolean;
  view_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  blog_categories?: { name: string; slug: string; color: string };
  profiles?: { first_name: string; last_name: string };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  parent_id: string | null;
  created_at: string;
}

// Blog Posts
export const useBlogPosts = (filters?: { category?: string; published?: boolean; search?: string }) => {
  return useQuery({
    queryKey: ['blog-posts', filters],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.published !== undefined) {
        query = query.eq('published', filters.published);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    }
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', slug) // Use ID instead of slug for now
        .single();

      if (error) throw error;
      return data as any;
    }
  });
};

// Blog Categories - Not implemented yet
export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      return [] as BlogCategory[];
    }
  });
};

// Blog Tags - Not implemented yet  
export const useBlogTags = () => {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      return [] as BlogTag[];
    }
  });
};

// Blog Comments - Not implemented yet
export const useBlogComments = (postId: string) => {
  return useQuery({
    queryKey: ['blog-comments', postId],
    queryFn: async () => {
      return [] as BlogComment[];
    }
  });
};

// Mutations
export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: async (postData: { title: string; content: string; author_id: string; published?: boolean; excerpt?: string; image_url?: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create post: ${error.message}`);
    }
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, ...postData }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update post: ${error.message}`);
    }
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete post: ${error.message}`);
    }
  });

  const createComment = useMutation({
    mutationFn: async (commentData: Partial<BlogComment>) => {
      // Temporarily disabled as blog_comments table doesn't exist yet
      throw new Error('Comment functionality not implemented yet');
    },
    onSuccess: () => {
      toast.success('Comment submitted for review!');
    },
    onError: (error: any) => {
      toast.error(`Failed to submit comment: ${error.message}`);
    }
  });

  return {
    createPost,
    updatePost,
    deletePost,
    createComment
  };
};