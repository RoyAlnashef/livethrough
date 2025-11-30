# Netlify Environment Variables Setup Guide

## Critical Issue: Missing Environment Variables for Develop Branch

The deployed site at `https://develop--livethrough.netlify.app/` shows "0 Courses" because the Supabase environment variables are not configured for the `develop` branch deployment.

## Required Environment Variables

You **MUST** configure these in the Netlify dashboard:

### Required Variables (All Deploy Contexts)

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - Your Supabase project URL
   - Example: `https://nudjwpboatydjubnekfb.supabase.co`
   - Copy from: Vercel dashboard or Supabase project settings

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Your Supabase anonymous key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Copy from: Vercel dashboard or Supabase project settings

3. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Your Supabase service role key
   - ⚠️ **Mark as SENSITIVE** in Netlify
   - Copy from: Vercel dashboard or Supabase project settings

### Optional Variables (If Used)

4. **`NEXT_PUBLIC_ADSENSE_CLIENT_ID`** (if AdSense is enabled)
   - Example: `ca-pub-1437334079893020`
   - Copy from: Vercel dashboard or Google AdSense account

5. **`NEXTAUTH_SECRET`** (if NextAuth is used)
   - ⚠️ **Mark as SENSITIVE** in Netlify
   - Copy from: Vercel dashboard

6. **`NEXTAUTH_URL`** (if NextAuth is used)
   - For develop branch: `https://develop--livethrough.netlify.app`
   - For production: `https://livethrough.co`
   - Copy from: Vercel dashboard or set manually

## How to Configure in Netlify Dashboard

### Step 1: Navigate to Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **livethrough**
3. Go to **Site settings** → **Environment variables**

### Step 2: Add Each Variable

For each variable above:

1. Click **"Add a variable"**
2. Enter the **Key** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Enter the **Value** (copy from Vercel dashboard)
4. For sensitive variables (`SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`):
   - ✅ Check **"Mark as sensitive"**
5. Set **Scopes**:
   - Select **"All scopes"** (recommended), OR
   - Select **"Specific scopes"** and check:
     - ✅ Builds
     - ✅ Functions
     - ✅ Post-processing
6. Set **Deploy contexts**:
   - Select **"All deploy contexts"** (recommended), OR
   - Select **"Specific deploy contexts"** and check:
     - ✅ Production
     - ✅ Deploy Previews
     - ✅ Branch deploys (⚠️ **CRITICAL** - includes develop branch)
     - ✅ Preview Server & Agent Runners
     - ✅ Local development (Netlify CLI)
7. Click **"Add variable"**

### Step 3: Verify Configuration

After adding all variables:

1. Scroll down to see all configured variables
2. Verify each variable shows the correct scopes and deploy contexts
3. Ensure **"Branch deploys"** is checked for all variables (or use "All deploy contexts")

### Step 4: Trigger New Deployment

After configuring environment variables:

1. Go to **Deploys** tab
2. Find the latest deploy for `develop` branch
3. Click **"Retry deploy"** OR
4. Push a new commit to `develop` branch to trigger auto-deploy

## Verification Checklist

After deployment, verify:

- [ ] Site loads without errors
- [ ] Courses display (not "0 Courses")
- [ ] Authentication works (login/logout)
- [ ] Protected routes work (`/account/*`, `/dashboard/*`)
- [ ] No console errors in browser DevTools
- [ ] Supabase connection is working

## Troubleshooting

### If courses still don't load:

1. **Check browser console** (F12 → Console tab):
   - Look for errors like "Missing env.NEXT_PUBLIC_SUPABASE_URL"
   - Look for Supabase connection errors

2. **Verify environment variables are set**:
   - Go to Netlify Dashboard → Site settings → Environment variables
   - Confirm all variables are listed
   - Confirm "Branch deploys" is checked for each variable

3. **Check deploy logs**:
   - Go to Deploys → Latest deploy → Deploy log
   - Look for any environment variable warnings or errors

4. **Verify variable values**:
   - Compare values in Netlify with values in Vercel
   - Ensure no typos or extra spaces

## Important Notes

- **NEXT_PUBLIC_*** variables are intentionally public and safe to expose
- These variables are embedded in the client bundle at build time
- They must be available during both build AND runtime
- The `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` tells Netlify to ignore these in secret scanning

## Quick Reference: Where to Find Values

**From Vercel Dashboard:**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Copy each value

**From Supabase Dashboard:**
1. Go to your Supabase project
2. Settings → API
3. Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy "service_role" key → `SUPABASE_SERVICE_ROLE_KEY`

