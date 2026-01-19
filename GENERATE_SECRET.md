# How to Generate NEXTAUTH_SECRET

The `NEXTAUTH_SECRET` is required for NextAuth.js session encryption. Here are several ways to generate it:

## Option 1: Windows PowerShell (Recommended for Windows)

Open PowerShell and run:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

This will output a base64-encoded string like: `7fmTkYUq82AA0uXtvVJoBCLLN7Ge85JTMYgQV19p1/I=`

## Option 2: Node.js (Works on all platforms)

If you have Node.js installed:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or create a quick script:

```bash
node -p "require('crypto').randomBytes(32).toString('base64')"
```

## Option 3: Online Generator

Use Vercel's secret generator:
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

## Option 4: Linux/Mac (if you have OpenSSL)

```bash
openssl rand -base64 32
```

## Option 5: Python (if you have Python installed)

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Using the Generated Secret

Once you have your secret, add it to your Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add a new variable:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: (paste your generated secret)
   - **Environment**: Production, Preview, Development (select all)
3. Save and redeploy

## Security Notes

- ✅ Keep your secret secure and never commit it to Git
- ✅ Use different secrets for development and production
- ✅ If your secret is compromised, generate a new one and update it
- ✅ The secret should be at least 32 bytes (256 bits) for security

## Quick Copy-Paste for Windows

If you're on Windows and want to quickly generate and copy:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 })) | Set-Clipboard
```

This generates the secret and automatically copies it to your clipboard!
