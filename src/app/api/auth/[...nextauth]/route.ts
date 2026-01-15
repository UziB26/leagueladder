import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { authRateLimit, loginRateLimit, registerRateLimit, sessionRateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { sanitizeRequestBody } from "@/lib/sanitize"

const handler = NextAuth(authOptions)

/**
 * Determine which rate limiter to use based on the request
 */
async function getRateLimiter(request: NextRequest): Promise<NextResponse | null> {
  const url = new URL(request.url)
  const action = url.searchParams.get("action") || url.searchParams.get("callbackUrl")
  
  // Check if it's a login attempt
  if (request.method === "POST") {
    try {
      const body = await request.clone().json().catch(() => ({}))
      // If it's a credentials sign-in, use login rate limit
      if (body?.email && body?.password) {
        // Check if user exists (registration vs login)
        // For now, use authRateLimit for all, but we could enhance this
        return await authRateLimit(request)
      }
    } catch {
      // If body parsing fails, use default
    }
  }
  
  // Session refresh requests
  if (action === "session" || url.pathname.includes("session")) {
    return await sessionRateLimit(request)
  }
  
  // Default to general auth rate limit
  return await authRateLimit(request)
}

/**
 * Sanitize request body before passing to NextAuth
 */
async function sanitizeAuthRequest(request: NextRequest): Promise<Request> {
  if (request.method === "POST") {
    try {
      const body = await request.clone().json().catch(() => ({}))
      const sanitizedBody = sanitizeRequestBody(body)
      
      // Create new request with sanitized body
      return new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(sanitizedBody),
      })
    } catch {
      // If parsing fails, return original
    }
  }
  
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
}

// Rate-limited GET handler
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await getRateLimiter(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Convert NextRequest to Request for NextAuth
  const req = await sanitizeAuthRequest(request)

  // Call the original handler - NextAuth handler is a function that accepts Request
  return (handler as any)(req, {} as any)
}

// Rate-limited POST handler
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await getRateLimiter(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Sanitize and convert NextRequest to Request for NextAuth
  const req = await sanitizeAuthRequest(request)

  // Call the original handler - NextAuth handler is a function that accepts Request
  return (handler as any)(req, {} as any)
}
