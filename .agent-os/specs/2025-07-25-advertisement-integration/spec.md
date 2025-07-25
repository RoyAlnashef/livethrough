# Advertisement Integration Spec

## 1. Overview
Implement an advertisement system on the site to generate revenue. This will allow for the display of ads in designated areas, support for multiple ad providers (e.g., Google AdSense, direct partners), and provide admin controls for managing ad placements and performance.

## 2. Current State Analysis
- No advertisement system exists on the site.
- No ad-related components, API endpoints, or admin controls are present.
- No user privacy or consent mechanisms for ads are implemented.

## 3. Technical Requirements
- **Ad Placement:**
  - Define ad slots/locations (e.g., sidebar, between content, footer, dashboard, course pages).
  - Responsive design for mobile/desktop.
- **Ad Providers:**
  - Support for Google AdSense (MVP).
  - Extensible for future direct ad partners.
- **Admin Controls:**
  - Add a new "Ads" page to the existing dashboard (alongside Courses, Schools, Students, etc.).
  - UI for enabling/disabling ads, viewing performance, and managing ad code/snippets is accessible from this dashboard page.
- **User Experience:**
  - Respect user privacy and consent (GDPR/CCPA compliance).
  - Do not show ads to admins or premium users (if applicable).
- **Performance:**
  - Lazy-load ads to minimize impact on page load.
  - Avoid layout shift (CLS) by reserving ad space.
- **Analytics:**
  - Track ad impressions and clicks (basic, non-PII).
- **Testing:**
  - Staging/test mode for ad display.

## 4. Implementation Plan
**Phase 1: Planning & Design (1 week)**
- Identify ad slots and update design mockups.
- Research AdSense integration and privacy requirements.
- Plan integration of ad controls as a new page in the existing dashboard navigation.

**Phase 2: Core Integration (2 weeks)**
- Implement ad slot components (React components for ad containers).
- Integrate Google AdSense in selected slots.
- Add lazy-loading and responsive support.

**Phase 3: Dashboard Ad Controls (1 week)**
- Add a new "Ads" page to the dashboard (e.g., `/dashboard/ads`).
- Build UI for ad management (enable/disable slots, view analytics, manage ad code) within this page.

**Phase 4: Privacy & Consent (1 week)**
- Integrate consent management (cookie banner update, opt-out logic).
- Ensure compliance with privacy laws.

**Phase 5: Analytics & Testing (1 week)**
- Add basic analytics for impressions/clicks.
- Test on staging with test ads.
- QA and bugfixes.

**Phase 6: Launch (1 week)**
- Deploy to production.
- Monitor performance and revenue.

## 5. Success Metrics
- Ads display correctly in all designated slots on all devices.
- No significant impact on site performance (CLS, LCP, FID within acceptable limits).
- Admins can manage ad slots and view basic analytics.
- Privacy compliance (consent required before ad load in relevant regions).
- Revenue generated meets or exceeds target.

## 6. Testing & Validation
- Manual QA on all major browsers/devices.
- Automated tests for ad slot rendering and admin controls.
- Privacy/consent flows tested for all user types.
- Analytics validated against expected events.

## 7. Risk Mitigation
- **Ad Blockers:** Use fallback content and monitor ad-block rates.
- **Performance:** Lazy-load ads, reserve space to avoid layout shift.
- **Privacy:** Integrate with existing consent management; do not load ads before consent.
- **Revenue Fluctuation:** Support multiple providers for future flexibility.
- **User Experience:** Limit ad density, avoid intrusive formats.

---

### Code Examples

**Ad Slot Component (React, MVP):**
```tsx
// components/ads/AdSlot.tsx
import React from 'react';

export function AdSlot({ slotId, className }: { slotId: string; className?: string }) {
  // Only render ad if enabled and user has consent (pseudo-code)
  // ...
  return (
    <div className={className} id={`ad-slot-${slotId}`}
         style={{ minHeight: 90, width: '100%' }}>
      {/* AdSense script or fallback */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXX"
           data-ad-slot="{slotId}"
           data-ad-format="auto" />
    </div>
  );
}
```

**Dashboard Ad Controls Example:**
```tsx
// app/dashboard/ads/page.tsx
// UI for toggling ad slots, viewing analytics, and managing ad code
// ---
// Analytics Section Details:
// - Display total impressions and clicks per ad slot
// - Show click-through rate (CTR) for each slot
// - Filter analytics by date range (e.g., last 7 days, 30 days, custom)
// - Visualize trends with simple charts (e.g., line or bar charts)
// - Show aggregate revenue (if available from provider API)
// - Export analytics data as CSV
// - Indicate if ad slot is underperforming (e.g., low CTR)
//
// Data Collection:
// - Impressions and clicks tracked via internal API endpoint (see below)
// - Data stored in database with timestamp, slotId, event type
// - Analytics queries aggregate by slot and date
//
// Technical Requirements:
// - API endpoint: POST /api/ads/analytics (record event)
// - API endpoint: GET /api/ads/analytics?slotId=&from=&to= (fetch analytics)
// - Use charting library (e.g., recharts, chart.js) for dashboard visualization
// - Ensure analytics are non-PII and privacy-compliant
// - Restrict analytics access to admin users only
```

**File Structure Changes:**
```
app/
  dashboard/
    ads/
      page.tsx
components/
  ads/
    AdSlot.tsx
    index.ts
```

**API Endpoint Example:**
```
// app/api/ads/analytics/route.ts
// POST: { slotId, event: 'impression' | 'click' }
```

**Dependencies:**
- Google AdSense (external script)
- Consent management library (if not already present)

**Configuration:**
- AdSense client and slot IDs in env vars or admin UI

**Performance:**
- Use IntersectionObserver for lazy-loading
- Reserve space for ads to avoid layout shift 