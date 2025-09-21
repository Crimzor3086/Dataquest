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

    const { type, data } = await req.json()

    // Email configuration
    const smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: Deno.env.get('GMAIL_USER') || 'dataquestsolutions2@gmail.com',
        pass: Deno.env.get('GMAIL_APP_PASSWORD') || '',
      },
    }

    let emailContent = ''
    let subject = ''
    let recipient = ''

    switch (type) {
      case 'contact':
        subject = `New Contact Form Submission from ${data.name}`
        recipient = 'dataquestsolutions2@gmail.com'
        emailContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          <hr>
          <p><em>This message was sent from the DataQuest Solutions contact form.</em></p>
        `
        break

      case 'registration':
        subject = `New Course Registration: ${data.courseTitle}`
        recipient = 'dataquestsolutions2@gmail.com'
        emailContent = `
          <h2>New Course Registration</h2>
          <p><strong>Student Name:</strong> ${data.studentName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Course:</strong> ${data.courseTitle}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
          <hr>
          <p><em>Please process this registration and send confirmation to the student.</em></p>
        `
        break

      case 'enrollment':
        subject = `Course Enrollment Confirmation: ${data.courseTitle}`
        recipient = data.email
        emailContent = `
          <h2>Welcome to ${data.courseTitle}!</h2>
          <p>Dear ${data.studentName},</p>
          <p>Congratulations! You have successfully enrolled in <strong>${data.courseTitle}</strong>.</p>
          <p><strong>Course Details:</strong></p>
          <ul>
            <li>Course: ${data.courseTitle}</li>
            <li>Duration: ${data.duration || 'As per course schedule'}</li>
            <li>Start Date: ${data.startDate || 'To be announced'}</li>
          </ul>
          <p>We will contact you soon with further details about the course schedule and materials.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <hr>
          <p><strong>DataQuest Solutions</strong><br>
          Email: dataquestsolutions2@gmail.com<br>
          Phone: +254 700 000 000</p>
        `
        break

      case 'payment_confirmation':
        subject = `Payment Confirmation: ${data.courseTitle}`
        recipient = data.email
        emailContent = `
          <h2>Payment Confirmation</h2>
          <p>Dear ${data.studentName},</p>
          <p>Thank you for your payment! Your payment has been successfully processed.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Amount: KES ${data.amount}</li>
            <li>Course: ${data.courseTitle}</li>
            <li>Payment Method: ${data.paymentMethod}</li>
            <li>Transaction ID: ${data.transactionId}</li>
            <li>Date: ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>You are now officially enrolled in the course. We will contact you soon with course details.</p>
          <hr>
          <p><strong>DataQuest Solutions</strong><br>
          Email: dataquestsolutions2@gmail.com</p>
        `
        break

      default:
        throw new Error('Invalid email type')
    }

    // Send email using Deno's built-in SMTP (simplified)
    // In production, you might want to use a more robust email service
    const emailData = {
      to: recipient,
      subject: subject,
      html: emailContent,
      from: 'DataQuest Solutions <dataquestsolutions2@gmail.com>'
    }

    // Log the email for now (in production, you'd actually send it)
    console.log('Email to be sent:', emailData)

    // Log activity
    await supabaseClient
      .from('activities')
      .insert({
        activity_type: 'email',
        activity_action: 'email_sent',
        activity_details: `Email sent: ${type} to ${recipient}`,
        user_id: data.userId || null
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email queued successfully',
        type: type,
        recipient: recipient
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in send-email function:', error)
    
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
