import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from "crypto"

import { db } from "@/lib/db"

type DBUser = {
  id: string
  email: string
  name?: string
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }

        // Check if user exists
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as DBUser | undefined
        
        if (!user) {
          // Create new user
          const userId = crypto.randomUUID()
          
          db.prepare(`
            INSERT INTO users (id, email, name, created_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `).run(userId, email, email.split('@')[0])
          
          // Store password (in real app, use separate table)
          db.prepare(`
            INSERT INTO accounts (id, userId, type, provider, providerAccountId) 
            VALUES (?, ?, 'credentials', 'credentials', ?)
          `).run(crypto.randomUUID(), userId, userId)
          
          return {
            id: userId,
            email,
            name: email.split('@')[0]
          }
        }
        
        // In real app, verify password here
        return {
          id: user.id!,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as DBUser).id
        token.email = (user as DBUser).email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as typeof session.user & { id?: string; email?: string }).id = token.id as string
        ;(session.user as typeof session.user & { id?: string; email?: string }).email = token.email as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
