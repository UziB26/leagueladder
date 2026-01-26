/**
 * Email Service for League Ladder
 * Cross-platform email sending using Resend
 * Works on both Vercel and AWS Amplify
 */

import { Resend } from 'resend'

// Initialize Resend client
let resend: Resend | null = null
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
} catch (error) {
  console.error('[Email Service] Failed to initialize Resend client:', error)
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
  // Re-check environment variables at runtime (they might not be available at module load time)
  const resendKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM
  
  console.log('[Email Service] Runtime check:', {
    hasResendKey: !!resendKey,
    hasEmailFrom: !!emailFrom,
    emailFrom: emailFrom,
    resendKeyPrefix: resendKey ? resendKey.substring(0, 7) + '...' : 'missing',
    resendClientExists: !!resend
  })

  // Check if email service is configured
  if (!resendKey) {
    const errorMsg = 'Resend API key not configured. Email verification disabled.'
    console.error('[Email Service]', errorMsg)
    console.error('[Email Service] To fix: Set RESEND_API_KEY in environment variables')
    return { success: false, error: 'Email service not configured. Please contact support.' }
  }

  if (!emailFrom) {
    const errorMsg = 'EMAIL_FROM not configured'
    console.error('[Email Service]', errorMsg)
    console.error('[Email Service] To fix: Set EMAIL_FROM in environment variables (e.g., onboarding@resend.dev)')
    return { success: false, error: 'Email service not configured. Please contact support.' }
  }

  // Re-initialize Resend client if needed (in case env vars weren't available at module load)
  let resendClient = resend
  if (!resendClient && resendKey) {
    try {
      resendClient = new Resend(resendKey)
      console.log('[Email Service] Initialized Resend client at runtime')
    } catch (error) {
      console.error('[Email Service] Failed to initialize Resend client:', error)
      return { success: false, error: 'Failed to initialize email service' }
    }
  }

  if (!resendClient) {
    return { success: false, error: 'Email service not available' }
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`

  console.log('[Email Service] Attempting to send verification email to:', email)
  console.log('[Email Service] From:', process.env.EMAIL_FROM)
  console.log('[Email Service] Verification URL:', verifyUrl)

  try {
    // Log the actual values being used (without exposing full API key)
    console.log('[Email Service] Sending email with config:', {
      from: process.env.EMAIL_FROM,
      to: email,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 7) : 'missing'
    })

    console.log('[Email Service] Calling Resend API with:', {
      from: emailFrom,
      to: email,
      hasClient: !!resendClient
    })

    let apiResponse
    try {
      apiResponse = await resendClient.emails.send({
        from: emailFrom,
        to: email,
        subject: 'Verify your email address - League Ladder',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">League Ladder</h1>
              </div>
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
                <p>Thank you for signing up for League Ladder! Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email Address</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
                <p style="color: #6b7280; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours.</p>
                <p style="color: #6b7280; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
              </div>
            </body>
          </html>
        `,
        text: `Verify your email address for League Ladder by clicking this link: ${verifyUrl}\n\nThis link will expire in 24 hours.`,
      })
      
      console.log('[Email Service] Resend API response received:', {
        hasData: !!apiResponse.data,
        hasError: !!apiResponse.error,
        data: apiResponse.data,
        error: apiResponse.error
      })
    } catch (exception: any) {
      console.error('[Email Service] Exception calling Resend API:', exception)
      console.error('[Email Service] Exception type:', typeof exception)
      console.error('[Email Service] Exception message:', exception?.message)
      console.error('[Email Service] Exception stack:', exception?.stack)
      return { 
        success: false, 
        error: `Exception: ${exception?.message || 'Unknown error occurred while calling email service'}` 
      }
    }

    const { data, error } = apiResponse

    if (error) {
      console.error('[Email Service] Resend API returned error:', JSON.stringify(error, null, 2))
      console.error('[Email Service] Error type:', typeof error)
      console.error('[Email Service] Error constructor:', error?.constructor?.name)
      
      // Resend errors can be objects with message property or strings
      let errorMessage = 'Failed to send email'
      
      if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // Resend error structure can vary: { message: string } or nested
        errorMessage = (error as any).message || 
                      (error as any).error?.message || 
                      JSON.stringify(error)
      }
      
      console.error('[Email Service] Parsed error message:', errorMessage)
      
      // Check for specific Resend errors
      if (errorMessage.includes('testing emails') || 
          errorMessage.includes('verify a domain') ||
          errorMessage.includes('only send testing emails')) {
        errorMessage = `Resend restriction: ${errorMessage}. Using onboarding@resend.dev should work - please check your EMAIL_FROM variable is set correctly in Vercel and redeploy.`
      }
      
      return { success: false, error: errorMessage }
    }

    if (data) {
      console.log('[Email Service] Email sent successfully!', JSON.stringify(data, null, 2))
      return { success: true }
    } else {
      console.warn('[Email Service] Email send completed but no data returned - this might indicate an issue')
      // Still return success if no error, as Resend might return success without data
      return { success: true }
    }
  } catch (error: any) {
    console.error('[Email Service] Exception sending verification email:', error)
    console.error('[Email Service] Error stack:', error.stack)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}
