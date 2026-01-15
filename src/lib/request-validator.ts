import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateRequest } from "./validation"
import { sanitizeRequestBody } from "./sanitize"

/**
 * Enhanced request validator with automatic sanitization
 */
export interface RequestValidatorOptions {
  schema: z.ZodSchema
  errorMessage?: string
  sanitize?: boolean
}

/**
 * Validate and optionally sanitize request data
 */
export async function validateAndSanitizeRequest(
  request: NextRequest,
  options: RequestValidatorOptions
): Promise<{ data?: any; error?: NextResponse }> {
  const { schema, errorMessage = "Invalid request data", sanitize = true } = options

  // Validate request
  const validator = validateRequest({
    schema,
    errorMessage,
  })

  const { data, error } = await validator(request)
  
  if (error) {
    return { error }
  }

  // Sanitize if enabled
  if (sanitize && data) {
    const sanitizedData = sanitizeRequestBody(data)
    return { data: sanitizedData }
  }

  return { data }
}

/**
 * Create a validation middleware function
 */
export function createValidationMiddleware(options: RequestValidatorOptions) {
  return async (request: NextRequest): Promise<{ data?: any; error?: NextResponse }> => {
    return validateAndSanitizeRequest(request, options)
  }
}
