import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createVerificationToken } from '@/lib/verification'
import { sendVerificationEmail } from '@/lib/email'
import { apiRateLimit } from '@/lib/rate-limit'

/**
 * POST /api/auth/send-verification
 * Send verification email to the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Check email service configuration first
    const hasResendKey = !!process.env.RESEND_API_KEY
    const hasEmailFrom = !!process.env.EMAIL_FROM
    const emailFrom = process.env.EMAIL_FROM
    
    console.log('[Send Verification] Environment check:', {
      hasResendKey,
      hasEmailFrom,
      emailFrom,
      resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 7) + '...' : 'missing'
    })
    
    if (!hasResendKey || !hasEmailFrom) {
      console.error('[Send Verification] Email service not configured:', {
        RESEND_API_KEY: hasResendKey ? 'Set' : 'Missing',
        EMAIL_FROM: hasEmailFrom ? 'Set' : 'Missing'
      })
      return NextResponse.json(
        { 
          error: 'Email service not configured',
          message: 'Please contact support. Email verification is currently unavailable.'
        },
        { status: 503 }
      )
    }
    
    // Warn if not using onboarding@resend.dev
    if (emailFrom && !emailFrom.includes('@resend.dev') && !emailFrom.includes('@')) {
      console.warn('[Send Verification] EMAIL_FROM might be invalid:', emailFrom)
    }

    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, emailVerified: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    // Create verification token
    const token = await createVerificationToken(userEmail)
    if (!token) {
      console.error('[Send Verification] Failed to create token for:', userEmail)
      return NextResponse.json(
        { error: 'Failed to create verification token' },
        { status: 500 }
      )
    }

    // Send verification email
    console.log('[Send Verification] Attempting to send email to:', userEmail)
    const emailResult = await sendVerificationEmail(userEmail, token)
    console.log('[Send Verification] Email result:', emailResult)
    
    if (!emailResult.success) {
      console.error('[Send Verification] Failed to send email:', {
        email: userEmail,
        error: emailResult.error,
        hasResendKey,
        hasEmailFrom,
        emailFrom: process.env.EMAIL_FROM
      })
      // Check if error is about domain verification
      const isDomainError = emailResult.error?.includes('testing emails') || 
                           emailResult.error?.includes('verify a domain')
      
      return NextResponse.json(
        { 
          error: 'Failed to send verification email',
          message: emailResult.error || 'Please try again later.',
          requiresDomainVerification: isDomainError,
          details: {
            hasResendKey,
            hasEmailFrom,
            emailFrom: process.env.EMAIL_FROM || 'Not set',
            resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) + '...' : 'Not set',
            help: isDomainError ? 'Verify your domain at resend.com/domains or use onboarding@resend.dev for testing' : undefined
          }
        },
        { status: 500 }
      )
    }

    console.log('[Send Verification] Email sent successfully to:', userEmail)
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    })
  } catch (error: any) {
    console.error('[Send Verification] Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
