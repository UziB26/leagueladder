import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from "crypto"

import { db } from "@/lib/db"
import { sanitizeEmail, sanitizeString } from "@/lib/sanitize"

type DBUser = {
  id: string
  email: string
  name?: string
  is_admin?: boolean
}

export const authOptions = {
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

        // Check if user exists
        const user = db.prepare('SELECT id, email, name, is_admin FROM users WHERE email = ?').get(sanitizedEmail) as DBUser | undefined
        
        if (!user) {
          // Create new user
          const userId = crypto.randomUUID()
          // Use provided name if available, otherwise fallback to email prefix
          const providedName = typeof name === "string" && name.trim() ? sanitizeString(name.trim()) : null
          const sanitizedName = providedName || sanitizeString(email.split('@')[0]) || 'User'
          
          db.prepare(`
            INSERT INTO users (id, email, name, created_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `).run(userId, sanitizedEmail, sanitizedName)
          
          // Store password (in real app, use separate table)
          db.prepare(`
            INSERT INTO accounts (id, userId, type, provider, providerAccountId) 
            VALUES (?, ?, 'credentials', 'credentials', ?)
          `).run(crypto.randomUUID(), userId, userId)
          
          return {
            id: userId,
            email: sanitizedEmail,
            name: sanitizedName,
            is_admin: false
          }
        }
        
        // In real app, verify password here
        return {
          id: user.id!,
          email: user.email,
          name: user.name,
          is_admin: user.is_admin || false
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
      } else if (token.email) {
        // Refresh admin status from database on each request
        // This ensures admin status changes are reflected immediately
        try {
          const dbUser = db.prepare('SELECT is_admin FROM users WHERE email = ?').get(token.email) as DBUser | undefined
          if (dbUser) {
            token.is_admin = dbUser.is_admin || false
          }
        } catch (error) {
          // If database query fails, keep existing token value
          console.error('Error refreshing admin status:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as typeof session.user & { id?: string; email?: string; is_admin?: boolean }).id = token.id as string
        ;(session.user as typeof session.user & { id?: string; email?: string; is_admin?: boolean }).email = token.email as string
        ;(session.user as typeof session.user & { id?: string; email?: string; is_admin?: boolean }).is_admin = token.is_admin as boolean
        
        // Refresh name from database to ensure it's up to date
        try {
          const dbUser = db.prepare('SELECT name FROM users WHERE email = ?').get(token.email) as DBUser | undefined
          if (dbUser?.name) {
            session.user.name = dbUser.name
          }
        } catch (error) {
          // If database query fails, keep existing session name
          console.error('Error refreshing user name:', error)
        }
      }
      return session
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
