# Send Verification Emails to Existing Users

## Overview

After deploying the email verification feature, you need to send verification emails to all existing users who haven't verified their email yet. This document explains how to do this **once** after deployment.

## Admin API Endpoint

A new admin-only endpoint has been created:

**`POST /api/admin/send-verification-to-all`**

### Features

- ✅ **Admin-only**: Only admins can call this endpoint
- ✅ **Idempotent**: Safe to call multiple times (won't send duplicate emails)
- ✅ **Smart skipping**: Skips users who already have valid verification tokens
- ✅ **Error handling**: Continues processing even if some emails fail
- ✅ **Detailed response**: Returns count of sent, skipped, and errors

### How It Works

1. Finds all users with `emailVerified = null`
2. For each user:
   - Checks if they already have a valid (non-expired) verification token
   - If yes, skips them (prevents duplicate emails)
   - If no, creates a new token and sends verification email
3. Returns detailed results

## How to Use

### Option 1: Using cURL (Recommended)

After deployment, call the endpoint once:

```bash
# Replace YOUR_DOMAIN with your Vercel domain
curl -X POST https://YOUR_DOMAIN/api/admin/send-verification-to-all \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**To get your session token:**
1. Log in to your app as an admin
2. Open browser DevTools → Application/Storage → Cookies
3. Copy the value of `next-auth.session-token`

### Option 2: Using Browser Console

1. Log in to your app as an admin
2. Open browser DevTools → Console
3. Run:

```javascript
fetch('/api/admin/send-verification-to-all', {
  method: 'POST',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data))
```

### Option 3: Using Postman/Insomnia

1. Create a POST request to: `https://YOUR_DOMAIN/api/admin/send-verification-to-all`
2. Add your session cookie in the headers
3. Send the request

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Verification emails sent to 15 users. 3 skipped (already have valid tokens). 0 errors.",
  "total": 18,
  "sent": 15,
  "skipped": 3,
  "errors": [],
  "timestamp": "2026-01-26T14:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Failed to send verification emails",
  "timestamp": "2026-01-26T14:30:00.000Z"
}
```

## Important Notes

1. **One-time use**: This is designed to be called **once** after deployment
2. **Idempotent**: Safe to call multiple times, but unnecessary
3. **Rate limiting**: Uses admin rate limiting (stricter than regular API)
4. **Email service required**: Make sure `RESEND_API_KEY` and `EMAIL_FROM` are configured
5. **No duplicate emails**: Users with valid tokens won't receive duplicate emails

## Troubleshooting

### "Unauthorized" or "Forbidden"
- Make sure you're logged in as an admin
- Check that your session cookie is included in the request

### "Email service not configured"
- Set `RESEND_API_KEY` and `EMAIL_FROM` in Vercel environment variables
- Redeploy after adding environment variables

### Some emails failed
- Check the `errors` array in the response
- Common issues:
  - Invalid email addresses
  - Email service rate limits
  - Network issues

### All users skipped
- This means all unverified users already have valid verification tokens
- They should have received emails previously
- Check your email service logs

## After Running

1. **Check the response**: Verify how many emails were sent
2. **Monitor email service**: Check Resend dashboard for sent emails
3. **Test**: Try logging in as one of the users who received an email
4. **Verify**: Users should receive emails and be able to verify

## Future Users

- New users will automatically receive verification emails during registration
- This endpoint is only needed for existing users from before email verification was added

---

**Remember**: This is a one-time operation. After running it once, new users will automatically receive verification emails during registration.
