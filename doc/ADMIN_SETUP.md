# Admin Setup and Usage Guide

This document explains how admin controls work, how to grant admin access, and how to use admin features.

---

## 🔐 How to Become an Admin

### Initial Admin Setup

Since there's no self-service admin creation, the first admin must be set manually via the database.

#### Option 1: Using Prisma Studio (Recommended)

1. **Open Prisma Studio**:
   ```bash
   npm run prisma:studio
   ```

2. **Navigate to Users**:
   - Prisma Studio will open in your browser (usually `http://localhost:5555`)
   - Click on the `users` table

3. **Find Your User**:
   - Search for your user by email
   - Click on your user record

4. **Enable Admin Status**:
   - Find the `isAdmin` field
   - Change it from `false` to `true`
   - Click "Save 1 change"

5. **Verify**:
   - Log out and log back in
   - You should now see "Admin" in the navigation menu

#### Option 2: Using SQL (PostgreSQL)

1. **Connect to your database**:
   ```bash
   # Using psql
   psql -d your_database_name
   
   # Or using Vercel Postgres connection string
   psql "your-postgres-connection-string"
   ```

2. **Update user to admin**:
   ```sql
   UPDATE users 
   SET is_admin = true 
   WHERE email = 'your-email@example.com';
   ```

3. **Verify**:
   ```sql
   SELECT email, is_admin FROM users WHERE email = 'your-email@example.com';
   ```

4. **Log out and log back in** to refresh your session

#### Option 3: Using Vercel Postgres Query Interface

1. Go to **Vercel Dashboard** → **Storage** → Your Database
2. Click **Query** tab
3. Run:
   ```sql
   UPDATE users 
   SET is_admin = true 
   WHERE email = 'your-email@example.com';
   ```
4. Log out and log back in

---

## 👥 Granting Admin Access to Others

Once you have admin access, you can grant it to others through the Admin Dashboard:

1. **Log in as an admin**
2. **Navigate to Admin Dashboard**: Click "Admin" in the navigation menu
3. **Go to Users Tab**: Click on the "Users" tab
4. **Find the User**: Locate the user you want to make an admin
5. **Click "Make Admin"**: Click the "Make Admin" button next to their name
6. **Confirm**: The user's admin status will be updated immediately

**Note**: The user will need to log out and log back in for the change to take effect (session refresh).

---

## 🎛️ Admin Features Available

### 1. Overview Dashboard (`/admin`)

**System Statistics**:
- Total users, players, leagues, matches, challenges
- Match statistics (completed, pending, voided)
- Challenge statistics (pending, accepted, completed)
- Recent activity (last 7 days)
- Top players by rating

**Access**: Navigate to `/admin` (only visible to admins)

### 2. User Management (`/admin` → Users Tab)

**Features**:
- View all registered users
- See user email, name, admin status, creation date
- **Toggle Admin Status**: Grant or revoke admin access
- **Delete Users**: Permanently delete user accounts (cascades to player profiles)

**Actions Available**:
- **Make Admin** / **Revoke Admin**: Toggle admin status for any user
- **Delete**: Permanently remove user and all associated data

### 3. Player Management (`/admin` → Players Tab)

**Features**:
- View all player profiles
- See player statistics (leagues joined, matches played)
- **Adjust Ratings**: Manually adjust player ratings for any league
- **Adjust Stats**: Manually adjust wins, losses, draws, games played
- **Delete Players**: Remove player profiles

**Actions Available**:
- **Adjust Rating**: Set a specific rating value (with optional reason)
- **Adjust Stats**: Modify wins, losses, draws, games played (with optional reason)
- **Delete**: Remove player profile and all associated data

### 4. Match Management (`/admin` → Matches Tab)

**Features**:
- View all matches across all leagues
- See match details (players, scores, status, date)
- **Void Matches**: Revert completed matches and restore previous ratings
- **Un-void Matches**: Restore voided matches and recalculate ratings
- **Edit Match Scores**: Correct match scores (with optional reason)
- **Delete Matches**: Permanently remove match records

**Actions Available**:
- **Void Match**: 
  - Reverts player ratings to their pre-match values
  - Marks match as "voided"
  - Can be undone with "Un-void"
- **Un-void Match**: 
  - Restores match and recalculates ratings
  - Marks match as "completed"
- **Edit Score**: 
  - Update match scores
  - Ratings are recalculated based on new scores
  - Optional reason field for audit trail
- **Delete**: Permanently remove match from database

### 5. League Management (`/admin` → Leagues Tab)

**Features**:
- View all leagues
- See league statistics (member count, game type)
- View league creation dates

**Note**: Currently read-only. Future enhancements may include league creation/editing.

---

## 🔒 Security & Access Control

### Admin Access Protection

1. **Route Protection**: 
   - `/admin` page checks admin status from database
   - Non-admins are redirected to `/dashboard`

2. **API Protection**:
   - All admin API endpoints verify admin status
   - Double-check against database (not just session)
   - Uses `createProtectedHandler` with `requireAdmin: true`

3. **Session Refresh**:
   - Admin status changes require logout/login to take effect
   - Session includes `is_admin` flag from database

### Admin Action Logging

All admin actions are logged in the `admin_actions` table:
- User who performed the action
- Action type (void match, toggle admin, etc.)
- Target ID (match ID, user ID, etc.)
- Optional details/reason
- Timestamp

---

## 📋 Admin Workflow Examples

### Example 1: Voiding an Incorrect Match

1. Navigate to **Admin** → **Matches** tab
2. Find the incorrect match
3. Click **"Void"** button
4. Confirm the action
5. Match is voided:
   - Player ratings revert to pre-match values
   - Match status changes to "voided"
   - Action is logged in `admin_actions` table

### Example 2: Granting Admin Access

1. Navigate to **Admin** → **Users** tab
2. Find the user
3. Click **"Make Admin"** button
4. User's admin status is updated
5. User must log out and log back in to access admin features

### Example 3: Adjusting a Player's Rating

1. Navigate to **Admin** → **Players** tab
2. Find the player
3. Click **"Adjust Rating"** button
4. Enter new rating value (optional: add reason)
5. Click **"Adjust Rating"**
6. Player's rating is updated immediately
7. Action is logged

### Example 4: Correcting Match Scores

1. Navigate to **Admin** → **Matches** tab
2. Find the match with incorrect scores
3. Click **"Edit Score"** button
4. Enter corrected scores (optional: add reason)
5. Click **"Update Scores"**
6. Match scores are updated
7. Ratings are recalculated based on new scores
8. Action is logged

---

## ⚠️ Important Notes

### Admin Status Changes
- Admin status changes require **logout/login** to take effect
- Session stores admin status, so it needs to refresh
- Database check happens on every admin API call for security

### Voiding Matches
- **Voiding** a match reverts ratings but keeps the match record
- **Un-voiding** restores the match and recalculates ratings
- **Deleting** a match permanently removes it (cannot be undone)

### Rating Adjustments
- Manual rating adjustments bypass Elo calculations
- Use with caution - should have a valid reason
- All adjustments are logged in `admin_actions` table

### Data Integrity
- Admin actions use database transactions
- Critical operations (void, delete) have confirmation dialogs
- All actions are logged for audit purposes

---

## 🚨 Troubleshooting

### "Admin" link doesn't appear in navigation

**Solution**:
1. Verify your user has `is_admin = true` in database
2. Log out completely
3. Log back in
4. Check navigation menu

### Can't access `/admin` page

**Solution**:
1. Check database: `SELECT email, is_admin FROM users WHERE email = 'your-email';`
2. If `is_admin` is `false`, update it (see "How to Become an Admin" above)
3. Log out and log back in
4. Try accessing `/admin` again

### Admin actions not working

**Solution**:
1. Check browser console for errors
2. Verify you're logged in as an admin
3. Check Vercel function logs for API errors
4. Ensure database connection is working

### Can't void a match

**Solution**:
1. Only completed matches can be voided
2. Check match status in Matches tab
3. If match is "pending_confirmation", it must be confirmed or disputed first
4. Voided matches can be un-voided

---

## 📝 Quick Reference

### Making Someone an Admin (First Time)
```sql
UPDATE users SET is_admin = true WHERE email = 'user@example.com';
```

### Checking Admin Status
```sql
SELECT email, is_admin FROM users WHERE email = 'user@example.com';
```

### Admin Dashboard URL
```
https://leagueladderapp.vercel.app/admin
```

### Admin API Endpoints
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/[userId]/toggle-admin` - Toggle admin status
- `GET /api/admin/players` - List all players
- `GET /api/admin/matches` - List all matches
- `POST /api/admin/matches/[matchId]/void` - Void a match
- `POST /api/admin/matches/[matchId]/unvoid` - Un-void a match
- `PUT /api/admin/matches/[matchId]` - Edit match scores
- `PUT /api/admin/players/[playerId]/ratings/[leagueId]` - Adjust rating
- `PUT /api/admin/players/[playerId]/stats/[leagueId]` - Adjust stats
- `GET /api/admin/leagues` - List all leagues

---

---

## ✅ Implementation Status

**All admin API routes are now implemented and functional:**
- ✅ Admin stats endpoint
- ✅ User management (list, toggle admin, delete)
- ✅ Player management (list, view details, adjust ratings/stats, delete)
- ✅ Match management (list, void, un-void, edit scores, delete)
- ✅ League management (list, view statistics)

**Last Updated**: January 2026
