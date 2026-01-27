# Prisma Debug Logs Guide

## Overview

Debug logs have been added to Prisma files to help diagnose environment variable issues during instantiation. This guide explains how to use them.

## Where Logs Appear

### 1. **`src/lib/db/index.ts`** (Main Prisma Client)
   - Logs appear when the module is loaded
   - Logs appear when `createPrismaClient()` is called
   - Logs appear during PrismaClient instantiation

### 2. **`prisma/seed.ts`** (Seed Script)
   - Logs appear when running `npx prisma db seed`
   - Logs show environment variables before PrismaClient creation

## How to View the Logs

### Local Development

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Check the console output** - You'll see logs prefixed with `[Prisma Debug]`:
   ```
   [Prisma Debug] Module load - Environment check:
   [Prisma Debug]   NODE_ENV: development
   [Prisma Debug]   PRISMA_CLIENT_ENGINE_TYPE: binary
   ...
   ```

3. **When an API route is called**, you'll see additional logs:
   ```
   [Prisma Debug] createPrismaClient() called
   [Prisma Debug]   PRISMA_CLIENT_ENGINE_TYPE set to: binary
   ...
   ```

### During Build (Vercel/Amplify)

1. **Check build logs** in your deployment platform:
   - **Vercel**: Go to Deployment → Build Logs
   - **AWS Amplify**: Go to App → Build History → View Logs

2. **Search for `[Prisma Debug]`** in the logs to find Prisma-related output

3. **Look for these key indicators:**
   - `isBuildContext: true` - Confirms build-time detection
   - `DATABASE_URL` presence/absence
   - `accelerateUrl` value (should be `undefined` for binary engine)

### Seed Script

Run the seed script to see environment variables:
```bash
npx prisma db seed
```

You'll see output like:
```
[Seed Debug] Environment check:
[Seed Debug]   NODE_ENV: development
[Seed Debug]   DATABASE_URL present: true
...
```

## What to Look For

### ✅ Healthy Output

**During Build:**
```
[Prisma Debug]   isBuildContext: true
[Prisma Debug]   DATABASE_URL before check: undefined
[Prisma Debug]   Set DATABASE_URL to fallback: postgresql://dummy:dummy@...
[Prisma Debug]   No accelerateUrl added (using binary engine)
[Prisma Debug]   PrismaClient instantiated successfully
```

**At Runtime:**
```
[Prisma Debug]   isBuildContext: false
[Prisma Debug]   DATABASE_URL before check: postgresql://real-db-url...
[Prisma Debug]   No accelerateUrl added (using binary engine)
[Prisma Debug]   PrismaClient instantiated successfully
```

### ⚠️ Warning Signs

1. **Missing DATABASE_URL at runtime:**
   ```
   [Prisma Debug]   DATABASE_URL before check: undefined
   [Prisma Debug]   isBuildContext: false
   ```
   **Problem**: No database URL in production runtime
   **Fix**: Set `DATABASE_URL` environment variable in your deployment platform

2. **Wrong engine type:**
   ```
   [Prisma Debug]   PRISMA_CLIENT_ENGINE_TYPE: client
   ```
   **Problem**: Should be `binary`, not `client`
   **Fix**: Check that `schema.prisma` has `engineType = "binary"`

3. **Unexpected accelerateUrl:**
   ```
   [Prisma Debug]   accelerateUrl: prisma+postgres://...
   [Prisma Debug]   Added accelerateUrl to clientConfig
   ```
   **Problem**: Using Accelerate when you want binary engine
   **Fix**: Ensure `PRISMA_DATABASE_URL` doesn't start with `prisma+` (or remove it)

4. **Build-time errors:**
   ```
   [Prisma Debug] Module load - Environment check:
   Error: Failed to collect page data
   ```
   **Problem**: Prisma trying to connect during build
   **Fix**: Ensure `export const dynamic = 'force-dynamic'` is in API routes

## Interpreting Common Scenarios

### Scenario 1: Build Succeeds, Runtime Fails

**Build logs show:**
```
[Prisma Debug]   isBuildContext: true
[Prisma Debug]   Set DATABASE_URL to fallback: postgresql://dummy...
```

**Runtime logs show:**
```
[Prisma Debug]   isBuildContext: false
[Prisma Debug]   DATABASE_URL before check: undefined
```

**Diagnosis**: DATABASE_URL not set in production environment variables
**Solution**: Add `DATABASE_URL` to Vercel/Amplify environment variables

### Scenario 2: "requires adapter or accelerateUrl" Error

**Logs show:**
```
[Prisma Debug]   PRISMA_CLIENT_ENGINE_TYPE: client
[Prisma Debug]   accelerateUrl: undefined
```

**Diagnosis**: Prisma detected "client" engine type but no accelerateUrl provided
**Solution**: Ensure `PRISMA_CLIENT_ENGINE_TYPE=binary` is set before Prisma imports

### Scenario 3: Module Loads Multiple Times

**Logs show:**
```
[Prisma Debug] Module load - Environment check: (appears multiple times)
[Prisma Debug] createPrismaClient() called (appears multiple times)
```

**Diagnosis**: Module is being re-evaluated (normal in development with hot reload)
**Solution**: This is expected in development, but check if it happens in production builds

## Filtering Logs

### In Terminal (Local)
```bash
npm run dev | grep "\[Prisma Debug\]"
```

### In Build Logs
Search for: `[Prisma Debug]` or `Prisma Debug`

## Disabling Debug Logs

Once you've resolved issues, you can remove or comment out the debug logs:

1. Search for `console.log('[Prisma Debug]` in `src/lib/db/index.ts`
2. Comment out or remove those lines
3. Do the same for `prisma/seed.ts`

**Note**: Keep the logs during troubleshooting, then remove them for cleaner production logs.

## Quick Reference

| Log Prefix | Meaning | When It Appears |
|------------|---------|-----------------|
| `[Prisma Debug] Module load` | Module is being imported | Every time the module loads |
| `[Prisma Debug] createPrismaClient()` | Function is being called | When PrismaClient needs to be created |
| `[Prisma Debug] Instantiating PrismaClient` | About to create client | Right before `new PrismaClient()` |
| `[Prisma Debug] PrismaClient instantiated` | Success | After successful creation |
| `[Seed Debug]` | Seed script logs | When running `npx prisma db seed` |

## Common Issues Checklist

- [ ] `PRISMA_CLIENT_ENGINE_TYPE` is `binary` (not `client`)
- [ ] `DATABASE_URL` is set in production environment
- [ ] `accelerateUrl` is `undefined` (unless using Accelerate)
- [ ] `isBuildContext` is `true` during build, `false` at runtime
- [ ] No errors after "Instantiating PrismaClient"
- [ ] `clientConfig` doesn't have unexpected properties

## Next Steps

1. **Run your app locally** and check console output
2. **Deploy to staging** and check build logs
3. **Compare** build-time vs runtime logs
4. **Identify** any mismatches or missing variables
5. **Fix** environment variable configuration
6. **Remove debug logs** once issues are resolved
