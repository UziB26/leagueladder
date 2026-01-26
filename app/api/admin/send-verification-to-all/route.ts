import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createVerificationToken } from '@/lib/verification'
import { sendVerificationEmail } from '@/lib/email'
import { apiHandlers } from '@/lib/api-helpers'

/**
 * POST /api/admin/send-verification-to-all
 * 
 * One-time endpoint to send verification emails to all existing unverified users.
 * This should be called once after deploying email verification feature.
 * 
 * Safety features:
 * - Only admins can call this
 * - Won't send duplicate emails (checks for existing tokens)
 * - Skips already verified users
 * - Idempotent (safe to call multiple times)
 */
async function handler(request: NextRequest) {
  try {
    // Check email service configuration first
    const hasResendKey = !!process.env.RESEND_API_KEY
    const hasEmailFrom = !!process.env.EMAIL_FROM
    
    if (!hasResendKey || !hasEmailFrom) {
      return NextResponse.json({
        success: false,
        error: 'Email service not configured',
        details: {
          RESEND_API_KEY: hasResendKey ? 'Set' : 'Missing',
          EMAIL_FROM: hasEmailFrom ? 'Set' : 'Missing',
          message: 'Please set RESEND_API_KEY and EMAIL_FROM in Vercel environment variables'
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Get all users who haven't verified their email
    const unverifiedUsers = await db.user.findMany({
      where: {
        emailVerified: null
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (unverifiedUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unverified users found. All users are already verified!',
        sent: 0,
        skipped: 0,
        errors: []
      })
    }

    const results = {
      sent: 0,
      skipped: 0,
      errors: [] as Array<{ email: string; error: string }>
    }

    // Send verification email to each unverified user
    for (const user of unverifiedUsers) {
      try {
        // Check if user already has a valid verification token
        // If they do, skip to avoid spamming
        const existingToken = await db.verificationToken.findFirst({
          where: {
            identifier: user.email,
            expires: {
              gt: new Date()
            }
          }
        })

        if (existingToken) {
          console.log(`[Verification] Skipping ${user.email} - already has valid token`)
          results.skipped++
          continue
        }

        // Create new verification token
        const token = await createVerificationToken(user.email)
        
        if (!token) {
          results.errors.push({
            email: user.email,
            error: 'Failed to create verification token'
          })
          continue
        }

        // Send verification email
        const emailResult = await sendVerificationEmail(user.email, token)
        
        if (emailResult.success) {
          console.log(`[Verification] Sent verification email to ${user.email}`)
          results.sent++
        } else {
          console.error(`[Verification] Failed to send email to ${user.email}:`, emailResult.error)
          results.errors.push({
            email: user.email,
            error: emailResult.error || 'Failed to send email'
          })
        }
      } catch (error: any) {
        console.error(`[Verification] Error processing ${user.email}:`, error)
        results.errors.push({
          email: user.email,
          error: error.message || 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: results.errors.length === 0 || results.sent > 0,
      message: `Verification emails sent to ${results.sent} users. ${results.skipped} skipped (already have valid tokens). ${results.errors.length} errors.`,
      total: unverifiedUsers.length,
      sent: results.sent,
      skipped: results.skipped,
      errors: results.errors,
      config: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasEmailFrom: !!process.env.EMAIL_FROM,
        emailFrom: process.env.EMAIL_FROM || 'Not set'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('[Verification] Error sending verification emails to all users:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send verification emails',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export const POST = apiHandlers.admin(handler)
