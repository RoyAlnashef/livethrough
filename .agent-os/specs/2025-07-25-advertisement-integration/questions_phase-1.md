Questions for Phase 1 Implementation:

1. Ad Slot Density: 
  Q: How many ad slots would you like per page?
    - Marketplace homepage: 1 slots
    - Course detail pages: 1 slot
    - Dashboard pages: 0 slots
    - My Account page: 0 slots
  
  Q: Should we avoid showing ads on certain pages entirely? 
    - Don't show ads on the Dashboard pages or on the My Account page.
----------

2. Ad Placement Preferences:
  Q: Do you prefer ads in the sidebar, between content sections, or both?
    - Marketplace homepage: 
    -- Full-width ad _ After every 9th course card in the card list.
    - Course Detail Page:
    -- Sidebar Ad _ Above the School info card. This ad should scroll naturally with the page.
    -- Full-width ad _ Between the 'course description' block and the 'similar courses' carousel.
  
  Q: Should we prioritize user experience over ad revenue (e.g., fewer but more effective placements)?
    - Yes, prioritize UX over ad revenue
  
  Q: Any specific pages where ads should definitely NOT appear?
    - Dashboard pages
    - My Account pages
----------

3. Mobile vs Desktop Strategy:
  Q. Should we have different ad slot strategies for mobile vs desktop?
    - Not for now, let's see how the desktop layout translates to mobile screens using the natural responsiveness of our front-end framework.

  Q. Any specific mobile considerations (e.g., avoid interstitial ads)?
    - I'm not sure, let's revisit when this comes up.
----------

4. Admin/User Experience:
  Q. Any specific user roles that should never see ads?
    - Admins should never see ads.

----------

5. Design Integration:
  Q. Should ad slots follow the existing design system (dark theme, rounded corners, etc.)?
    - Yes, the slots should follow the app's current design system. We're using the Tailwind 'Zinc' dark theme

  Q. Any specific styling requirements for ad containers?
    - Stick with dark themes and use common ui patterns from the app.
