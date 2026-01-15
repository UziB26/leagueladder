import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateRequest, requestSchemas } from "./validation"
import { sanitizeObject } from "./sanitize"

/**
 * Middleware for API routes that combines rate limiting, validation, and sanitization
 */
export interface MiddlewareOptions {
  rateLimit?: (request: NextRequest) => Promise<NextResponse | null>
  validation?: {
    schema: z.ZodSchema
    errorMessage?: string
  }
  sanitize?: boolean
  requireAuth?: boolean
  requireAdmin?: boolean
}

/**
 * Create a middleware wrapper for API route handlers
 */
export function withMiddleware(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Apply rate limiting if provided
    if (options.rateLimit) {
      const rateLimitResponse = await options.rateLimit(request)
      if (rateLimitResponse) {
        return rateLimitResponse
      }
    }

    // Apply validation if schema provided
    let validatedData: any = {}
    if (options.validation) {
      const validator = validateRequest({
        schema: options.validation.schema,
        errorMessage: options.validation.errorMessage || "Invalid request data",
      })
      const { data, error } = await validator(request)
      if (error) {
        return error
      }
      validatedData = data || {}
    }

    // Apply sanitization if enabled
    if (options.sanitize) {
      // Sanitize validated data
      validatedData = sanitizeObject(validatedData)
      
      // Also sanitize query params
      const url = new URL(request.url)
      url.searchParams.forEach((value, key) => {
        if (typeof value === 'string') {
          url.searchParams.set(key, sanitizeObject({ value }).value)
        }
      })
    }

    // Attach validated and sanitized data to request
    const enhancedRequest = {
      ...request,
      validatedData,
    } as NextRequest & { validatedData?: any }

    // Call the original handler
    return handler(enhancedRequest, context)
  }
}

/**
 * Pre-configured middleware for common use cases
 */
export const middleware = {
  /**
   * Middleware for authenticated routes
   */
  authenticated: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withMiddleware(handler, {
      requireAuth: true,
      sanitize: true,
    }),

  /**
   * Middleware for admin-only routes
   */
  admin: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withMiddleware(handler, {
      requireAuth: true,
      requireAdmin: true,
      sanitize: true,
    }),

  /**
   * Middleware for public API routes with rate limiting
   */
  public: (
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
    rateLimit?: (request: NextRequest) => Promise<NextResponse | null>
  ) =>
    withMiddleware(handler, {
      rateLimit,
      sanitize: true,
    }),

  /**
   * Middleware for validated routes
   */
  validated: (
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
    schema: z.ZodSchema,
    options?: { rateLimit?: (request: NextRequest) => Promise<NextResponse | null> }
  ) =>
    withMiddleware(handler, {
      validation: { schema },
      rateLimit: options?.rateLimit,
      sanitize: true,
    }),
}
