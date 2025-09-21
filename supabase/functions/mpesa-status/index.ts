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

    const { tracking_id } = await req.json()

    if (!tracking_id) {
      throw new Error('tracking_id is required')
    }

    // Get transaction from database
    const { data: transaction, error } = await supabaseClient
      .from('mpesa_transactions')
      .select('*')
      .eq('tracking_id', tracking_id)
      .single()

    if (error) {
      throw new Error(`Transaction not found: ${error.message}`)
    }

    // Return transaction status
    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: {
          tracking_id: transaction.tracking_id,
          status: transaction.status,
          amount: transaction.amount,
          phone_number: transaction.phone_number,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in mpesa-status function:', error)
    
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
