# Email Verification Troubleshooting Guide

## Issue: Not Receiving Verification Emails

### Step 1: Check Environment Variables

Verify these are set in `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev  # For testing
# Or: EMAIL_FROM=noreply@yourdomain.com  # For production
NEXTAUTH_URL=http://localhost:3000  # Or your production URL
```

### Step 2: Check Console Logs

When you register, check the terminal/console for:

```
[Auth] Sending verification email to: user@example.com
[Email Service] Attempting to send verification email to: user@example.com
[Email Service] From: onboarding@resend.dev
[Email Service] Verification URL: http://localhost:3000/auth/verify-email?token=...
[Email Service] Email sent successfully!
```

**If you see errors:**
- `Resend API key not configured` → Set `RESEND_API_KEY`
- `EMAIL_FROM not configured` → Set `EMAIL_FROM`
- `Resend API error` → Check your Resend API key is valid

### Step 3: Check Resend Dashboard

1. Go to https://resend.com/emails
2. Check if emails are being sent
3. Check for any error messages
4. Verify your API key is active

### Step 4: Test Email Configuration

**Quick Test:**
1. Register a new account
2. Check terminal for email sending logs
3. Check Resend dashboard for sent emails
4. Check your email inbox (and spam folder)

### Step 5: Common Issues

**Issue: "Email service not configured"**
- **Fix**: Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`
- **Restart**: Restart your dev server after adding env vars

**Issue: "Invalid API key"**
- **Fix**: Get a new API key from Resend dashboard
- **Verify**: Key starts with `re_`

**Issue: "Domain not verified"**
- **Fix**: For testing, use `onboarding@resend.dev`
- **Production**: Verify your domain in Resend dashboard

**Issue: Emails going to spam**
- **Fix**: Verify your domain in Resend
- **Check**: SPF and DKIM records are set correctly

## Email Verification Required Feature

### How It Works

1. **Registration**: User registers → Email sent automatically
2. **Login**: User logs in → Checked for email verification
3. **Protected Routes**: All API routes check email verification
4. **Pages**: Dashboard, matches, challenges, leagues check verification
5. **Redirect**: Unverified users → `/auth/verify-email-required`

### What's Protected

- ✅ All API routes (except verification routes)
- ✅ Dashboard page
- ✅ Matches page
- ✅ Challenges page
- ✅ Leagues page (when logged in)
- ✅ All authenticated features

### Bypassing Verification (For Testing)

If you need to test without email verification:

1. **Option 1**: Manually verify in database:
   ```sql
   UPDATE users SET email_verified = NOW() WHERE email = 'test@example.com';
   ```

2. **Option 2**: Temporarily comment out verification checks in:
   - `src/lib/api-helpers.ts` (line ~74-90)
   - `app/dashboard/page.tsx` (line ~41-47)
   - Other protected pages

**Note**: Don't commit these changes - they're for testing only!

## Debugging Steps

1. **Check logs** when registering:
   ```bash
   # Look for these log messages:
   [Auth] Sending verification email to: ...
   [Email Service] Attempting to send verification email to: ...
   [Email Service] Email sent successfully!
   ```

2. **Check Resend dashboard**:
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check for delivery status

3. **Check email inbox**:
   - Check spam/junk folder
   - Check email filters
   - Try a different email address

4. **Test email sending manually**:
   ```bash
   # Use the API endpoint
   curl -X POST http://localhost:3000/api/auth/send-verification \
     -H "Cookie: your-session-cookie"
   ```

## Production Setup

For production, make sure:

1. **Environment Variables** are set in Vercel/Amplify:
   - `RESEND_API_KEY`
   - `EMAIL_FROM` (must be verified domain)
   - `NEXTAUTH_URL` (must match your domain)

2. **Domain Verification** in Resend:
   - Add your domain
   - Add DNS records
   - Wait for verification

3. **Test** after deployment:
   - Register new account
   - Check email arrives
   - Verify email works

---

**Need Help?** Check the console logs first - they'll tell you exactly what's wrong!
