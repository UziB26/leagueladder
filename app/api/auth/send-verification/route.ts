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
      return NextResponse.json(
        { error: 'Failed to create verification token' },
        { status: 500 }
      )
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(userEmail, token)
    if (!emailResult.success) {
      // If email sending fails, still return success to user (don't expose email service errors)
      // But log the error for debugging
      console.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json(
        { 
          error: 'Failed to send verification email. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? emailResult.error : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    })
  } catch (error: any) {
    console.error('Error in send-verification route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
