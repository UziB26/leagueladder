# Email Verification Setup Guide

Email verification has been successfully implemented! Follow these steps to complete the setup.

## ✅ What's Been Implemented

1. **Database Schema**: Added `VerificationToken` model to Prisma schema
2. **Email Service**: Created cross-platform email service using Resend
3. **API Routes**:
   - `POST /api/auth/send-verification` - Send verification email
   - `GET /api/auth/verify-email?token=...` - Verify email token
4. **Registration Flow**: Automatically sends verification email on signup
5. **Auth Session**: Includes `email_verified` status
6. **UI Components**:
   - Verification banner (shows on dashboard if email not verified)
   - Verification page (`/auth/verify-email`)
7. **Token Management**: Secure token generation, storage, and validation

## 📋 Setup Steps

### 1. Install Dependencies

```bash
npm install resend
```

### 2. Run Database Migration

```bash
npm run prisma:migrate
# Or: npx prisma migrate dev --name add_email_verification
```

This will create the `verification_tokens` table.

### 3. Set Up Email Service (Resend)

1. **Create Resend Account**: Go to https://resend.com and sign up
2. **Get API Key**: 
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)
3. **Set Environment Variables**:

   **For Local Development** (`.env.local`):
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

   **For Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `RESEND_API_KEY` = your Resend API key
     - `EMAIL_FROM` = your sender email (must be verified in Resend)

   **For AWS Amplify**:
   - Go to Amplify Console → App Settings → Environment Variables
   - Add the same variables as above

### 4. Verify Your Domain (Resend)

1. In Resend dashboard, go to Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records provided by Resend
4. Wait for verification (usually a few minutes)
5. Once verified, you can use `noreply@yourdomain.com` as `EMAIL_FROM`

**Note**: For testing, Resend provides a test domain that works immediately:
- Use `onboarding@resend.dev` as `EMAIL_FROM` (for testing only)

### 5. Update Environment Variables

Make sure these are set in all environments:

```env
# Required for email verification
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourdomain.com

# Already should be set
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 6. Redeploy

After setting environment variables, redeploy your application:

**Vercel**: Push a new commit or redeploy from dashboard
**Amplify**: Push a new commit or trigger a rebuild

## 🎯 How It Works

### Registration Flow

1. User registers with email and password
2. Account is created with `emailVerified: null`
3. Verification email is automatically sent
4. User is logged in and redirected to dashboard
5. Dashboard shows verification banner if email not verified

### Verification Flow

1. User clicks link in verification email
2. Link goes to `/auth/verify-email?token=...`
3. Token is validated (checked for expiry and existence)
4. User's `emailVerified` is set to current timestamp
5. Token is deleted (single-use)
6. User sees success message
7. Session is refreshed to show verified status

### Resend Verification Email

- Users can click "Resend Verification Email" button in the banner
- Rate limited to prevent abuse
- New token is generated and old one is deleted

## 🔒 Security Features

- **Token Expiry**: Tokens expire after 24 hours
- **Single Use**: Tokens are deleted after successful verification
- **Rate Limiting**: API routes are rate limited
- **Secure Tokens**: Cryptographically secure random tokens (32 bytes)
- **Email Validation**: Email format is validated before sending

## 🧪 Testing

### Test Locally

1. Set up `.env.local` with Resend API key
2. Use test domain: `EMAIL_FROM=onboarding@resend.dev`
3. Register a new account
4. Check your email (or Resend dashboard for sent emails)
5. Click verification link
6. Verify status updates in session

### Test in Production

1. Deploy with environment variables set
2. Register a new account
3. Check email inbox
4. Verify email
5. Confirm banner disappears from dashboard

## 📝 Notes

- **Email service is optional**: If `RESEND_API_KEY` is not set, registration still works but verification emails won't be sent
- **Non-blocking**: Email sending failures don't prevent registration
- **Backward compatible**: Existing users without verified emails will see the banner
- **Cross-platform**: Works on both Vercel and AWS Amplify

## 🐛 Troubleshooting

### Emails Not Sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify `EMAIL_FROM` is a verified domain in Resend
3. Check Resend dashboard for error logs
4. Check application logs for errors

### Verification Link Not Working

1. Check token hasn't expired (24 hours)
2. Verify token wasn't already used
3. Check `NEXTAUTH_URL` matches your deployment URL
4. Check application logs for errors

### Banner Not Showing

1. Check user is logged in
2. Verify `email_verified` is `null` or `false` in database
3. Check session includes `email_verified` field
4. Try refreshing the page

## 🔄 Migration for Existing Users

Existing users will have `emailVerified: null`. They can:
1. See the verification banner on dashboard
2. Click "Resend Verification Email" to get a verification link
3. Verify their email normally

## 📚 API Reference

### POST /api/auth/send-verification

Sends verification email to authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

### GET /api/auth/verify-email?token=...

Verifies email using token from email link.

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

## ✅ Checklist

- [ ] Install `resend` package
- [ ] Run Prisma migration
- [ ] Set up Resend account
- [ ] Add `RESEND_API_KEY` to environment variables
- [ ] Add `EMAIL_FROM` to environment variables
- [ ] Verify domain in Resend (or use test domain)
- [ ] Test registration flow
- [ ] Test verification email
- [ ] Test verification link
- [ ] Deploy to production
- [ ] Test in production

---

**Implementation Complete!** 🎉

All code is in place. Just follow the setup steps above to activate email verification.
