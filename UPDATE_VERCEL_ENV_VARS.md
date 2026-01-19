# How to Update Environment Variables in Vercel

This guide shows you how to update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL.

## Step 1: Find Your Vercel URL

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project (e.g., "league-ladder")
3. Look at the top of the page - you'll see your deployment URL
4. It will look like one of these:
   - `https://league-ladder-abc123.vercel.app`
   - `https://your-project-name.vercel.app`
   - `https://your-custom-domain.com` (if you set one up)
5. **Copy this URL** - you'll need it in the next step

## Step 2: Update Environment Variables

### Method 1: Via Vercel Dashboard (Recommended)

1. **Navigate to Environment Variables**
   - In your project, click on **Settings** (in the top navigation)
   - Click on **Environment Variables** (in the left sidebar)

2. **Update NEXTAUTH_URL**
   - Find `NEXTAUTH_URL` in the list
   - Click the **pencil/edit icon** (or click on the variable name)
   - Replace the placeholder value with your actual Vercel URL
   - Example: Change `https://your-app-name.vercel.app` to `https://league-ladder-abc123.vercel.app`
   - Make sure all environments are checked:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

3. **Update NEXT_PUBLIC_APP_URL**
   - Find `NEXT_PUBLIC_APP_URL` in the list (or click **Add New** if it doesn't exist)
   - Set the value to the same URL as `NEXTAUTH_URL`
   - Example: `https://league-ladder-abc123.vercel.app`
   - Select all environments (Production, Preview, Development)
   - Click **Save**

### Method 2: Via Vercel CLI

If you prefer using the command line:

```bash
# Update NEXTAUTH_URL
vercel env add NEXTAUTH_URL production
# When prompted, enter: https://your-actual-url.vercel.app

# Update NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_APP_URL production
# When prompted, enter: https://your-actual-url.vercel.app
```

## Step 3: Redeploy Your Application

**Important:** Environment variable changes require a redeploy to take effect!

### Option A: Redeploy via Dashboard
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **three dots (⋯)** menu
4. Click **Redeploy**
5. Confirm the redeploy

### Option B: Trigger via Git Push
Simply push any commit to your connected branch:
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

### Option C: Redeploy via CLI
```bash
vercel --prod
```

## Step 4: Verify the Changes

1. Wait for the deployment to complete (usually 1-2 minutes)
2. Visit your Vercel URL
3. Try logging in or registering
4. If authentication works, your environment variables are set correctly!

## Troubleshooting

### "Invalid redirect URL" Error
- **Problem**: NextAuth is complaining about redirect URLs
- **Solution**: Make sure `NEXTAUTH_URL` exactly matches your deployment URL (including `https://`)
- **Check**: No trailing slashes, correct protocol (https not http)

### Changes Not Taking Effect
- **Problem**: Updated variables but app still uses old values
- **Solution**: You must redeploy after changing environment variables
- **Check**: Go to Deployments tab and verify a new deployment was created after your changes

### Can't Find Environment Variables
- **Problem**: Don't see the variables in the list
- **Solution**: Click **Add New** and create them:
  - Name: `NEXTAUTH_URL`, Value: `https://your-url.vercel.app`
  - Name: `NEXT_PUBLIC_APP_URL`, Value: `https://your-url.vercel.app`

### Multiple Environments
- **Tip**: Make sure to set the same values for Production, Preview, and Development
- **Why**: This ensures your app works in all environments

## Quick Reference

| Variable | Value Example | Required |
|----------|---------------|----------|
| `NEXTAUTH_URL` | `https://league-ladder-abc123.vercel.app` | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | `https://league-ladder-abc123.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | `7fmTkYUq82AA0uXtvVJoBCLLN7Ge85JTMYgQV19p1/I=` | ✅ Yes |
| `DATABASE_PATH` | `/tmp/league-ladder.db` | ✅ Yes |

## Need Help?

- Check the [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- Review your deployment logs in Vercel Dashboard → Deployments → View Logs
- Make sure your URL doesn't have trailing slashes or extra characters
