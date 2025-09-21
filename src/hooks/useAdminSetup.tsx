
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminSetup = () => {
  const { user } = useAuth();

  useEffect(() => {
    const setupAdminRole = async () => {
      if (user && user.email === 'enochosenwafulah@gmail.com') {
        try {
          // Check if user already has admin role
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();

          if (!existingRole) {
            // Add admin role
            await supabase
              .from('user_roles')
              .insert({
                user_id: user.id,
                role: 'admin'
              });
            
            console.log('Admin role assigned successfully');
          }
        } catch (error) {
          console.error('Error setting up admin role:', error);
        }
      }
    };

    setupAdminRole();
  }, [user]);
};
