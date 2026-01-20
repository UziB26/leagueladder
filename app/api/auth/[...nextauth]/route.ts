import { handlers } from "@/lib/auth"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const { GET, POST } = handlers
