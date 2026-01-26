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
    const emailResult = await sendVerificationEmail(userEmail, token)
    if (!emailResult.success) {
      console.error('[Send Verification] Failed to send email:', {
        email: userEmail,
        error: emailResult.error
      })
      return NextResponse.json(
        { 
          error: 'Failed to send verification email',
          message: emailResult.error || 'Please try again later.',
          details: process.env.NODE_ENV === 'development' ? {
            hasResendKey,
            hasEmailFrom,
            emailFrom: process.env.EMAIL_FROM
          } : undefined
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
