import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, deleteVerificationToken } from '@/lib/verification'
import { apiRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/auth/verify-email?token=...
 * Verify email address using token from email link
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get token from query parameters
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Verify token
    const email = await verifyToken(token)
    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email },
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
      // Delete token anyway
      await deleteVerificationToken(token)
      return NextResponse.json(
        { 
          success: true,
          message: 'Email already verified',
          alreadyVerified: true
        },
        { status: 200 }
      )
    }

    // Update user to mark email as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date()
      }
    })

    // Delete the used token
    await deleteVerificationToken(token)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error: any) {
    console.error('Error in verify-email route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
