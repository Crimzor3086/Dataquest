import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { 
      user_id, 
      activity_type, 
      activity_action, 
      activity_details 
    } = await req.json()

    // Validate required fields
    if (!activity_type || !activity_action) {
      throw new Error('Missing required fields: activity_type, activity_action')
    }

    // Insert activity log
    const { data: activity, error } = await supabaseClient
      .from('activities')
      .insert({
        user_id: user_id || null,
        activity_type: activity_type,
        activity_action: activity_action,
        activity_details: activity_details || null
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to log activity: ${error.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        activity_id: activity.id,
        message: 'Activity logged successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in log-activity function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
