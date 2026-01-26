/**
 * Email Verification Token Management
 * Handles generation, storage, and validation of verification tokens
 */

import crypto from 'crypto'
import { db } from '@/lib/db'

const TOKEN_EXPIRY_HOURS = 24

/**
 * Generate a secure random token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create and store a verification token for an email
 */
export async function createVerificationToken(email: string): Promise<string | null> {
  try {
    // Generate token
    const token = generateVerificationToken()
    
    // Set expiry (24 hours from now)
    const expires = new Date()
    expires.setHours(expires.getHours() + TOKEN_EXPIRY_HOURS)

    // Delete any existing tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: email }
    })

    // Create new token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: token,
        expires: expires
      }
    })

    return token
  } catch (error) {
    console.error('Error creating verification token:', error)
    return null
  }
}

/**
 * Verify a token and return the email if valid
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token: token,
        expires: {
          gt: new Date() // Token must not be expired
        }
      }
    })

    if (!verificationToken) {
      return null
    }

    // Token is valid, return the email
    return verificationToken.identifier
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

/**
 * Delete a verification token (after successful verification)
 */
export async function deleteVerificationToken(token: string): Promise<void> {
  try {
    await db.verificationToken.deleteMany({
      where: { token: token }
    })
  } catch (error) {
    console.error('Error deleting verification token:', error)
  }
}

/**
 * Clean up expired tokens (can be run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await db.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date() // Delete tokens that have expired
        }
      }
    })
    return result.count
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
    return 0
  }
}
