# Production Database Setup Guide

## Step 1: Create Neon PostgreSQL Database

1. **Sign up for Neon** (Free tier available):
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub/Google
   - Create a new project

2. **Get Connection String**:
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

## Step 2: Configure Netlify Environment Variables

1. **Go to Netlify Dashboard**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Select your site: `logisticsai.netlify.app`

2. **Add Environment Variables**:
   - Go to: Site Settings → Environment Variables
   - Add these variables:

   ```
   NEXTAUTH_URL = https://logisticsai.netlify.app
   NEXTAUTH_SECRET = [generate a strong random string]
   DATABASE_URL = [your Neon connection string]
   ```

3. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

## Step 3: Deploy and Test

1. **Push the changes** (already done):
   ```bash
   git add -A
   git commit -m "feat: configure PostgreSQL for production"
   git push origin main
   ```

2. **Wait for Netlify deployment** to complete

3. **Test the endpoints**:
   - Signup: `POST https://logisticsai.netlify.app/api/auth/signup`
   - Login: Use the signup credentials on the login page

## Step 4: Verify Database Connection

After deployment, check Netlify function logs for:
- "Production env check:" - confirms environment variables are set
- "Prisma connection attempt:" - confirms database connection

## Troubleshooting

If you see 500 errors:
1. Verify all 3 environment variables are set in Netlify
2. Check that the DATABASE_URL is correct (no extra spaces)
3. Ensure the Neon database is active
4. Check Netlify function logs for specific error messages

## Alternative: Quick Test Database

If you want to test immediately without setting up Neon:
1. Use the demo mode (current state)
2. All frontend features work
3. Database features will work once PostgreSQL is configured
