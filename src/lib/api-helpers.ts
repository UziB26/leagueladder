import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"
import { db } from "./db"
import { rateLimit, apiRateLimit, strictRateLimit, loginRateLimit } from "./rate-limit"
import { validateRequest, requestSchemas } from "./validation"
import { sanitizeRequestBody } from "./sanitize"

/**
 * Helper function to create a protected API route handler with validation and rate limiting
 */
export interface ProtectedRouteOptions {
  rateLimiter?: (request: NextRequest) => Promise<NextResponse | null>
  validationSchema?: any
  requireAuth?: boolean
  requireAdmin?: boolean
  sanitize?: boolean
}

/**
 * Create a protected API route handler
 */
export function createProtectedHandler(
  handler: (request: NextRequest & { validatedData?: any }, context?: any) => Promise<NextResponse>,
  options: ProtectedRouteOptions = {}
) {
  const {
    rateLimiter = apiRateLimit,
    validationSchema,
    requireAuth = true,
    requireAdmin = false,
    sanitize = true,
  } = options

  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Apply rate limiting
      if (rateLimiter) {
        const rateLimitResponse = await rateLimiter(request)
        if (rateLimitResponse) {
          return rateLimitResponse
        }
      }

      // Validate request if schema provided
      let validatedData: any = {}
      if (validationSchema) {
        const validator = validateRequest({
          schema: validationSchema,
          errorMessage: "Invalid request data",
        })
        const { data, error } = await validator(request)
        if (error) {
          return error
        }
        validatedData = data || {}
      }

      // Sanitize if enabled
      if (sanitize && validatedData) {
        validatedData = sanitizeRequestBody(validatedData)
      }

      // Check authentication
      let session: any = null
      if (requireAuth) {
        session = await auth()
        if (!session?.user) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          )
        }

        // Check email verification requirement (unless this is the send-verification or verify-email route)
        const user = session.user as { email_verified?: boolean; email?: string; is_admin?: boolean }
        const isVerificationRoute = request.nextUrl.pathname.includes('/auth/send-verification') || 
                                    request.nextUrl.pathname.includes('/auth/verify-email')
        
        if (!isVerificationRoute && user.email) {
          try {
            const dbUser = await db.user.findUnique({
              where: { email: user.email },
              select: { emailVerified: true }
            })
            
            // Require email verification for all authenticated routes (except verification routes)
            if (!dbUser?.emailVerified) {
              return NextResponse.json(
                { 
                  error: "Email verification required",
                  requiresVerification: true,
                  message: "Please verify your email address before using this feature."
                },
                { status: 403 }
              )
            }
          } catch (error) {
            // If database check fails, allow access (fallback - don't block users if DB is down)
            console.error('Error checking email verification status:', error)
          }
        }

        // Check admin requirement
        if (requireAdmin) {
          // Verify admin status from database for extra security
          // This ensures admin status changes are immediately enforced
          if (!user.is_admin) {
            return NextResponse.json(
              { error: "Forbidden - Admin access required" },
              { status: 403 }
            )
          }
          // Double-check against database (session should already be refreshed by JWT callback)
          // This is a safety check in case session hasn't refreshed yet
          if (user.email) {
            try {
              const dbUser = await db.user.findUnique({
                where: { email: user.email },
                select: { isAdmin: true }
              })
              if (!dbUser?.isAdmin) {
                return NextResponse.json(
                  { error: "Forbidden - Admin access required" },
                  { status: 403 }
                )
              }
            } catch (error) {
              // If database check fails, trust session (fallback)
              console.error('Error verifying admin status from database:', error)
            }
          }
        }
      }

      // Attach validated data and session to request
      const enhancedRequest = {
        ...request,
        validatedData,
        session,
      } as NextRequest & { validatedData?: any; session?: any }

      // Call the handler
      return await handler(enhancedRequest, context)
    } catch (error: any) {
      console.error("API route error:", error)
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      )
    }
  }
}

/**
 * Pre-configured handlers for common use cases
 */
export const apiHandlers = {
  /**
   * Public API handler (no auth required)
   */
  public: (
    handler: (request: NextRequest & { validatedData?: any }, context?: any) => Promise<NextResponse>,
    options?: { validationSchema?: any; rateLimiter?: (request: NextRequest) => Promise<NextResponse | null> }
  ) =>
    createProtectedHandler(handler, {
      requireAuth: false,
      validationSchema: options?.validationSchema,
      rateLimiter: options?.rateLimiter,
    }),

  /**
   * Authenticated API handler
   */
  authenticated: (
    handler: (request: NextRequest & { validatedData?: any }, context?: any) => Promise<NextResponse>,
    options?: { validationSchema?: any; rateLimiter?: (request: NextRequest) => Promise<NextResponse | null> }
  ) =>
    createProtectedHandler(handler, {
      requireAuth: true,
      validationSchema: options?.validationSchema,
      rateLimiter: options?.rateLimiter || apiRateLimit,
    }),

  /**
   * Admin-only API handler
   */
  admin: (
    handler: (request: NextRequest & { validatedData?: any }, context?: any) => Promise<NextResponse>,
    options?: { validationSchema?: any; rateLimiter?: (request: NextRequest) => Promise<NextResponse | null> }
  ) =>
    createProtectedHandler(handler, {
      requireAuth: true,
      requireAdmin: true,
      validationSchema: options?.validationSchema,
      rateLimiter: options?.rateLimiter || strictRateLimit,
    }),

  /**
   * Strictly rate-limited handler (for sensitive operations)
   */
  strict: (
    handler: (request: NextRequest & { validatedData?: any }, context?: any) => Promise<NextResponse>,
    options?: { validationSchema?: any; requireAuth?: boolean }
  ) =>
    createProtectedHandler(handler, {
      requireAuth: options?.requireAuth ?? true,
      validationSchema: options?.validationSchema,
      rateLimiter: strictRateLimit,
    }),
}
