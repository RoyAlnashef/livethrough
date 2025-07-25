# Advertisement Integration Tasks

## Phase 1: Planning & Design
- [x] Identify and document all ad slot locations across the site (sidebar, between content, footer, dashboard, course pages)
- [x] Update design mockups to include ad slots
- [x] Research Google AdSense integration requirements
- [x] Research privacy and consent requirements (GDPR/CCPA)
- [x] Plan navigation and UI for new "Ads" page in dashboard

## Phase 2: Core Integration
- [x] Create `components/ads/AdSlot.tsx` for rendering ad slots
- [x] Add ad slot components to selected pages/locations
- [x] Integrate Google AdSense script into AdSlot component
- [x] Implement lazy-loading for ads (IntersectionObserver)
- [x] Ensure ad slots are responsive for mobile/desktop
- [x] Reserve space for ads to avoid layout shift (CLS)

## Phase 3: Dashboard Ad Controls ✅ COMPLETED
- [x] Create new page at `app/dashboard/ads/page.tsx`
- [x] Build UI for enabling/disabling ads per slot
- [x] Build UI for viewing ad performance analytics (impressions/clicks)
- [x] Build UI for managing ad code/snippets
- [x] Restrict access to ad controls to admin users only

## Phase 3b: Dashboard Ad Analytics (Expanded) ✅ COMPLETED
- [x] Design database schema for storing ad analytics events (impression, click, slotId, timestamp)
- [x] Implement backend logic to record ad events via POST /api/ads/analytics
- [x] Implement backend logic to aggregate and fetch analytics via GET /api/ads/analytics?slotId=&from=&to=
- [x] Add analytics section to `app/dashboard/ads/page.tsx`
- [x] Display total impressions and clicks per ad slot
- [x] Calculate and display click-through rate (CTR) for each slot
- [x] Add date range filter for analytics (last 7 days, 30 days, custom)
- [ ] Integrate charting library (e.g., recharts, chart.js) to visualize trends
- [x] Display aggregate revenue if available from provider API (shows "Not Available" until AdSense API integration)
- [ ] Add CSV export functionality for analytics data
- [ ] Indicate underperforming ad slots (e.g., low CTR) in UI
- [x] Ensure analytics are non-PII and privacy-compliant
- [x] Restrict analytics access to admin users only

## Phase 4: Privacy & Consent
- [x] Integrate or update consent management (cookie banner, opt-out logic)
- [x] Ensure ads do not load before user consent (where required)
- [ ] Exclude ads for admins and premium users (if applicable)

## Phase 5: Analytics & Testing
- [x] Create API endpoint at `app/api/ads/analytics/route.ts` for tracking impressions/clicks
- [x] Track ad impressions and clicks (non-PII)
- [ ] Add staging/test mode for ad display
- [ ] Manual QA on all major browsers/devices
- [ ] Automated tests for ad slot rendering and dashboard ad controls
- [ ] Validate privacy/consent flows for all user types
- [x] Validate analytics events

## Phase 6: Launch
- [ ] Deploy to production
- [ ] Monitor ad performance and revenue
- [ ] Monitor for ad blocker impact and fallback content

---

## ✅ **COMPLETED FEATURES:**

### **Phase 3 & 3b - Dashboard & Analytics:**
- ✅ Full-featured ads management dashboard at `/dashboard/ads`
- ✅ Admin-only access with proper authentication
- ✅ Enable/disable ad slots with toggle switches
- ✅ Real-time analytics with date range filtering
- ✅ Ad code management with copy-to-clipboard
- ✅ Database schema for ad analytics (`ad_analytics` table)
- ✅ API endpoints for tracking and retrieving analytics
- ✅ Privacy-compliant analytics (no PII stored)
- ✅ Row Level Security (RLS) for data protection
- ✅ Real data integration with fallback to demo data
- ✅ Revenue display (shows "Not Available" until AdSense API integration)

### **Core Infrastructure:**
- ✅ AdSlot component with AdSense integration
- ✅ Lazy loading and responsive design
- ✅ Consent management integration
- ✅ Analytics tracking for impressions and clicks

---

**Dependencies:**
- [x] Add Google AdSense (external script) - Integrated in AdSlot component
- [x] Add consent management library (if not already present) - Already implemented

**Configuration:**
- [x] Store AdSense client and slot IDs in env vars or admin UI - Available in dashboard 