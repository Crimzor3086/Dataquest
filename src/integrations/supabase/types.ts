export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_action: string
          activity_details: string | null
          activity_type: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          activity_action: string
          activity_details?: string | null
          activity_type: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_action?: string
          activity_details?: string | null
          activity_type?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          metric_name: string
          metric_value: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          metric_name: string
          metric_value?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          metric_name?: string
          metric_value?: number | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          challenge: string
          client_name: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          industry: string | null
          results: string
          solution: string
          title: string
        }
        Insert: {
          challenge: string
          client_name: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          industry?: string | null
          results: string
          solution: string
          title: string
        }
        Update: {
          challenge?: string
          client_name?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          industry?: string | null
          results?: string
          solution?: string
          title?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_ratings: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          rating: number | null
          review: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_ratings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          content: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          duration_weeks: number | null
          id: string
          instructor_id: string | null
          mode_of_learning: string | null
          price: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          duration_weeks?: number | null
          id?: string
          instructor_id?: string | null
          mode_of_learning?: string | null
          price?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          duration_weeks?: number | null
          id?: string
          instructor_id?: string | null
          mode_of_learning?: string | null
          price?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          progress: number | null
          status: Database["public"]["Enums"]["student_status"] | null
          student_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          student_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      kv_store_a105db7a: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      mpesa_transactions: {
        Row: {
          amount: number
          callback_metadata: Json | null
          checkout_request_id: string | null
          created_at: string
          currency: string
          id: string
          merchant_request_id: string | null
          order_ref: string
          payment_record_id: string | null
          phone_number: string | null
          result_code: string | null
          result_desc: string | null
          status: string
          tracking_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          callback_metadata?: Json | null
          checkout_request_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          merchant_request_id?: string | null
          order_ref: string
          payment_record_id?: string | null
          phone_number?: string | null
          result_code?: string | null
          result_desc?: string | null
          status?: string
          tracking_id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          callback_metadata?: Json | null
          checkout_request_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          merchant_request_id?: string | null
          order_ref?: string
          payment_record_id?: string | null
          phone_number?: string | null
          result_code?: string | null
          result_desc?: string | null
          status?: string
          tracking_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mpesa_transactions_payment_fk"
            columns: ["payment_record_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_logs: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          level: string
          message: string | null
          payment_record_id: string | null
          source: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          level?: string
          message?: string | null
          payment_record_id?: string | null
          source?: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          level?: string
          message?: string | null
          payment_record_id?: string | null
          source?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_payment_fk"
            columns: ["payment_record_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_logs_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "mpesa_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          service_id: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          service_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          service_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_team: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          manager_id: string | null
          progress: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          manager_id?: string | null
          progress?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          manager_id?: string | null
          progress?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string
          description: string
          download_count: number | null
          file_url: string | null
          id: string
          is_free: boolean | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_free?: boolean | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_free?: boolean | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      software_services: {
        Row: {
          created_at: string
          description: string
          duration: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          price_range: string | null
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          price_range?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          price_range?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_assignments: {
        Row: {
          assignment_description: string | null
          assignment_title: string
          course_id: string
          created_at: string | null
          due_date: string | null
          feedback: string | null
          grade: number | null
          id: string
          status: string | null
          student_id: string
          submission_content: string | null
          submission_file_url: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_description?: string | null
          assignment_title: string
          course_id: string
          created_at?: string | null
          due_date?: string | null
          feedback?: string | null
          grade?: number | null
          id?: string
          status?: string | null
          student_id: string
          submission_content?: string | null
          submission_file_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_description?: string | null
          assignment_title?: string
          course_id?: string
          created_at?: string | null
          due_date?: string | null
          feedback?: string | null
          grade?: number | null
          id?: string
          status?: string | null
          student_id?: string
          submission_content?: string | null
          submission_file_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_attendance: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          notes: string | null
          session_date: string
          session_title: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date: string
          session_title: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date?: string
          session_title?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          student_id: string
          title: string
          type: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          student_id: string
          title: string
          type?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          student_id?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completion_percentage: number | null
          course_id: string
          created_at: string | null
          id: string
          last_accessed: string | null
          module_name: string
          notes: string | null
          student_id: string
          time_spent_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          completion_percentage?: number | null
          course_id: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          module_name: string
          notes?: string | null
          student_id: string
          time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          completion_percentage?: number | null
          course_id?: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          module_name?: string
          notes?: string | null
          student_id?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          allow_registration: boolean | null
          analytics_service: string | null
          company_name: string | null
          created_at: string | null
          currency: string | null
          email_verification: boolean | null
          from_email: string | null
          id: number
          language: string | null
          password_complexity: boolean | null
          payment_gateway: string | null
          session_timeout: number | null
          smtp_host: string | null
          smtp_port: string | null
          timezone: string | null
          two_factor_auth: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_registration?: boolean | null
          analytics_service?: string | null
          company_name?: string | null
          created_at?: string | null
          currency?: string | null
          email_verification?: boolean | null
          from_email?: string | null
          id?: number
          language?: string | null
          password_complexity?: boolean | null
          payment_gateway?: string | null
          session_timeout?: number | null
          smtp_host?: string | null
          smtp_port?: string | null
          timezone?: string | null
          two_factor_auth?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_registration?: boolean | null
          analytics_service?: string | null
          company_name?: string | null
          created_at?: string | null
          currency?: string | null
          email_verification?: boolean | null
          from_email?: string | null
          id?: number
          language?: string | null
          password_complexity?: boolean | null
          payment_gateway?: string | null
          session_timeout?: number | null
          smtp_host?: string | null
          smtp_port?: string | null
          timezone?: string | null
          two_factor_auth?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_updates: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          priority: number | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          priority?: number | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string | null
          content: string
          created_at: string
          featured: boolean | null
          id: string
          image_url: string | null
          name: string
          position: string | null
          rating: number | null
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          position?: string | null
          rating?: number | null
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          position?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          city: string | null
          country_code: string | null
          country_name: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
          visit_duration: number | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          visit_duration?: number | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          visit_duration?: number | null
        }
        Relationships: []
      }
      webinar_registrations: {
        Row: {
          attendance_status: string | null
          company: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          position: string | null
          registered_at: string
          user_id: string | null
          webinar_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          company?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          position?: string | null
          registered_at?: string
          user_id?: string | null
          webinar_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          company?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          position?: string | null
          registered_at?: string
          user_id?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_registrations_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          presenter: string
          registration_link: string | null
          scheduled_date: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          presenter: string
          registration_link?: string | null
          scheduled_date: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          presenter?: string
          registration_link?: string | null
          scheduled_date?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_activity_action: string
          p_activity_details?: string
          p_activity_type: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "instructor" | "student"
      client_status: "active" | "inactive" | "prospect" | "completed"
      course_status: "draft" | "published" | "archived"
      project_status:
        | "planning"
        | "in_progress"
        | "completed"
        | "on_hold"
        | "cancelled"
      student_status: "active" | "inactive" | "completed" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "instructor", "student"],
      client_status: ["active", "inactive", "prospect", "completed"],
      course_status: ["draft", "published", "archived"],
      project_status: [
        "planning",
        "in_progress",
        "completed",
        "on_hold",
        "cancelled",
      ],
      student_status: ["active", "inactive", "completed", "suspended"],
    },
  },
} as const
