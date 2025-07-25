# Advertisement Integration Tasks

## Phase 1: Planning & Design
- [ ] Identify and document all ad slot locations across the site (sidebar, between content, footer, dashboard, course pages)
- [ ] Update design mockups to include ad slots
- [ ] Research Google AdSense integration requirements
- [ ] Research privacy and consent requirements (GDPR/CCPA)
- [ ] Plan navigation and UI for new "Ads" page in dashboard

## Phase 2: Core Integration
- [ ] Create `components/ads/AdSlot.tsx` for rendering ad slots
- [ ] Add ad slot components to selected pages/locations
- [ ] Integrate Google AdSense script into AdSlot component
- [ ] Implement lazy-loading for ads (IntersectionObserver)
- [ ] Ensure ad slots are responsive for mobile/desktop
- [ ] Reserve space for ads to avoid layout shift (CLS)

## Phase 3: Dashboard Ad Controls
- [ ] Create new page at `app/dashboard/ads/page.tsx`
- [ ] Build UI for enabling/disabling ads per slot
- [ ] Build UI for viewing ad performance analytics (impressions/clicks)
- [ ] Build UI for managing ad code/snippets
- [ ] Restrict access to ad controls to admin users only

## Phase 3b: Dashboard Ad Analytics (Expanded)
- [ ] Design database schema for storing ad analytics events (impression, click, slotId, timestamp)
- [ ] Implement backend logic to record ad events via POST /api/ads/analytics
- [ ] Implement backend logic to aggregate and fetch analytics via GET /api/ads/analytics?slotId=&from=&to=
- [ ] Add analytics section to `app/dashboard/ads/page.tsx`
- [ ] Display total impressions and clicks per ad slot
- [ ] Calculate and display click-through rate (CTR) for each slot
- [ ] Add date range filter for analytics (last 7 days, 30 days, custom)
- [ ] Integrate charting library (e.g., recharts, chart.js) to visualize trends
- [ ] Display aggregate revenue if available from provider API
- [ ] Add CSV export functionality for analytics data
- [ ] Indicate underperforming ad slots (e.g., low CTR) in UI
- [ ] Ensure analytics are non-PII and privacy-compliant
- [ ] Restrict analytics access to admin users only

## Phase 4: Privacy & Consent
- [ ] Integrate or update consent management (cookie banner, opt-out logic)
- [ ] Ensure ads do not load before user consent (where required)
- [ ] Exclude ads for admins and premium users (if applicable)

## Phase 5: Analytics & Testing
- [ ] Create API endpoint at `app/api/ads/analytics/route.ts` for tracking impressions/clicks
- [ ] Track ad impressions and clicks (non-PII)
- [ ] Add staging/test mode for ad display
- [ ] Manual QA on all major browsers/devices
- [ ] Automated tests for ad slot rendering and dashboard ad controls
- [ ] Validate privacy/consent flows for all user types
- [ ] Validate analytics events

## Phase 6: Launch
- [ ] Deploy to production
- [ ] Monitor ad performance and revenue
- [ ] Monitor for ad blocker impact and fallback content

---

**Dependencies:**
- [ ] Add Google AdSense (external script)
- [ ] Add consent management library (if not already present)

**Configuration:**
- [ ] Store AdSense client and slot IDs in env vars or admin UI 