# Database Cleanup - Quick Instructions

I've created a cleanup script for you. Here are **3 easy ways** to run it:

## Method 1: Using the Script (Easiest for Local)

If you're running locally and have access to your database:

```bash
npm run db:cleanup
```

This will:
- ✅ Delete all users, players, challenges, matches, and ratings
- ✅ Keep only the leagues
- ✅ Show you a summary of what was deleted

## Method 2: Using Browser Console (Easiest for Production)

If your app is deployed on Vercel:

1. **Log in to your app as an admin user**
2. **Open your browser's Developer Console** (F12 or Right-click → Inspect → Console)
3. **Paste this code and press Enter:**

```javascript
fetch('/api/admin/db/cleanup', {
  method: 'POST',
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  console.log('✅ Cleanup complete!', data);
  alert('Database cleanup completed! Check console for details.');
})
.catch(error => {
  console.error('❌ Error:', error);
  alert('Error: ' + error.message);
});
```

This will perform the cleanup through the API endpoint.

## Method 3: Using the API Endpoint Directly

You can also call the API endpoint using any HTTP client:

**Using cURL:**
```bash
curl -X POST https://your-app.vercel.app/api/admin/db/cleanup \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Using Postman or similar:**
- URL: `https://your-app.vercel.app/api/admin/db/cleanup`
- Method: `POST`
- Include your session cookie in headers

## Preview Before Deleting

To see what will be deleted first (without actually deleting):

**Browser Console:**
```javascript
fetch('/api/admin/db/cleanup', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log('Preview:', data));
```

## After Cleanup

1. **Recreate your admin account:**
   - Register a new account
   - Manually set `isAdmin = true` in the database (via Prisma Studio or SQL)

2. **Test your features:**
   - Register new users
   - Join leagues
   - Create challenges
   - Report matches
   - Verify report score buttons disappear after reporting

## Important Notes

- ⚠️ **This cannot be undone** - all user data will be permanently deleted
- ⚠️ **You'll need to recreate your admin account** after cleanup
- ⚠️ **Only leagues are preserved** - everything else is deleted
- ✅ **Safe to run** - it only deletes data, not the database structure

## Troubleshooting

**"Unauthorized" error:**
- Make sure you're logged in
- Check that your session is valid

**"Forbidden - Admin access required" error:**
- Your account must have `isAdmin = true`
- Check your user record in the database

**Script won't run:**
- Make sure you have `DATABASE_URL` or `PRISMA_DATABASE_URL` set in your `.env.local`
- Make sure you're in the project root directory
- Try: `npx ts-node scripts/cleanup-database.ts` directly
