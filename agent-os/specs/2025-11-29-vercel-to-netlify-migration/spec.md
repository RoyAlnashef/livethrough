# Specification: Vercel to Netlify Migration

## Goal
Migrate the LiveThrough Next.js application from Vercel to Netlify hosting, ensuring all features work correctly with parallel deployment for testing before DNS cutover.

## User Stories
- As a developer, I want to deploy the application to Netlify so that we can migrate away from Vercel
- As a developer, I want to test the Netlify deployment on a subdomain before switching DNS so that we can verify everything works correctly

## Specific Requirements

**Create Netlify Configuration File**
- Create `netlify.toml` in project root with Next.js 15 App Router configuration
- Configure build command: `npm run build`
- Set publish directory to `.next` (or appropriate Next.js output directory)
- Specify Node.js version 18+ (LTS recommended)
- Configure Next.js runtime settings for Server Actions support
- Include Sharp package in external packages configuration if needed
- Set up redirects and rewrites for Next.js App Router routing
- Configure environment variable handling for build and runtime

**Manual Task: Sign Up for Netlify Account**
- **STOP HERE** - User must sign up for Netlify account at netlify.com if not already registered
- Verify account email and complete onboarding
- Return here after account is ready

**Manual Task: Connect Git Repository to Netlify**
- **STOP HERE** - User must connect Git repository to Netlify dashboard
- Authorize Netlify to access GitHub/GitLab/Bitbucket repository
- Select the repository containing the LiveThrough project
- Return here after repository is connected

**Manual Task: Configure Environment Variables in Netlify Dashboard**
- **STOP HERE** - User must add all required environment variables in Netlify dashboard
- Navigate to Site settings > Environment variables
- Add `NEXT_PUBLIC_SUPABASE_URL` (copy from Vercel dashboard)
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (copy from Vercel dashboard)
- Add `SUPABASE_SERVICE_ROLE_KEY` (copy from Vercel dashboard)
- Add `NEXT_PUBLIC_ADSENSE_CLIENT_ID` if used (copy from Vercel dashboard)
- Add `NEXTAUTH_SECRET` if used (copy from Vercel dashboard)
- Add `NEXTAUTH_URL` if used (set to Netlify subdomain initially, e.g., `https://[site-name].netlify.app`)
- Mark sensitive variables (service role keys, secrets) as sensitive
- Return here after all variables are configured

**Configure Build Settings**
- Verify Netlify auto-detects Next.js framework (should auto-configure)
- Ensure build command matches `netlify.toml` configuration
- Configure branch-based deployments if needed (main branch for production)
- Set up preview deployments for pull requests if desired
- Verify Node.js version matches specification

**Manual Task: Trigger Initial Deployment**
- **STOP HERE** - User must trigger first deployment in Netlify dashboard
- Click "Deploy site" or push a commit to trigger auto-deployment
- Monitor build logs for any errors
- Verify build completes successfully
- Return here after successful build

**Manual Task: Test Netlify Deployment on Subdomain**
- **STOP HERE** - User must perform comprehensive QA testing on Netlify subdomain
- Test homepage loads correctly
- Test authentication flow (login/logout)
- Test protected routes (`/account/*`, `/dashboard/*`)
- Test admin dashboard functionality
- Test course marketplace features
- Test image uploads and processing
- Test Server Actions with file uploads (verify 10MB limit works)
- Test middleware authentication and authorization
- Test responsive design on mobile/tablet/desktop
- Test all critical user flows end-to-end
- Document any issues or errors encountered
- Return here after testing is complete and issues are resolved

**Manual Task: Update DNS Configuration**
- **STOP HERE** - User must update DNS records to point custom domain to Netlify
- Log into domain registrar or DNS provider
- Remove or update existing DNS records pointing to Vercel
- Add Netlify DNS records (A record, CNAME, or ALIAS as recommended by Netlify)
- Configure SSL certificate in Netlify (automatic via Let's Encrypt)
- Wait for DNS propagation (can take up to 48 hours, typically 1-2 hours)
- Verify custom domain works correctly on Netlify
- Return here after DNS is configured and verified

**Update Environment Variables for Custom Domain**
- Update `NEXTAUTH_URL` environment variable in Netlify to use custom domain (if used)
- Verify all environment variables are correct for production
- Test that application works correctly with custom domain

**Manual Task: Final Production Testing**
- **STOP HERE** - User must perform final production testing on custom domain
- Test all features work correctly with custom domain
- Verify SSL certificate is active and secure
- Test authentication flows with custom domain
- Verify no mixed content warnings (HTTP/HTTPS issues)
- Test performance and loading times
- Verify analytics and tracking (if applicable)
- Return here after final testing is complete

**Manual Task: Remove Vercel Deployment (Optional)**
- **STOP HERE** - User may choose to remove Vercel deployment after successful migration
- Log into Vercel dashboard
- Remove project or disconnect repository
- Cancel Vercel subscription if no longer needed
- This step is optional and can be done later

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**`next.config.ts`**
- Current Next.js configuration with image remote patterns
- Server Actions body size limit (10MB) configuration
- Sharp external package configuration
- These settings should be compatible with Netlify but may need verification

**`package.json`**
- Build scripts (`npm run build`) are standard and should work on Netlify
- Dependencies are platform-agnostic and should work on Netlify
- Node.js version requirement (18+) should be specified in Netlify configuration

**`middleware.ts`**
- Next.js middleware for authentication and route protection
- Uses Supabase SSR helpers which should work on Netlify
- No changes needed unless Netlify-specific middleware issues arise

**Environment Variable Usage Patterns**
- `NEXT_PUBLIC_*` variables used throughout codebase for client-side access
- Service role keys used only in server-side code
- Pattern is compatible with Netlify's environment variable system

**Supabase Integration**
- All Supabase client configurations use environment variables
- No Vercel-specific Supabase integrations found
- Should work identically on Netlify

## Out of Scope
- Removing Vercel deployment immediately (can be done after successful migration)
- Modifying application code unless Netlify-specific issues require changes
- Setting up custom CI/CD pipelines (Netlify handles this automatically)
- Database migrations or Supabase reconfiguration (external service)
- Third-party service reconfiguration (Supabase, AdSense remain unchanged)
- Performance optimization specific to Netlify (unless issues arise)
- Setting up Netlify Functions or Edge Functions (not needed for this migration)
- Configuring Netlify Analytics or other monitoring tools (optional enhancement)
- Setting up staging environments (can be added later if needed)
- Migrating Vercel-specific features like Edge Functions or Analytics

