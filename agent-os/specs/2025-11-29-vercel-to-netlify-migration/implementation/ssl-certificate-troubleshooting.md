# SSL Certificate Troubleshooting: livethrough.co

## Issue Summary
Netlify shows warning: "livethrough.co doesn't appear to be served by Netlify"
- Certificate exists but cannot be renewed automatically
- Certificate covers: `livethrough.co` and `www.livethrough.co`
- Expires: Feb 27, 2026

## Root Cause Identified ✅
**DNS propagation delay** - The DNS A record has not propagated globally yet.
- Domain is correctly listed in Netlify as primary domain ✓
- DNS records are correctly configured in Squarespace ✓
- DNS propagation shows red X's globally (dnschecker.org) - records haven't propagated yet
- This prevents Netlify from validating the domain and renewing the SSL certificate

## Current DNS Configuration (Squarespace)

### ✅ Correct Records:
- **www CNAME**: `www` → `livethrough.netlify.app` ✓
- **Apex A Record**: `@` → `75.2.60.5` ✓

### ⚠️ Potential Issues:

1. **DNS Propagation Delay**
   - DNS changes can take up to 48 hours to propagate globally
   - TTL is set to 4 hours, so changes should propagate faster
   - The certificate was created "Yesterday" - DNS may not have fully propagated yet

2. **Domain Not Added to Netlify**
   - The domain must be added in Netlify's Domain management before SSL can be provisioned
   - Verify the domain is listed in Netlify dashboard → Domain management

3. **HTTP Response Header Validation**
   - Netlify validates domains by checking HTTP response headers
   - Must see `server: Netlify` in response headers

## Diagnostic Steps

### Step 1: Verify Domain is Added in Netlify
1. Go to Netlify Dashboard → Domain management
2. Verify `livethrough.co` is listed as a custom domain
3. If not listed, click "Add domain alias" and add it

### Step 2: Check HTTP Response Headers
Run this command in your terminal to check if the site is served by Netlify:

```bash
curl -s -v http://livethrough.co 2>&1 | grep -i server
```

**Expected output:** Should show `server: Netlify`

**If you see `server: Netlify`:**
- DNS is correctly pointing to Netlify
- The issue may be with Netlify's validation system
- Try manually renewing the certificate

**If you DON'T see `server: Netlify`:**
- DNS may not have propagated yet
- Check DNS propagation using: https://dnschecker.org/
- Verify the A record is correct

### Step 3: Check DNS Propagation
1. Visit https://dnschecker.org/
2. Enter `livethrough.co` and select "A" record type
3. Check if `75.2.60.5` appears globally
4. If different IPs appear, DNS hasn't fully propagated

### Step 4: Verify Both Domains Point to Netlify
Check both the apex and www subdomain:

```bash
# Check apex domain
curl -s -v http://livethrough.co 2>&1 | grep -i server

# Check www subdomain
curl -s -v http://www.livethrough.co 2>&1 | grep -i server
```

Both should show `server: Netlify`

### Step 5: Check for DNSSEC
Netlify DNS doesn't support DNSSEC. If enabled, it can prevent SSL certificate provisioning.

1. Check if DNSSEC is enabled: https://dnsviz.net/
2. Enter `livethrough.co` and check the DNSSEC status
3. If DNSSEC is enabled, disable it in Squarespace DNS settings

### Step 6: Check for Proxy Services
If your domain goes through Cloudflare, CloudFront, or similar proxy services:
- These can interfere with Netlify's SSL certificate provisioning
- Netlify must handle TLS termination directly
- Temporarily disable proxy/acceleration features during certificate provisioning

## Solutions

### Solution 1: Wait for DNS Propagation ⏳ (CURRENT STATUS)
**This is the current issue - DNS records haven't propagated yet.**

**What's happening:**
- DNS records are correctly configured in Squarespace
- Squarespace's DNS servers need to propagate the changes globally
- This can take anywhere from a few minutes to 48 hours
- With a 4-hour TTL, propagation should be faster, but initial propagation can still take time

**What to do:**
1. **Verify DNS records are saved correctly in Squarespace:**
   - Go back to Squarespace DNS settings
   - Confirm the A record `@` → `75.2.60.5` is still there
   - Confirm the CNAME `www` → `livethrough.netlify.app` is still there
   - If either is missing, re-add them

2. **Wait for propagation (this is the main step):**
   - Check DNS propagation periodically: https://dnschecker.org/#A/livethrough.co
   - Look for green checkmarks instead of red X's
   - Most DNS servers should show `75.2.60.5` within 4-24 hours

3. **Once DNS propagates:**
   - Netlify should automatically detect the domain is served by Netlify
   - The warning should disappear
   - SSL certificate should auto-renew
   - If warning persists, manually click "Renew certificate" in Netlify dashboard

**Expected timeline:**
- **Best case:** 1-4 hours (with 4-hour TTL)
- **Typical:** 12-24 hours
- **Worst case:** Up to 48 hours (rare)

### Solution 2: Manually Renew Certificate
1. Go to Netlify Dashboard → Domain management → HTTPS
2. Find the SSL/TLS certificate section
3. Click "Renew certificate" button
4. Wait a few minutes for renewal to complete

### Solution 3: Verify Domain Configuration
1. In Netlify Dashboard → Domain management
2. Ensure `livethrough.co` is listed
3. Ensure `www.livethrough.co` is listed (or auto-configured)
4. Both should show as "Active"

### Solution 4: Flush DNS Cache
If DNS has propagated but Netlify still can't validate:

1. Use Google Public DNS cache flush: https://developers.google.com/speed/public-dns/cache
2. Enter `livethrough.co` and flush the cache
3. Wait 5-10 minutes
4. Try renewing the certificate again

### Solution 5: Re-add Domain in Netlify
If nothing else works:

1. In Netlify Dashboard → Domain management
2. Remove `livethrough.co` (if listed)
3. Click "Add domain alias"
4. Add `livethrough.co` again
5. Wait for DNS validation
6. SSL certificate should auto-provision

## Verification Checklist

After applying solutions, verify:

- [ ] `curl -s -v http://livethrough.co 2>&1 | grep -i server` shows `server: Netlify`
- [ ] `curl -s -v http://www.livethrough.co 2>&1 | grep -i server` shows `server: Netlify`
- [ ] DNS propagation shows `75.2.60.5` globally (check dnschecker.org)
- [ ] Domain is listed in Netlify Domain management
- [ ] Certificate shows as "Active" (not "Pending" or "Error")
- [ ] Warning message disappears in Netlify dashboard

## Additional Notes

- The certificate was created "Yesterday at 7:24 PM" and updated "Yesterday at 8:07 PM"
- This suggests the certificate was provisioned initially but renewal is failing
- The certificate expires in 3 months (Feb 27, 2026), so there's time to fix this
- Let's Encrypt certificates auto-renew, but only if Netlify can validate the domain

## Next Steps (Current Situation)

### Immediate Actions:
1. ✅ **Verify DNS records in Squarespace are still saved correctly**
   - Double-check the A record and CNAME haven't been removed
   - If they're missing, re-add them

2. ⏳ **Wait for DNS propagation** (this is the current blocker)
   - Monitor propagation at: https://dnschecker.org/#A/livethrough.co
   - Check every few hours to see progress
   - You'll see red X's turn to green checkmarks as it propagates

3. 🔍 **Once DNS starts propagating:**
   - Run: `curl -s -v http://livethrough.co 2>&1 | grep -i server`
   - Should eventually show `server: Netlify`
   - When it does, the Netlify warning should clear automatically

4. 🔄 **If warning persists after DNS propagates:**
   - Go to Netlify Dashboard → Domain management → HTTPS
   - Click "Renew certificate" button manually
   - Wait a few minutes for renewal

### Why This Happens:
- DNS changes don't propagate instantly
- Each DNS server caches records based on TTL (4 hours in your case)
- Global propagation requires all DNS servers worldwide to update their caches
- Netlify can't validate your domain until DNS points to their servers globally

### No Action Needed Right Now:
- Your DNS configuration is correct ✓
- Domain is properly added in Netlify ✓
- You just need to wait for DNS propagation ⏳
- The SSL certificate won't expire for 3 months, so there's no urgency

