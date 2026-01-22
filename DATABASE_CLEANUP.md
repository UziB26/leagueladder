# Database Cleanup Guide

This guide explains how to reset the database to a clean state while preserving leagues.

## What Gets Deleted

The cleanup will delete:
- ✅ All users (including admin users - you'll need to recreate your admin account)
- ✅ All players
- ✅ All challenges
- ✅ All matches
- ✅ All match confirmations
- ✅ All player ratings (leaderboards will be empty)
- ✅ All league memberships
- ✅ All rating updates
- ✅ All sessions
- ✅ All accounts
- ✅ All admin actions

## What Gets Preserved

- ✅ **Leagues** - The league structure (Table Tennis and FIFA leagues) will remain

## How to Use

### Option 1: Using cURL (Command Line)

**1. Preview what will be deleted (dry run):**
```bash
curl -X GET https://your-app.vercel.app/api/admin/db/cleanup \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**2. Actually perform the cleanup:**
```bash
curl -X POST https://your-app.vercel.app/api/admin/db/cleanup \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Option 2: Using Browser/Postman

**1. Preview (GET request):**
- URL: `https://your-app.vercel.app/api/admin/db/cleanup`
- Method: `GET`
- Make sure you're logged in as an admin user

**2. Cleanup (POST request):**
- URL: `https://your-app.vercel.app/api/admin/db/cleanup`
- Method: `POST`
- Make sure you're logged in as an admin user

### Option 3: Using Admin Panel (Future)

You can add a button to the admin panel that calls this endpoint.

## Requirements

- ✅ Must be logged in as an **admin user**
- ✅ Must have valid session cookie
- ✅ Rate limiting applies (to prevent abuse)

## Response Format

### GET (Preview) Response:
```json
{
  "dry_run": true,
  "message": "This is a preview. Use POST to actually delete the data.",
  "summary": {
    "total_records_to_delete": 150,
    "leagues_to_preserve": 2
  },
  "counts": {
    "users": 10,
    "players": 8,
    "challenges": 5,
    "matches": 20,
    ...
  },
  "leagues_to_preserve": [
    {
      "id": "tt_league",
      "name": "Table Tennis",
      "game_type": "table-tennis"
    },
    {
      "id": "fifa_league",
      "name": "Fifa",
      "game_type": "fifa"
    }
  ]
}
```

### POST (Cleanup) Response:
```json
{
  "success": true,
  "message": "Database cleanup completed successfully",
  "summary": {
    "total_records_deleted": 150,
    "leagues_preserved": 2
  },
  "results": {
    "users": { "deleted": 10, "status": "success" },
    "players": { "deleted": 8, "status": "success" },
    "challenges": { "deleted": 5, "status": "success" },
    ...
  },
  "leagues_preserved": [
    {
      "id": "tt_league",
      "name": "Table Tennis",
      "game_type": "table-tennis"
    },
    {
      "id": "fifa_league",
      "name": "Fifa",
      "game_type": "fifa"
    }
  ]
}
```

## After Cleanup

1. **Recreate your admin account:**
   - Register a new account
   - Manually set `isAdmin = true` in the database, OR
   - Use the admin panel to promote your account to admin

2. **Test the app:**
   - Register new users
   - Join leagues
   - Create challenges
   - Report matches
   - Verify that report score buttons disappear after reporting

## Security Notes

- ⚠️ This endpoint is **admin-only** - only users with `isAdmin = true` can access it
- ⚠️ Rate limiting is applied to prevent abuse
- ⚠️ This operation **cannot be undone** - make sure you want to delete everything!
- ⚠️ Consider backing up your database before running cleanup

## Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- Check that your session cookie is valid

### "Forbidden - Admin access required" Error
- Your account must have `isAdmin = true` in the database
- Check your user record in the database

### "Rate limit exceeded" Error
- Wait a few minutes and try again
- This is a safety feature to prevent accidental multiple deletions
