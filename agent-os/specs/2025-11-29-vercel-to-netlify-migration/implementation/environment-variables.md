# Environment Variables Required for Netlify Migration

This document lists all environment variables that need to be configured in the Netlify dashboard.

## Required Variables

These variables are **required** for the application to function:

### `NEXT_PUBLIC_SUPABASE_URL`
- **Purpose:** Supabase project URL for client-side access
- **Used in:** 
  - `lib/supabase.ts`
  - `lib/supabase-server.ts`
  - `lib/supabase-admin.ts`
  - `middleware.ts`
  - `lib/actions.ts`
  - `lib/auth-actions.ts`
  - `lib/profile-actions.ts`
  - `lib/newsletter-actions.ts`
  - `lib/notification-actions.ts`
  - `lib/privacy-actions.ts`
  - `app/api/ads/analytics/route.ts`
- **Type:** Public (exposed to browser)
- **Example:** `https://[project-id].supabase.co`
- **Source:** Copy from Vercel dashboard or Supabase project settings

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Purpose:** Supabase anonymous key for client-side authentication and database access
- **Used in:**
  - `lib/supabase.ts`
  - `lib/supabase-server.ts`
  - `middleware.ts`
  - `lib/actions.ts`
  - `lib/auth-actions.ts`
  - `lib/profile-actions.ts`
  - `lib/newsletter-actions.ts`
  - `lib/notification-actions.ts`
  - `lib/privacy-actions.ts`
  - `app/api/ads/analytics/route.ts`
- **Type:** Public (exposed to browser)
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Source:** Copy from Vercel dashboard or Supabase project settings

### `SUPABASE_SERVICE_ROLE_KEY`
- **Purpose:** Supabase service role key for admin operations and server-side database access
- **Used in:**
  - `lib/supabase-admin.ts`
  - `lib/actions.ts` (admin operations)
- **Type:** **SENSITIVE** (server-side only, must be marked as sensitive in Netlify)
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Source:** Copy from Vercel dashboard or Supabase project settings
- **Security:** ⚠️ **CRITICAL** - Never expose this key to the browser. Mark as sensitive in Netlify.

## Optional Variables

These variables are used if the features are enabled:

### `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- **Purpose:** Google AdSense client ID for advertisement display
- **Used in:**
  - `app/layout.tsx`
  - `components/ads/AdSlot.tsx`
  - `app/dashboard/ads/page.tsx`
- **Type:** Public (exposed to browser)
- **Example:** `ca-pub-1437334079893020`
- **Source:** Copy from Vercel dashboard or Google AdSense account
- **Note:** Only needed if AdSense is enabled

### `NEXTAUTH_SECRET`
- **Purpose:** Secret key for NextAuth.js session encryption
- **Used in:** NextAuth.js configuration (if NextAuth is actually used)
- **Type:** **SENSITIVE** (server-side only, must be marked as sensitive in Netlify)
- **Example:** Random string (minimum 32 characters)
- **Source:** Copy from Vercel dashboard
- **Note:** Verify if NextAuth is actually used in the application before adding

### `NEXTAUTH_URL`
- **Purpose:** Base URL for NextAuth.js callbacks
- **Used in:** NextAuth.js configuration (if NextAuth is actually used)
- **Type:** Public
- **Initial Value:** `https://[site-name].netlify.app` (Netlify subdomain)
- **Final Value:** `https://[custom-domain.com]` (after DNS migration)
- **Source:** Set to Netlify subdomain initially, update to custom domain after DNS migration
- **Note:** Verify if NextAuth is actually used in the application before adding

## System Variables

These are automatically set by Netlify and do not need to be configured:

### `NODE_ENV`
- **Purpose:** Environment indicator (production/development)
- **Value:** Automatically set to `production` by Netlify
- **Action:** No configuration needed

## Migration Steps

1. **Before Migration:**
   - Log into Vercel dashboard
   - Navigate to Project Settings > Environment Variables
   - Document all variable names and values

2. **In Netlify Dashboard:**
   - Navigate to Site settings > Environment variables
   - Add each variable from the list above
   - For sensitive variables (`SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`):
     - Click "Mark as sensitive" checkbox
   - For `NEXTAUTH_URL`:
     - Initially set to: `https://[site-name].netlify.app`
     - After DNS migration, update to: `https://[custom-domain.com]`

3. **Verification:**
   - After deployment, verify all features work correctly
   - Check browser console for any missing environment variable errors
   - Verify authentication and database connections work

## Security Notes

- ⚠️ **Never commit environment variables to Git**
- ⚠️ **Mark sensitive variables as sensitive in Netlify dashboard**
- ⚠️ **Service role keys should only be used server-side**
- ⚠️ **Public variables (`NEXT_PUBLIC_*`) are exposed to the browser**

