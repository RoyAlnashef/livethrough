# Signup Policy Agreement Checkbox Spec

## Overview
Add a required checkbox to all signup forms: "By signing up, I agree to the terms of service, privacy policy, and cookie policy." The checkbox should be checked by default, with a teal background behind the check. Users must check this box to proceed with signup.

## Current State Analysis
- Signup forms currently do **not** require explicit agreement to terms, privacy, or cookie policies.
- No checkbox or related UI is present.
- No validation for policy agreement exists in the signup logic.

## Technical Requirements
- Add a checkbox to all signup forms (magic link and password-based).
- Checkbox label: "By signing up, I agree to the terms of service, privacy policy, and cookie policy."
- Checkbox must be checked by default.
- Checkbox must have a teal background behind the checkmark when checked.
- Checkbox must be required to submit the form (disable submit if unchecked).
- Link each policy in the label to the appropriate route:
  - Terms of Service: `/terms-of-service`
  - Privacy Policy: `/privacy-policy`
  - Cookie Policy: `/cookie-policy`
- Ensure accessibility (label association, keyboard navigation, screen reader support).
- Update form validation to require the checkbox.
- Add tests for UI and validation.

## Implementation Plan
1. **UI Update**
   - Add a small checkbox to signup forms (both magic link and password tabs).
   - Style checkbox (checked by default, teal background).
   - Add teal policy links to label.
2. **Validation**
   - Update form logic to require checkbox.
   - Disable submit if unchecked.
3. **Accessibility**
   - Ensure proper label association and keyboard navigation.
4. **Testing**
   - Add unit and integration tests for UI and validation.
5. **Documentation**
   - Update any relevant documentation/screenshots.

### Timeline
- UI & validation: 1 day
- Accessibility & testing: 1 day
- Docs & review: 0.5 day

## Success Metrics
- Checkbox appears on all signup forms, checked by default.
- Users cannot submit signup without checking the box.
- Policy links are correct and accessible.
- Teal background appears behind checkmark when checked.
- All tests pass.

## Testing & Validation
- Manual testing of signup flows (both methods).
- Automated tests for UI, validation, and accessibility.
- Verify links open correct policy pages.

## Risk Mitigation
- **Risk:** Users may not notice the checkbox.
  - **Mitigation:** Place checkbox above submit button, use clear label, and ensure required validation.
- **Risk:** Styling may not match brand colors.
  - **Mitigation:** Use existing teal from design system or define new variable.
- **Risk:** Accessibility issues.
  - **Mitigation:** Test with screen readers and keyboard navigation. 