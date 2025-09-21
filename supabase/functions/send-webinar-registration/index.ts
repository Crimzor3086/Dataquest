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
      name, 
      email, 
      phone, 
      company, 
      position, 
      webinarTitle, 
      webinarId 
    } = await req.json()

    // Validate required fields
    if (!name || !email || !webinarTitle || !webinarId) {
      throw new Error('Missing required fields: name, email, webinarTitle, webinarId')
    }

    // Email content for admin notification
    const adminEmailContent = `
      <h2>New Webinar Registration</h2>
      <p><strong>Webinar:</strong> ${webinarTitle}</p>
      <p><strong>Registrant Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Position:</strong> ${position || 'Not provided'}</p>
      <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p><em>Please send confirmation details to the registrant.</em></p>
    `

    // Email content for registrant confirmation
    const registrantEmailContent = `
      <h2>Webinar Registration Confirmed!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering for our webinar: <strong>${webinarTitle}</strong></p>
      <p>We have received your registration and will send you the webinar details and access link closer to the event date.</p>
      <p><strong>Registration Details:</strong></p>
      <ul>
        <li>Webinar: ${webinarTitle}</li>
        <li>Registrant: ${name}</li>
        <li>Email: ${email}</li>
        <li>Registration Date: ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>If you have any questions or need to make changes to your registration, please contact us.</p>
      <hr>
      <p><strong>DataQuest Solutions</strong><br>
      Email: dataquestsolutions2@gmail.com<br>
      Phone: +254 700 000 000</p>
    `

    // Log the webinar registration
    await supabaseClient
      .from('activities')
      .insert({
        activity_type: 'webinar',
        activity_action: 'webinar_registration',
        activity_details: `Webinar registration: ${name} (${email}) for ${webinarTitle}`,
        user_id: null
      })

    // Log emails to be sent
    console.log('Admin notification email:', {
      to: 'dataquestsolutions2@gmail.com',
      subject: `New Webinar Registration: ${webinarTitle}`,
      html: adminEmailContent
    })

    console.log('Registrant confirmation email:', {
      to: email,
      subject: `Webinar Registration Confirmed: ${webinarTitle}`,
      html: registrantEmailContent
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webinar registration received successfully! You will receive confirmation details shortly.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in send-webinar-registration function:', error)
    
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
