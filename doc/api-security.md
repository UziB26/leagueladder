# API Security Documentation

This document describes the security measures implemented for API routes, including rate limiting, request validation, and input sanitization.

## Overview

All API routes in the League Ladder application implement multiple layers of security:

1. **Rate Limiting** - Prevents abuse and brute force attacks
2. **Request Validation** - Ensures data integrity and type safety
3. **Input Sanitization** - Prevents injection attacks and XSS

## Rate Limiting

### Pre-configured Rate Limiters

#### `authRateLimit`
- **Window**: 15 minutes
- **Max Requests**: 5
- **Use Case**: General authentication endpoints
- **Message**: "Too many authentication attempts. Please try again later."

#### `loginRateLimit`
- **Window**: 15 minutes
- **Max Requests**: 3
- **Use Case**: Login attempts specifically
- **Message**: "Too many login attempts. Please try again in 15 minutes."

#### `registerRateLimit`
- **Window**: 1 hour
- **Max Requests**: 3
- **Use Case**: Registration attempts
- **Message**: "Too many registration attempts. Please try again later."

#### `sessionRateLimit`
- **Window**: 1 minute
- **Max Requests**: 10
- **Use Case**: Session refresh/validation requests
- **Message**: "Too many session requests. Please slow down."

#### `apiRateLimit`
- **Window**: 1 minute
- **Max Requests**: 60
- **Use Case**: General API endpoints
- **Message**: "Too many API requests. Please slow down."

#### `strictRateLimit`
- **Window**: 1 minute
- **Max Requests**: 10
- **Use Case**: Sensitive operations (admin actions, etc.)
- **Message**: "Rate limit exceeded. Please try again later."

### Usage

```typescript
import { apiRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  // ... rest of handler
}
```

## Request Validation

Validation is performed using Zod schemas. The validation middleware automatically:
- Parses JSON request bodies
- Validates against the provided schema
- Returns detailed error messages for invalid data

### Common Validation Schemas

Located in `src/lib/validation.ts`:

- `schemas.email` - Email validation
- `schemas.password` - Password validation (min 8 chars, uppercase, lowercase, number)
- `schemas.uuid` - UUID format validation
- `schemas.score` - Score validation (0-1000)
- `schemas.positiveInt` - Positive integer
- `schemas.nonNegativeInt` - Non-negative integer

### Request Schemas

- `requestSchemas.login` - Login request validation
- `requestSchemas.register` - Registration request validation
- `requestSchemas.joinLeague` - League joining validation
- `requestSchemas.reportMatch` - Match reporting validation
- `requestSchemas.createChallenge` - Challenge creation validation

### Usage

```typescript
import { validateRequest, requestSchemas } from "@/lib/validation"

export async function POST(request: NextRequest) {
  const validator = validateRequest({
    schema: requestSchemas.joinLeague,
    errorMessage: "Invalid request data",
  })
  const { data, error } = await validator(request)
  if (error) {
    return error
  }
  // Use validated data
  const { leagueId } = data
}
```

## Input Sanitization

All user inputs are sanitized to prevent:
- SQL injection
- XSS attacks
- Command injection
- NoSQL injection

### Sanitization Functions

Located in `src/lib/sanitize.ts`:

- `sanitizeString()` - Removes control characters and null bytes
- `sanitizeEmail()` - Validates and sanitizes email addresses
- `sanitizeUUID()` - Validates UUID format
- `sanitizeInteger()` - Validates and sanitizes integers
- `sanitizeObject()` - Recursively sanitizes object properties
- `sanitizeHTML()` - HTML entity encoding
- `sanitizeURL()` - URL validation and sanitization

### Usage

```typescript
import { sanitizeUUID, sanitizeInteger, sanitizeRequestBody } from "@/lib/sanitize"

// Individual values
const playerId = sanitizeUUID(rawPlayerId)
const score = sanitizeInteger(rawScore, 0, 1000)

// Entire request body
const sanitizedBody = sanitizeRequestBody(requestBody)
```

## Combined Middleware

For convenience, use the `apiHandlers` helper to combine all security measures:

```typescript
import { apiHandlers } from "@/lib/api-helpers"
import { requestSchemas } from "@/lib/validation"

export const POST = apiHandlers.authenticated(
  async (request) => {
    const { validatedData } = request
    const { leagueId } = validatedData
    // ... handler logic
  },
  {
    validationSchema: requestSchemas.joinLeague,
  }
)
```

### Available Handlers

- `apiHandlers.public` - No authentication required
- `apiHandlers.authenticated` - Requires authentication
- `apiHandlers.admin` - Requires admin privileges
- `apiHandlers.strict` - Strict rate limiting

## Authentication Endpoints

The NextAuth endpoint (`/api/auth/[...nextauth]`) implements:

1. **Rate Limiting**: 
   - General auth: 5 requests per 15 minutes
   - Login attempts: 3 requests per 15 minutes
   - Session requests: 10 requests per minute

2. **Input Sanitization**:
   - Email addresses are validated and sanitized
   - Passwords are sanitized and validated (min 8 chars, max 128 chars)
   - All inputs are checked for malicious content

3. **Validation**:
   - Email format validation
   - Password strength validation
   - Request body validation

## Best Practices

1. **Always use rate limiting** for public-facing endpoints
2. **Validate all inputs** using Zod schemas
3. **Sanitize before processing** - sanitize all user inputs
4. **Use parameterized queries** - never concatenate SQL
5. **Log security events** - track failed authentication attempts
6. **Return generic errors** - don't reveal system details to attackers

## Security Headers

Rate limit responses include helpful headers:

- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Remaining requests in window
- `X-RateLimit-Reset` - Timestamp when limit resets
- `Retry-After` - Seconds to wait before retrying

## Example: Complete Protected Route

```typescript
import { NextRequest, NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { requestSchemas } from "@/lib/validation"
import { db } from "@/lib/db"

export const POST = apiHandlers.authenticated(
  async (request) => {
    const { validatedData } = request
    const { leagueId } = validatedData

    // Data is already validated and sanitized
    // Proceed with business logic
    const result = db.prepare("SELECT * FROM leagues WHERE id = ?").get(leagueId)

    return NextResponse.json({ success: true, league: result })
  },
  {
    validationSchema: requestSchemas.joinLeague,
  }
)
```

This handler automatically:
- ✅ Applies rate limiting
- ✅ Validates request data
- ✅ Sanitizes inputs
- ✅ Checks authentication
- ✅ Returns appropriate error responses
