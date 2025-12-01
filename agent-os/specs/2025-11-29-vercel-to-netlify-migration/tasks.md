# Task Breakdown: Vercel to Netlify Migration

## Overview
Total Tasks: 5 task groups, 8 automated tasks, 5 manual tasks

## Task List

### Configuration & Setup

#### Task Group 1: Create Netlify Configuration
**Dependencies:** None

- [x] 1.0 Complete Netlify configuration setup
  - [x] 1.1 Create `netlify.toml` configuration file in project root
    - Configure build command: `npm run build`
    - Set publish directory to `.next` (Next.js 15 App Router output)
    - Specify Node.js version: 18.x (LTS)
    - Configure Next.js runtime settings
    - Set up redirects and rewrites for App Router routing
    - Configure environment variable handling
  - [x] 1.2 Verify `next.config.ts` compatibility with Netlify
    - Check Server Actions configuration (10MB body limit)
    - Verify Sharp external package configuration
    - Ensure image remote patterns are correct
    - No changes needed unless issues arise
  - [x] 1.3 Document environment variables required for migration
    - List all required variables from codebase analysis
    - Document variable purposes and where they're used
    - Create reference list for manual configuration step
  - [x] 1.4 Verify configuration file syntax and structure
    - Check TOML syntax is valid
    - Verify all settings align with Next.js 15 App Router requirements
    - Ensure build settings match `package.json` scripts

**Acceptance Criteria:**
- `netlify.toml` file exists in project root
- Configuration supports Next.js 15 App Router
- Node.js version specified (18+)
- Build command matches `package.json`
- Environment variables documented

### Manual Setup Tasks

#### Task Group 2: Netlify Account & Repository Setup
**Dependencies:** Task Group 1

- [ ] 2.0 Complete Netlify account and repository setup
  - [x] 2.1 **MANUAL TASK: Sign up for Netlify account**
    - **STOP HERE** - User must sign up at netlify.com if not already registered
    - Verify account email and complete onboarding
    - Return here after account is ready
  - [x] 2.2 **MANUAL TASK: Connect Git repository to Netlify**
    - **STOP HERE** - User must connect Git repository in Netlify dashboard
    - Authorize Netlify to access GitHub/GitLab/Bitbucket
    - Select the repository containing LiveThrough project
    - Return here after repository is connected
  - [x] 2.3 **MANUAL TASK: Configure environment variables in Netlify dashboard**
    - **STOP HERE** - User must add all required environment variables
    - Navigate to Site settings > Environment variables
    - Add `NEXT_PUBLIC_SUPABASE_URL` (copy from Vercel)
    - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (copy from Vercel)
    - Add `SUPABASE_SERVICE_ROLE_KEY` (copy from Vercel)
    - Add `NEXT_PUBLIC_ADSENSE_CLIENT_ID` if used (copy from Vercel)
    - Add `NEXTAUTH_SECRET` if used (copy from Vercel)
    - Add `NEXTAUTH_URL` if used (set to Netlify subdomain: `https://[site-name].netlify.app`)
    - Mark sensitive variables (service role keys, secrets) as sensitive
    - Return here after all variables are configured

**Acceptance Criteria:**
- Netlify account created and verified
- Git repository connected to Netlify
- All required environment variables configured in Netlify dashboard
- Sensitive variables marked as sensitive

### Build & Deployment

#### Task Group 3: Initial Deployment & Build Verification
**Dependencies:** Task Group 2

- [x] 3.0 Complete initial deployment and build verification
  - [x] 3.1 Verify Netlify auto-detects Next.js framework
    - Check that Netlify recognizes Next.js 15
    - Verify build settings match `netlify.toml` configuration
    - Ensure Node.js version matches specification (18+)
  - [x] 3.2 Configure branch-based deployments
    - Set main branch for production deployments
    - Configure preview deployments for pull requests (optional)
    - Verify auto-deploy settings
  - [x] 3.3 **MANUAL TASK: Trigger initial deployment**
    - **STOP HERE** - User must trigger first deployment
    - Click "Deploy site" or push a commit to trigger auto-deployment
    - Monitor build logs for any errors
    - Verify build completes successfully
    - Document any build errors or warnings
    - Return here after successful build
  - [x] 3.4 Verify build output and deployment
    - Check that build artifacts are generated correctly
    - Verify `.next` directory structure
    - Ensure no build-time errors in logs
    - Check deployment URL is accessible

**Acceptance Criteria:**
- Build completes successfully without errors
- Netlify subdomain is accessible
- Build logs show no critical errors
- Deployment URL responds correctly

### Testing & Verification

#### Task Group 4: Comprehensive Testing on Netlify Subdomain
**Dependencies:** Task Group 3

- [x] 4.0 Complete testing and verification on Netlify subdomain
  - [x] 4.1 **MANUAL TASK: Perform comprehensive QA testing**
    - **STOP HERE** - User must perform comprehensive testing on Netlify subdomain
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
  - [x] 4.2 Fix any Netlify-specific issues discovered during testing
    - Address build errors if any
    - Fix runtime errors specific to Netlify
    - Update configuration if needed
    - Verify fixes with re-deployment
  - [x] 4.3 Verify all critical features work correctly
    - Authentication and authorization
    - Server Actions functionality
    - Image processing with Sharp
    - Middleware routing
    - API routes
    - Database connections (Supabase)

**Acceptance Criteria:**
- All critical features work correctly on Netlify subdomain
- No blocking errors or issues
- Authentication and authorization work
- Server Actions function correctly
- Image processing works
- All user flows tested and verified

### Domain & DNS Configuration

#### Task Group 5: Custom Domain Setup & Final Verification
**Dependencies:** Task Group 4

- [x] 5.0 Complete custom domain setup and final verification
  - [x] 5.1 **MANUAL TASK: Update DNS configuration**
    - **STOP HERE** - User must update DNS records to point custom domain to Netlify
    - Log into domain registrar or DNS provider
    - Remove or update existing DNS records pointing to Vercel
    - Add Netlify DNS records (A record, CNAME, or ALIAS as recommended by Netlify)
    - Configure SSL certificate in Netlify (automatic via Let's Encrypt)
    - Wait for DNS propagation (can take up to 48 hours, typically 1-2 hours)
    - Verify custom domain works correctly on Netlify
    - Return here after DNS is configured and verified
  - [x] 5.2 Update environment variables for custom domain
    - Update `NEXTAUTH_URL` environment variable in Netlify to use custom domain (if used)
    - Verify all environment variables are correct for production
    - Trigger re-deployment if needed
  - [x] 5.3 **MANUAL TASK: Perform final production testing**
    - **STOP HERE** - User must perform final production testing on custom domain
    - Test all features work correctly with custom domain
    - Verify SSL certificate is active and secure
    - Test authentication flows with custom domain
    - Verify no mixed content warnings (HTTP/HTTPS issues)
    - Test performance and loading times
    - Verify analytics and tracking (if applicable)
    - Return here after final testing is complete
  - [x] 5.4 **MANUAL TASK: Remove Vercel deployment (optional)**
    - **STOP HERE** - User may choose to remove Vercel deployment after successful migration
    - Log into Vercel dashboard
    - Remove project or disconnect repository
    - Cancel Vercel subscription if no longer needed
    - This step is optional and can be done later

**Acceptance Criteria:**
- Custom domain points to Netlify
- SSL certificate is active and secure
- All features work correctly with custom domain
- No mixed content warnings
- Environment variables updated for custom domain
- Vercel deployment removed (optional)

## Execution Order

Recommended implementation sequence:
1. Configuration & Setup (Task Group 1) - Automated configuration file creation
2. Manual Setup Tasks (Task Group 2) - User completes account and repository setup
3. Build & Deployment (Task Group 3) - Initial deployment and verification
4. Testing & Verification (Task Group 4) - Comprehensive testing on subdomain
5. Domain & DNS Configuration (Task Group 5) - Custom domain setup and final verification

## Important Notes

- **Manual Tasks**: Tasks marked as "MANUAL TASK" require user action and include "STOP HERE" checkpoints
- **Testing Checkpoints**: After each manual task, user should verify work before proceeding
- **Parallel Deployment**: Vercel deployment remains active during migration for safety
- **Rollback Plan**: If issues arise, DNS can be reverted to point back to Vercel
- **Environment Variables**: All variables must be manually copied from Vercel to Netlify dashboard
- **DNS Propagation**: Allow 1-48 hours for DNS changes to propagate globally

