/**
 * Email Service for League Ladder
 * Cross-platform email sending using Resend
 * Works on both Vercel and AWS Amplify
 */

import { Resend } from 'resend'

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
  // Check if email service is configured
  if (!resend) {
    const errorMsg = 'Resend API key not configured. Email verification disabled.'
    console.error('[Email Service]', errorMsg)
    console.error('[Email Service] To fix: Set RESEND_API_KEY in environment variables')
    return { success: false, error: 'Email service not configured. Please contact support.' }
  }

  if (!process.env.EMAIL_FROM) {
    const errorMsg = 'EMAIL_FROM not configured'
    console.error('[Email Service]', errorMsg)
    console.error('[Email Service] To fix: Set EMAIL_FROM in environment variables (e.g., onboarding@resend.dev)')
    return { success: false, error: 'Email service not configured. Please contact support.' }
  }

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`

  console.log('[Email Service] Attempting to send verification email to:', email)
  console.log('[Email Service] From:', process.env.EMAIL_FROM)
  console.log('[Email Service] Verification URL:', verifyUrl)

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
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

    if (error) {
      console.error('[Email Service] Resend API error:', JSON.stringify(error, null, 2))
      console.error('[Email Service] Error details:', error.message || 'Unknown error')
      return { success: false, error: error.message || 'Failed to send email' }
    }

    if (data) {
      console.log('[Email Service] Email sent successfully!', data)
    } else {
      console.warn('[Email Service] Email send completed but no data returned')
    }

    return { success: true }
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
