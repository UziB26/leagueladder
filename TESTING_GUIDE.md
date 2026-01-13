# 🧪 Testing Guide - League Ladder App

## Quick Start
1. Make sure your dev server is running: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. Follow the steps below to test all features

---

## 📋 Complete Testing Flow

### **Test 1: Home Page (Not Logged In)**

**What to do:**
- Visit `http://localhost:3000`
- You should see the home page with two league cards (FIFA and Table Tennis)

**What should happen:**
- ✅ Navigation bar at the top with "Login" and "Register" buttons
- ✅ Two blue "Join" buttons (one for FIFA, one for Table Tennis)
- ✅ Both buttons are blue (not gray)
- ✅ Text is clear and readable

**Test the buttons:**
- Click "Join FIFA League" → Should redirect to `/auth/login`
- Click "Join Table Tennis" → Should redirect to `/auth/login`
- Click "Login" in navigation → Should go to login page
- Click "Register" in navigation → Should go to register page

---

### **Test 2: Registration (Create New Account)**

**What to do:**
1. Go to `/auth/register` (or click "Register" in navigation)
2. Fill out the form:
   - **Display Name**: `TestPlayer` (or any name)
   - **Email**: `test@example.com` (or any email)
   - **Password**: `password123` (any password - not validated yet)
3. Click "Create account"

**What should happen:**
- ✅ Form fields are large and easy to read
- ✅ Labels are bold and clear
- ✅ Button shows "Creating account..." while processing
- ✅ **Automatically redirects to `/dashboard`** after successful registration
- ✅ You are now logged in

**Verify:**
- Check navigation bar → Should show "Hi, [your name]" and "Sign Out" button
- You should be on the dashboard page

---

### **Test 3: Dashboard (After Registration)**

**What to do:**
- You should already be on the dashboard after registration

**What should happen:**
- ✅ Page title: "🏓 League Ladder Dashboard"
- ✅ Welcome message with your name
- ✅ Two league cards visible (FIFA and Table Tennis)
- ✅ Both "Join" buttons are blue
- ✅ Navigation bar shows you're logged in

**Test joining a league:**
1. Click "Join FIFA League"
   - Button should show "Joining..." briefly
   - Green success message should appear: "Successfully joined league!"
   - Button may become disabled (if you're already in the league)

2. Click "Join Table Tennis"
   - Same behavior as above
   - Success message appears

**What happens behind the scenes:**
- ✅ Creates a player profile linked to your user account
- ✅ Adds you to the league membership
- ✅ Initializes your Elo rating at 1000 points
- ✅ All data saved to database

---

### **Test 4: Logout and Login**

**What to do:**
1. Click "Sign Out" in the navigation bar
2. You should be redirected to home page
3. Navigation should show "Login" and "Register" buttons again

**Test login:**
1. Click "Login" in navigation (or go to `/auth/login`)
2. Fill in the form:
   - **Email**: `test@example.com` (same email you registered with)
   - **Password**: `password123` (same password)
3. Click "Sign in"

**What should happen:**
- ✅ Form is easy to read (large text, clear labels)
- ✅ Button shows "Signing in..." while processing
- ✅ Redirects to `/dashboard` after successful login
- ✅ Navigation shows you're logged in again

---

### **Test 5: Home Page (While Logged In)**

**What to do:**
- Go back to home page (`/`)
- Click the join buttons

**What should happen:**
- ✅ Buttons say "Go to Dashboard" instead of "Join [League]"
- ✅ Clicking them redirects to `/dashboard`
- ✅ Navigation bar shows you're logged in

---

### **Test 6: Error Handling**

**Test invalid login:**
1. Go to `/auth/login`
2. Enter wrong email or leave fields empty
3. Try to submit

**What should happen:**
- ✅ Form validation prevents submission if fields are empty
- ✅ If email doesn't exist, you'll still be logged in (current implementation auto-creates users)
- ✅ Error messages appear in red box if something fails

**Test duplicate league join:**
1. Go to dashboard
2. Try to join the same league twice

**What should happen:**
- ✅ Red error message: "Already joined this league"
- ✅ Button may be disabled

---

## ✅ Checklist: What Should Work

### Navigation Bar
- [ ] Shows "Login" and "Register" when logged out
- [ ] Shows "Hi, [name]" and "Sign Out" when logged in
- [ ] Links work correctly
- [ ] Sticky at top of page

### Home Page
- [ ] Both join buttons are blue
- [ ] Buttons redirect to login when logged out
- [ ] Buttons redirect to dashboard when logged in
- [ ] Text is readable

### Registration Page
- [ ] All fields are large and readable
- [ ] Labels are bold and clear
- [ ] Form validation works
- [ ] Creates account and logs in automatically
- [ ] Redirects to dashboard

### Login Page
- [ ] All fields are large and readable
- [ ] Labels are bold and clear
- [ ] Form validation works
- [ ] Logs in successfully
- [ ] Redirects to dashboard

### Dashboard
- [ ] Shows welcome message with user name
- [ ] Displays both leagues
- [ ] Join buttons work
- [ ] Success/error messages appear
- [ ] Can join multiple leagues
- [ ] Prevents duplicate joins

### API Endpoints
- [ ] `/api/leagues` returns list of leagues
- [ ] `/api/leagues/join` creates player and membership
- [ ] Authentication works (requires login)

---

## 🐛 Common Issues & Solutions

### Issue: "Buttons don't do anything"
**Solution:** Make sure you're on the correct routes (`/app/` not `/src/app/`)

### Issue: "Can't see navigation bar"
**Solution:** Check that `Navigation` component is in `app/layout.tsx`

### Issue: "Login doesn't work"
**Solution:** 
- Check browser console for errors
- Verify NextAuth is configured correctly
- Check that database is initialized

### Issue: "Can't join leagues"
**Solution:**
- Make sure you're logged in
- Check browser console for API errors
- Verify `/api/leagues/join` endpoint exists

---

## 🎯 Expected Database Changes

After testing, check your database (`league-ladder.db`) - you should see:

1. **users** table: Your user account
2. **accounts** table: Authentication record
3. **players** table: Your player profile
4. **league_memberships** table: Your league memberships
5. **player_ratings** table: Your ratings (1000 for each league joined)

---

## 📝 Notes

- **Current Implementation**: The app auto-creates users on first login/register attempt
- **Password**: Not validated yet (any password works)
- **Name**: Uses email prefix if name not provided
- **Ratings**: Start at 1000 for all new players

---

## 🚀 Next Steps After Testing

Once everything works:
1. Test with multiple users (different emails)
2. Test joining both leagues
3. Verify data persists after page refresh
4. Check database to see all records created
