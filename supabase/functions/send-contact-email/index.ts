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

    const { name, email, phone, subject, message } = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error('Missing required fields: name, email, subject, message')
    }

    // Email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>This message was sent from the DataQuest Solutions contact form on ${new Date().toLocaleString()}.</em></p>
    `

    // Log the contact form submission
    await supabaseClient
      .from('activities')
      .insert({
        activity_type: 'contact',
        activity_action: 'contact_form_submitted',
        activity_details: `Contact form submitted by ${name} (${email}) - Subject: ${subject}`,
        user_id: null
      })

    // In a real implementation, you would send the email here
    // For now, we'll just log it
    console.log('Contact email to be sent:', {
      to: 'dataquestsolutions2@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: emailContent
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact message received successfully! We will get back to you within 24 hours.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    
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
