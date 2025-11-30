# Consolidate Profile Settings into Settings Page

## Overview
Remove the standalone Profile page and integrate profile settings into the existing Settings page to simplify the user interface and reduce navigation complexity.

## Current State
- Profile page exists at `/account/profile` with user information form
- Settings page exists at `/account/settings` with notification, privacy, and danger zone sections
- Account layout has navigation tabs for "My Courses", "Profile", and "Settings"

## Target State
- Remove Profile page entirely
- Add Profile Information section to Settings page
- Update navigation to only show "My Courses" and "Settings" tabs
- Maintain all existing functionality

## Technical Specifications

### Files to Modify

1. **Delete Files:**
   - `app/account/profile/page.tsx` - Remove entire profile page

2. **Update Files:**
   - `app/account/layout.tsx` - Remove Profile navigation tab
   - `app/account/settings/page.tsx` - Add Profile Information section

### Implementation Details

#### 1. Update Account Layout (`app/account/layout.tsx`)
- Remove the Profile navigation link
- Keep only "My Courses" and "Settings" tabs
- Update active state logic to handle only two tabs

#### 2. Update Settings Page (`app/account/settings/page.tsx`)
- Add new "Profile Information" section at the top
- Include all form fields from the original Profile page:
  - Profile picture upload
  - First Name input
  - Last Name input  
  - Email input
  - Phone input
  - Save Changes button
- Maintain consistent styling with existing sections
- Use same dark theme and component styling

#### 3. Profile Information Section Structure
```tsx
{/* Profile Information */}
<div className="bg-zinc-900 p-6 rounded-lg">
  <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
  <div className="space-y-6">
    {/* Profile Picture */}
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-zinc-800"></div>
      <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">
        Change Photo
      </button>
    </div>
    
    {/* Form Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Name, Last Name, Email, Phone inputs */}
    </div>
    
    {/* Save Button */}
    <div className="flex justify-end">
      <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
        Save Changes
      </button>
    </div>
  </div>
</div>
```

## Task Breakdown

### Phase 1: Remove Profile Page
- [ ] Delete `app/account/profile/page.tsx`
- [ ] Update `app/account/layout.tsx` to remove Profile navigation tab
- [ ] Test that navigation works correctly with only two tabs

### Phase 2: Update Settings Page
- [ ] Add Profile Information section to `app/account/settings/page.tsx`
- [ ] Copy all form fields and styling from original Profile page
- [ ] Ensure consistent spacing and layout with existing sections
- [ ] Test form functionality and styling

### Phase 3: Testing & Validation
- [ ] Verify navigation works correctly
- [ ] Test responsive design on mobile and desktop
- [ ] Ensure all form fields are properly styled and functional
- [ ] Validate that no broken links exist

## Success Criteria
- [ ] Profile page is completely removed
- [ ] Settings page contains all profile functionality
- [ ] Navigation shows only "My Courses" and "Settings"
- [ ] All styling is consistent with existing design
- [ ] No console errors or broken functionality
- [ ] Responsive design works on all screen sizes

## Notes
- This is a UI consolidation change with no backend modifications required
- All existing functionality should be preserved
- Focus on maintaining the current design language and user experience
- No database schema changes needed 