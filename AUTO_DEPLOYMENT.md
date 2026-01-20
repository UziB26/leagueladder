# Automatic Deployment - How It Works

## ✅ Yes! Just Commit and Push

If your Vercel project is connected to GitHub (which it should be), **pushing to GitHub automatically triggers a new deployment**.

## How It Works

### Automatic Deployment Flow:

```
1. You commit changes locally
   git add .
   git commit -m "Add PostgreSQL support"
   ↓
2. You push to GitHub
   git push origin main
   ↓
3. Vercel detects the push (via webhook)
   ↓
4. Vercel automatically starts building
   ↓
5. Vercel automatically deploys
   ↓
6. Your app is live with new changes!
```

**No manual steps needed!** 🎉

## Verify Auto-Deployment is Enabled

To check if auto-deployment is enabled:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project

2. **Check Settings → Git**
   - Click **Settings** tab
   - Click **Git** in the sidebar
   - You should see your GitHub repository connected
   - Under "Production Branch", it should show your main branch (usually `main` or `master`)

3. **Check Deployment Settings**
   - In Settings → Git
   - Look for "Automatic deployments"
   - Should be enabled by default

## What Happens When You Push

### Step-by-Step:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add PostgreSQL support and update routes"
   git push origin main
   ```

2. **Vercel automatically:**
   - Detects the push (usually within seconds)
   - Starts a new build
   - Runs `npm run build` (which includes `prisma generate` if using Prisma)
   - Deploys to a preview URL first (optional)
   - Deploys to production URL

3. **You can watch the deployment:**
   - Go to Vercel Dashboard → Your Project
   - Click **Deployments** tab
   - You'll see a new deployment in progress
   - Wait for it to complete (usually 2-5 minutes)

4. **Once deployed:**
   - Your production URL is automatically updated
   - All your new code is live
   - You can then initialize the database schema

## Deployment Status

You can check deployment status in several ways:

### In Vercel Dashboard:
- Go to your project
- Click **Deployments** tab
- See all deployments with status (Building, Ready, Error)

### Via Email/Notifications:
- Vercel sends email notifications when:
  - Deployment starts
  - Deployment succeeds
  - Deployment fails

### Via GitHub:
- If you have GitHub Actions or Vercel app installed, you'll see deployment status in:
  - GitHub repository → Actions tab
  - Pull request comments (if deploying previews)

## Manual Deployment (If Needed)

If auto-deployment isn't working, you can deploy manually:

### Option 1: Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Click **Deployments** tab
3. Click the **"..."** menu on the latest deployment
4. Click **Redeploy**

### Option 2: Vercel CLI
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

## After Deployment

Once your code is deployed:

1. **Wait for deployment to complete**
   - Check Vercel Dashboard → Deployments
   - Status should be "Ready" (green checkmark)

2. **Initialize database schema**
   - Visit: `https://YOUR-APP-URL.vercel.app/api/db/init`
   - Or use Vercel Dashboard → Storage → Query

3. **Test your app**
   - Try registering a user
   - Try joining a league
   - Verify everything works

## Troubleshooting

### Auto-deployment not working?

**Check:**
1. Is Vercel connected to your GitHub repo?
   - Settings → Git → Should show your repo

2. Are you pushing to the correct branch?
   - Usually `main` or `master`
   - Check Settings → Git → Production Branch

3. Is the webhook active?
   - GitHub → Your Repo → Settings → Webhooks
   - Should see Vercel webhook

4. Check deployment logs:
   - Vercel Dashboard → Deployments → Click on failed deployment
   - Check build logs for errors

### Build fails?

**Common issues:**
- Missing environment variables
- Build errors in code
- Missing dependencies

**Solution:**
- Check build logs in Vercel Dashboard
- Fix errors locally
- Push again (auto-deploys)

## Summary

✅ **Just commit and push to GitHub**  
✅ **Vercel automatically deploys**  
✅ **No manual steps needed**  
✅ **Watch progress in Vercel Dashboard**

**Workflow:**
```bash
git add .
git commit -m "Your commit message"
git push origin main
# Wait 2-5 minutes
# Visit your Vercel URL
# Initialize schema
# Done! ✅
```

That's it! Vercel handles everything automatically. 🚀
