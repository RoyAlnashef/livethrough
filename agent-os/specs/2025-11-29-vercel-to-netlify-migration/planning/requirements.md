# Spec Requirements: Vercel to Netlify Migration

## Initial Description
Stop deploying our app to Vercel and migrate to Netlify.

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming you want to do a complete cutover (stop Vercel, deploy to Netlify). Should we do a parallel deployment first for testing, or a direct switch?
**Answer:** We can do a parallel deployment first.

**Q2:** I'm assuming you'll use the same custom domain. Do you want to update DNS to point to Netlify, or use Netlify's domain first and switch later?
**Answer:** We'll use the netlify domain first to test, then update the DNS to point our custom domain to netlify.

**Q3:** I'm assuming we'll migrate all Vercel environment variables to Netlify. Should I document the required variables (Supabase URLs/keys, NextAuth secrets, etc.) for manual migration, or do you have a list ready?
**Answer:** Please document the required variables for manual migration.

**Q4:** I'm assuming we'll create a `netlify.toml` configuration file for Next.js 15 with App Router, Server Actions, and Sharp support. Should we also configure build commands, Node version, and any Netlify-specific settings?
**Answer:** Let's do everything that we need to in order to complete the task of deploying a working version of our app onto Netlify.

**Q5:** I'm assuming you're not using Vercel Analytics, Edge Functions, or other Vercel-only features. Are there any Vercel-specific integrations or features we need to replace or remove?
**Answer:** We can answer questions as they come up in the work.

**Q6:** I'm assuming Netlify's Next.js runtime supports Server Actions with the 10MB body limit. Should we test this during migration, or do you have confirmation it works?
**Answer:** We can answer questions as they come up in the work.

**Q7:** I'm assuming you want Netlify to auto-deploy from your Git repository (similar to Vercel). Should we configure branch-based preview deployments for PRs, or only deploy from the main branch?
**Answer:** We can answer questions as they come up in the work.

**Q8:** I'm assuming you want a testing phase before fully switching. Should we set up a staging environment on Netlify first, or do a direct production migration with a rollback plan?
**Answer:** We can answer questions as they come up in the work.

### Existing Code to Reference

**Similar Features Identified:**
No similar existing features identified for reference. No GitHub Actions workflows, deployment scripts, or infrastructure-as-code files found in the codebase.

### Follow-up Questions
No follow-up questions were needed.

## Visual Assets

### Files Provided:
No visual files found.

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements
- Set up parallel deployment on Netlify alongside existing Vercel deployment
- Configure Netlify to deploy from Git repository (auto-deploy)
- Create `netlify.toml` configuration file for Next.js 15 with App Router
- Support Next.js Server Actions with 10MB body limit
- Support Sharp for image processing (server-side WebP conversion)
- Configure build commands and Node.js version
- Migrate all environment variables from Vercel to Netlify
- Test deployment on Netlify subdomain first
- Update DNS to point custom domain to Netlify after testing
- Ensure all application features work correctly on Netlify

### Environment Variables Required for Migration

Based on codebase analysis, the following environment variables need to be migrated to Netlify:

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (used in multiple files)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (used in multiple files)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (used for admin operations)

**Optional Variables (if used):**
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` - Google AdSense client ID (used in ad components)
- `NEXTAUTH_SECRET` - NextAuth secret (mentioned in README, verify if actually used)
- `NEXTAUTH_URL` - NextAuth URL (mentioned in README, verify if actually used)

**System Variables:**
- `NODE_ENV` - Automatically set by Netlify (production/development)

### Reusability Opportunities
- No existing deployment configurations to reference
- No CI/CD scripts to reuse
- Standard Next.js 15 deployment patterns apply

### Scope Boundaries

**In Scope:**
- Create Netlify configuration file (`netlify.toml`)
- Set up Netlify site and connect to Git repository
- Configure build settings for Next.js 15 App Router
- Migrate environment variables
- Test deployment on Netlify subdomain
- Update DNS configuration for custom domain
- Verify all application features work on Netlify
- Document migration process and environment variables

**Out of Scope:**
- Removing Vercel deployment (can be done after successful Netlify migration)
- Modifying application code (unless Netlify-specific changes are required)
- Setting up CI/CD pipelines (Netlify handles this automatically)
- Database migrations (Supabase is external)
- Third-party service reconfiguration (Supabase, AdSense remain unchanged)

### Technical Considerations

**Next.js 15 App Router Compatibility:**
- Netlify supports Next.js 15 with App Router
- Server Actions are supported but may need configuration
- Middleware support needs verification

**Build Configuration:**
- Current build command: `npm run build`
- Node.js version: 18+ (LTS recommended)
- Sharp package requires native dependencies (needs verification on Netlify)

**Server Actions:**
- Current configuration: 10MB body size limit
- Need to verify Netlify supports this limit

**Image Processing:**
- Sharp is used for server-side WebP conversion
- Need to ensure Sharp works correctly on Netlify's build environment

**Middleware:**
- Application uses Next.js middleware for authentication and route protection
- Need to verify middleware works correctly on Netlify

**Environment Variables:**
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Service role keys must remain server-side only
- Need to configure in Netlify dashboard

**Deployment Strategy:**
- Parallel deployment allows testing before cutover
- Netlify subdomain testing before DNS switch
- Gradual migration reduces risk

