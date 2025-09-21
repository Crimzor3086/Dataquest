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
      event_type, 
      event_data, 
      user_id,
      page_url,
      user_agent,
      ip_address
    } = await req.json()

    // Validate required fields
    if (!event_type) {
      throw new Error('Missing required field: event_type')
    }

    // Prepare analytics data
    const analyticsData = {
      metric_name: event_type,
      metric_value: 1,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      event_data: event_data || {},
      user_id: user_id || null,
      page_url: page_url || null,
      user_agent: user_agent || null,
      ip_address: ip_address || null
    }

    // Insert analytics record
    const { data: analytics, error } = await supabaseClient
      .from('analytics')
      .insert(analyticsData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to track analytics: ${error.message}`)
    }

    // Log activity if user is authenticated
    if (user_id) {
      await supabaseClient
        .from('activities')
        .insert({
          user_id: user_id,
          activity_type: 'analytics',
          activity_action: 'event_tracked',
          activity_details: `Analytics event tracked: ${event_type}`
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analytics_id: analytics.id,
        message: 'Analytics tracked successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in track-analytics function:', error)
    
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
