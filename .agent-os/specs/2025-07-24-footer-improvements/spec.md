# Footer Improvements Specification

## 1. Overview
Enhance the LiveThrough website footer to improve branding, user engagement, and clarity, while minimizing stylistic changes. The improvements will:
- Replace the logo placeholder with the real logo (matching the header size)
- Add a newsletter signup form
- Remove the "Courses" column
- Add a Sign Up call-to-action (CTA)
- Remove all page links from the "Company" column, keeping only contact info
- Leave the bottom policy links unchanged

---

## 2. Current State Analysis
- The footer currently uses a placeholder shield icon and text for the logo.
- There are four columns: Brand, Courses, Resources, Company.
- The "Courses" column lists course links.
- The "Company" column lists page links and contact info.
- No newsletter signup or Sign Up CTA is present.
- The bottom section contains policy links (to remain unchanged).

---

## 3. Technical Requirements
- **Logo:** Use `/images/livethrough-logo-lockup-red.svg` (as in the header) in the footer, sized to match the header logo.
- **Newsletter Signup:** Add a simple email input and submit button (no backend required yet, just UI).
- **Remove Courses Column:** Delete the entire "Courses" column and adjust grid layout accordingly.
- **Sign Up CTA:** Add a prominent "Sign Up" button or link in the footer (placement: below brand/description or as a new column if space allows).
- **Company Column:** Remove all page links, leaving only:
  - Email: support@livethrough.co
  - Phone: 1-800-SURVIVE
  - Location: Colorado Springs, CO
- **Styling:** Match existing footer/header styles; minimize new CSS.
- **Accessibility:** Ensure all new elements are accessible (labels, aria attributes as needed).

---

## 4. Implementation Plan
1. **Logo Replacement**
   - Replace the shield icon and text with the real logo using the `Image` component.
   - Match the header logo's size and alignment.
2. **Remove Courses Column**
   - Delete the "Courses" column JSX.
   - Adjust grid columns (from 4 to 3, or add newsletter as a new column).
3. **Newsletter Signup**
   - Add a form with an email input and submit button.
   - Place in the brand section or as a new column.
   - Use placeholder logic for now (no backend).
4. **Sign Up CTA**
   - Add a "Sign Up" button styled consistently with the site.
   - Place below the brand/description or in the newsletter area.
   - On click, trigger the same modal/flow as the header Sign Up.
5. **Company Column Cleanup**
   - Remove all page links from the "Company" column.
   - Keep only the contact info section.
6. **Testing & Validation**
   - Check on desktop and mobile.
   - Ensure accessibility and keyboard navigation.
   - Confirm visual consistency with header/footer.
7. **Documentation**
   - Update README or internal docs if needed.

---

## 5. Success Metrics
- Footer displays the real logo, matching header size.
- No "Courses" column present.
- Newsletter signup form is visible and functional (UI only).
- "Sign Up" CTA is present and triggers signup flow.
- "Company" column contains only contact info.
- No visual regressions or accessibility issues.

---

## 6. Testing & Validation
- Visual inspection on all major breakpoints.
- Test tab/keyboard navigation for new elements.
- Confirm "Sign Up" triggers modal/flow.
- Validate that no links remain in "Company" except contact info.
- Check that the logo matches the header in size and appearance.

---

## 7. Risk Mitigation
- **Grid/Layout Issues:** Removing a column may break layout; test on all screen sizes.
- **Logo Sizing:** Ensure logo is not distorted; use same props as header.
- **Newsletter Form:** If backend is added later, ensure form is easily upgradable.
- **CTA Placement:** Ensure "Sign Up" is prominent but not disruptive.
- **Accessibility:** Use semantic HTML and ARIA where needed.

---

## Code Example (Sketch)

```tsx
// ... Brand Section ...
<Image
  src="/images/livethrough-logo-lockup-red.svg"
  alt="LIVETHROUGH"
  width={180}
  height={32}
  className="h-8 w-auto"
/>
<p>Master the skills ...</p>
{/* Newsletter Signup */}
<form className="flex mt-4">
  <input type="email" placeholder="Your email" aria-label="Email" className="..." />
  <button type="submit" className="...">Subscribe</button>
</form>
{/* Sign Up CTA */}
<Button onClick={handleSignUpClick} className="mt-4 ...">Sign Up</Button>

// ... Remove Courses Column ...

// ... Company Section ...
<h3>Company</h3>
<div>
  <Mail ... /> support@livethrough.co
  <Phone ... /> 1-800-SURVIVE
  <MapPin ... /> Colorado Springs, CO
</div>
```

---

## File Structure Changes
- Only `components/LiveThroughFooter.tsx` needs to be updated for this task. 