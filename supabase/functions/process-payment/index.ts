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
      payment_method, 
      amount, 
      phone_number, 
      course_id, 
      user_id,
      currency = 'KES'
    } = await req.json()

    // Validate required fields
    if (!payment_method || !amount || !course_id || !user_id) {
      throw new Error('Missing required fields: payment_method, amount, course_id, user_id')
    }

    let transaction_id = ''
    let status = 'pending'

    switch (payment_method) {
      case 'mpesa':
        if (!phone_number) {
          throw new Error('Phone number is required for M-Pesa payments')
        }
        
        // Generate tracking ID
        transaction_id = `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Store M-Pesa transaction
        const { data: mpesaTransaction, error: mpesaError } = await supabaseClient
          .from('mpesa_transactions')
          .insert({
            tracking_id: transaction_id,
            phone_number: phone_number,
            amount: amount,
            status: 'pending'
          })
          .select()
          .single()

        if (mpesaError) {
          throw new Error(`Failed to create M-Pesa transaction: ${mpesaError.message}`)
        }

        // In a real implementation, you would initiate STK Push here
        console.log('M-Pesa STK Push would be initiated:', {
          phone_number,
          amount,
          tracking_id: transaction_id
        })

        break

      case 'paypal':
        // Generate PayPal order ID
        transaction_id = `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Store PayPal transaction
        const { data: paypalTransaction, error: paypalError } = await supabaseClient
          .from('paypal_transactions')
          .insert({
            order_id: transaction_id,
            amount: amount,
            currency: currency,
            status: 'pending'
          })
          .select()
          .single()

        if (paypalError) {
          throw new Error(`Failed to create PayPal transaction: ${paypalError.message}`)
        }

        // In a real implementation, you would create PayPal order here
        console.log('PayPal order would be created:', {
          order_id: transaction_id,
          amount,
          currency
        })

        break

      case 'manual':
        transaction_id = `MANUAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        status = 'pending'
        break

      default:
        throw new Error('Invalid payment method')
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user_id,
        course_id: course_id,
        amount: amount,
        currency: currency,
        payment_method: payment_method,
        status: status,
        transaction_id: transaction_id,
        payment_data: {
          phone_number: phone_number,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error(`Failed to create payment record: ${paymentError.message}`)
    }

    // Log activity
    await supabaseClient
      .from('activities')
      .insert({
        activity_type: 'payment',
        activity_action: 'payment_initiated',
        activity_details: `Payment initiated: ${payment_method} - ${amount} ${currency}`,
        user_id: user_id
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction_id: transaction_id,
        status: status,
        payment_id: payment.id,
        message: 'Payment initiated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in process-payment function:', error)
    
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
