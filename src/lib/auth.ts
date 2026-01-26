import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from "crypto"

import { db } from "@/lib/db"
import { sanitizeEmail, sanitizeString } from "@/lib/sanitize"
import { createVerificationToken } from "@/lib/verification"
import { sendVerificationEmail } from "@/lib/email"

type DBUser = {
  id: string
  email: string
  name?: string
  is_admin?: boolean
  email_verified?: boolean
}

export const authOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        const name = credentials?.name

        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        // Sanitize email input
        const sanitizedEmail = sanitizeEmail(email)
        if (!sanitizedEmail) {
          return null
        }

        // Validate email format more strictly
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(sanitizedEmail)) {
          return null
        }

        // Sanitize password (basic sanitization)
        const sanitizedPassword = sanitizeString(password)
        if (!sanitizedPassword || sanitizedPassword.length < 8) {
          return null
        }

        // Additional password validation
        if (sanitizedPassword.length > 128) {
          return null // Prevent extremely long passwords
        }

        // Check if database is available
        if (!db) {
          console.error('Database not available for authentication')
          return null
        }

        // Check if user exists using Prisma
        const user = await db.user.findUnique({
          where: { email: sanitizedEmail },
          select: { id: true, email: true, name: true, isAdmin: true, emailVerified: true }
        })
        
        if (!user) {
          // Create new user using Prisma
          // Use provided name if available, otherwise fallback to email prefix
          const providedName = typeof name === "string" && name.trim() ? sanitizeString(name.trim()) : null
          const sanitizedName = providedName || sanitizeString(email.split('@')[0]) || 'User'
          
          const newUser = await db.user.create({
            data: {
              email: sanitizedEmail,
              name: sanitizedName,
              isAdmin: false,
              emailVerified: null, // Email not verified yet
              accounts: {
                create: {
                  type: 'credentials',
                  provider: 'credentials',
                  providerAccountId: crypto.randomUUID(),
                }
              }
            }
          })
          
          // Send verification email (non-blocking - don't fail registration if email fails)
          try {
            const token = await createVerificationToken(sanitizedEmail)
            if (token) {
              console.log('[Auth] Sending verification email to:', sanitizedEmail)
              const emailResult = await sendVerificationEmail(sanitizedEmail, token)
              if (emailResult.success) {
                console.log('[Auth] Verification email sent successfully')
              } else {
                console.error('[Auth] Failed to send verification email:', emailResult.error)
                // Don't fail registration, but log the error
              }
            } else {
              console.error('[Auth] Failed to create verification token')
            }
          } catch (error) {
            // Log error but don't fail registration
            console.error('[Auth] Error sending verification email during registration:', error)
          }
          
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name || sanitizedName,
            is_admin: false,
            email_verified: false
          }
        }
        
        // In real app, verify password here
        // If user exists but provided a new display name, update it
        const providedName = typeof name === "string" && name.trim() ? sanitizeString(name.trim()) : null
        if (providedName && providedName !== user.name) {
          try {
            await db.user.update({
              where: { id: user.id },
              data: { name: providedName }
            })
            user.name = providedName
          } catch (error) {
            console.error('Error updating user display name:', error)
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || providedName || undefined,
          is_admin: user.isAdmin || false,
          email_verified: !!user.emailVerified
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial login - set user data
        token.id = (user as DBUser).id
        token.email = (user as DBUser).email
        token.name = (user as DBUser).name
        token.is_admin = (user as DBUser).is_admin || false
        token.email_verified = (user as DBUser).email_verified || false
      } else if (token.email) {
        // Refresh admin status and email verification from database on each request
        // This ensures status changes are reflected immediately
        if (db) {
          try {
            const dbUser = await db.user.findUnique({
              where: { email: token.email as string },
              select: { isAdmin: true, emailVerified: true }
            })
            if (dbUser) {
              token.is_admin = dbUser.isAdmin || false
              token.email_verified = !!dbUser.emailVerified
            }
          } catch (error) {
            // If database query fails, keep existing token value
            console.error('Error refreshing user status:', error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as typeof session.user & { id?: string; email?: string; is_admin?: boolean; email_verified?: boolean }
        user.id = token.id as string
        user.email = token.email as string
        user.is_admin = token.is_admin as boolean
        user.email_verified = token.email_verified as boolean
        
        // Refresh name from database to ensure it's up to date
        if (db) {
          try {
            const dbUser = await db.user.findUnique({
              where: { email: token.email as string },
              select: { name: true }
            })
            if (dbUser?.name) {
              session.user.name = dbUser.name
            }
          } catch (error) {
            // If database query fails, keep existing session name
            console.error('Error refreshing user name:', error)
          }
        }
      }
      return session
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
