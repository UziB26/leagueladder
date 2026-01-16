import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { authRateLimit, loginRateLimit, registerRateLimit, sessionRateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { sanitizeRequestBody } from "@/lib/sanitize"
import { validateRequest, authSchemas } from "@/lib/validation"

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
      // If it's a credentials sign-in, determine if it's login or registration
      if (body?.email && body?.password) {
        // Use stricter rate limit for login attempts
        return await loginRateLimit(request)
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
 * Validate and sanitize request body before passing to NextAuth
 */
async function validateAndSanitizeAuthRequest(request: NextRequest): Promise<{ request: Request; error?: NextResponse }> {
  if (request.method === "POST") {
    try {
      // Check content type
      const contentType = request.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        // Not JSON, return original request
        return {
          request: new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body,
          }),
        }
      }

      // Parse body once
      let body: any = {}
      try {
        body = await request.clone().json()
      } catch {
        // If parsing fails, return error
        return {
          request: request as any,
          error: NextResponse.json(
            { error: "Invalid JSON in request body" },
            { status: 400 }
          ),
        }
      }
      
      // Determine if it's a login or registration attempt
      if (body?.email && body?.password) {
        // Check if it looks like registration (has name field) or login
        const isRegistration = body.name !== undefined
        
        // Validate with appropriate schema
        const schema = isRegistration ? authSchemas.register : authSchemas.login
        try {
          const validatedData = schema.parse(body)
          
          // Sanitize validated data
          const sanitizedBody = sanitizeRequestBody(validatedData)
          
          // Create new request with sanitized body
          return {
            request: new Request(request.url, {
              method: request.method,
              headers: request.headers,
              body: JSON.stringify(sanitizedBody),
            }),
          }
        } catch (error: any) {
          // Zod validation error
          if (error.errors) {
            return {
              request: request as any,
              error: NextResponse.json(
                {
                  error: isRegistration ? "Invalid registration data" : "Invalid login credentials",
                  details: error.errors.map((e: any) => ({
                    path: e.path.join("."),
                    message: e.message,
                  })),
                },
                { status: 400 }
              ),
            }
          }
          // Other validation error
          return {
            request: request as any,
            error: NextResponse.json(
              { error: isRegistration ? "Invalid registration data" : "Invalid login credentials" },
              { status: 400 }
            ),
          }
        }
      }
      
      // For other POST requests, just sanitize
      const sanitizedBody = sanitizeRequestBody(body)
      return {
        request: new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(sanitizedBody),
        }),
      }
    } catch (error) {
      // If parsing fails, return original request
      console.error("Error validating auth request:", error)
    }
  }
  
  return {
    request: new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    }),
  }
}

// Rate-limited GET handler with sanitization
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await getRateLimiter(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Sanitize request (GET requests typically don't have bodies, but we sanitize headers/query params)
  const { request: sanitizedRequest } = await validateAndSanitizeAuthRequest(request)

  // Call the original handler - NextAuth handler is a function that accepts Request
  return (handler as any)(sanitizedRequest, {} as any)
}

// Rate-limited POST handler with validation and sanitization
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await getRateLimiter(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Validate and sanitize request
  const { request: validatedRequest, error } = await validateAndSanitizeAuthRequest(request)
  if (error) {
    return error
  }

  // Call the original handler - NextAuth handler is a function that accepts Request
  return (handler as any)(validatedRequest, {} as any)
}
