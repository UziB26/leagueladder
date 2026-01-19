/**
 * Input sanitization utilities
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "")

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")

  // Trim whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== "string") {
    return ""
  }

  // Basic email sanitization
  let sanitized = email.toLowerCase().trim()

  // Remove any characters that shouldn't be in an email
  sanitized = sanitizeString(sanitized)

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    return ""
  }

  return sanitized
}

/**
 * Sanitize a number, ensuring it's within valid range
 */
export function sanitizeNumber(
  input: any,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number | null {
  if (input === null || input === undefined) {
    return null
  }

  const num = typeof input === "string" ? parseFloat(input) : Number(input)

  if (isNaN(num) || !isFinite(num)) {
    return null
  }

  if (num < min || num > max) {
    return null
  }

  return num
}

/**
 * Sanitize an integer
 */
export function sanitizeInteger(
  input: any,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number | null {
  const num = sanitizeNumber(input, min, max)
  if (num === null) {
    return null
  }

  return Math.floor(num)
}

/**
 * Sanitize UUID
 */
export function sanitizeUUID(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") {
    return null
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const sanitized = sanitizeString(input)

  if (!uuidRegex.test(sanitized)) {
    return null
  }

  return sanitized.toLowerCase()
}

/**
 * Sanitize an object by applying sanitization to all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") {
    return obj
  }

  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as any)[key] = sanitizeString(sanitized[key] as string)
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
      (sanitized as any)[key] = sanitizeObject(sanitized[key] as Record<string, any>)
    } else if (Array.isArray(sanitized[key])) {
      (sanitized as any)[key] = (sanitized[key] as any[]).map((item: any) =>
        typeof item === "string" ? sanitizeString(item) : typeof item === "object" && item !== null ? sanitizeObject(item) : item
      )
    }
  }

  return sanitized
}

/**
 * Sanitize request body by type
 */
export function sanitizeRequestBody(body: any): any {
  if (!body) {
    return body
  }

  if (typeof body === "string") {
    return sanitizeString(body)
  }

  if (typeof body === "object") {
    return sanitizeObject(body)
  }

  return body
}

/**
 * Sanitize SQL input to prevent injection (basic protection)
 * Note: Always use parameterized queries, this is just an extra layer
 */
export function sanitizeSQL(input: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  // Remove SQL comment patterns
  let sanitized = input.replace(/--/g, "")
  sanitized = sanitized.replace(/\/\*/g, "")
  sanitized = sanitized.replace(/\*\//g, "")

  // Remove semicolons (basic protection)
  sanitized = sanitizeString(sanitized)

  return sanitized
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  // Basic HTML entity encoding
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Sanitize URL
 */
export function sanitizeURL(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") {
    return null
  }

  try {
    const url = new URL(input)
    // Only allow http and https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null
    }
    return url.toString()
  } catch {
    return null
  }
}
