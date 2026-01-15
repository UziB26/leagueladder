import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export interface ValidationOptions {
  schema: z.ZodSchema
  errorMessage?: string
}

export function validateRequest(options: ValidationOptions) {
  const { schema, errorMessage = "Invalid request data" } = options

  return async (request: NextRequest): Promise<{ data?: any; error?: NextResponse }> => {
    try {
      let body: any = {}

      // Try to parse JSON body if it exists
      const contentType = request.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        try {
          body = await request.json()
        } catch (e) {
          return {
            error: NextResponse.json(
              { error: "Invalid JSON in request body" },
              { status: 400 }
            ),
          }
        }
      }

      // Parse query parameters
      const url = new URL(request.url)
      const queryParams: Record<string, string> = {}
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value
      })

      // Merge body and query params
      const data = { ...queryParams, ...body }

      // Validate with Zod schema
      const validatedData = schema.parse(data)

      return { data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          error: NextResponse.json(
            {
              error: errorMessage,
              details: error.errors.map((e) => ({
                path: e.path.join("."),
                message: e.message,
              })),
            },
            { status: 400 }
          ),
        }
      }

      return {
        error: NextResponse.json(
          { error: "Validation failed" },
          { status: 400 }
        ),
      }
    }
  }
}

// Common validation schemas
export const schemas = {
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  uuid: z.string().uuid("Invalid UUID format"),
  leagueId: z.string().min(1, "League ID is required"),
  playerId: z.string().uuid("Invalid player ID"),
  challengeId: z.string().uuid("Invalid challenge ID"),
  matchId: z.string().uuid("Invalid match ID"),
  score: z.number().int().min(0).max(1000, "Score must be reasonable"),
  positiveInt: z.number().int().positive(),
  nonNegativeInt: z.number().int().nonnegative(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().nonnegative().optional().default(0),
}

// Auth validation schemas
export const authSchemas = {
  login: z.object({
    email: schemas.email,
    password: z.string().min(1, "Password is required"),
  }),
  register: z.object({
    email: schemas.email,
    password: schemas.password,
    name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  }),
  session: z.object({
    sessionToken: z.string().min(1, "Session token is required").optional(),
  }),
}

// Common request schemas
export const requestSchemas = {
  ...authSchemas,
  joinLeague: z.object({
    leagueId: schemas.leagueId,
  }),
  createChallenge: z.object({
    challengeeId: schemas.playerId,
    leagueId: schemas.leagueId,
  }),
  reportMatch: z.object({
    player1Id: schemas.playerId,
    player2Id: schemas.playerId,
    leagueId: schemas.leagueId,
    player1Score: schemas.nonNegativeInt,
    player2Score: schemas.nonNegativeInt,
    status: z.enum(["pending", "pending_confirmation", "completed", "voided", "disputed"]).optional(),
  }),
  reportMatchFromChallenge: z.object({
    player1Score: schemas.nonNegativeInt,
    player2Score: schemas.nonNegativeInt,
    status: z.enum(["pending", "completed", "voided"]).optional(),
  }),
  pagination: z.object({
    limit: schemas.limit,
    offset: schemas.offset,
  }),
}
