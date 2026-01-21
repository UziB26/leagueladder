import { handlers } from "@/lib/auth"

export const runtime = 'nodejs' // Required for Prisma on Vercel

// Verify AUTH_SECRET is configured
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.error('')
  console.error('❌ CRITICAL ERROR: AUTH_SECRET is not configured!')
  console.error('')
  console.error('📝 TO FIX:')
  console.error('   1. Create a file: leagueladder/.env.local')
  console.error('   2. Add this line: AUTH_SECRET=d/I8oYQAwR+KOMizPCteb+UWFx1sdlB2uKSMP8t4Vcw=')
  console.error('   3. RESTART your dev server (stop and run npm run dev again)')
  console.error('')
}

export const { GET, POST } = handlers
