# School Add/Edit Dedicated Pages - Task List

## Phase 1: Create New Page Structure (Day 1)

### Task 1.1: Create Add School Page
- [x] Create directory: `app/dashboard/schools/add/`
- [x] Create file: `app/dashboard/schools/add/page.tsx`
- [x] Implement page structure following course add pattern
- [x] Add state management for form submission
- [x] Implement navigation and error handling
- [x] Add loading states and validation feedback

### Task 1.2: Create Edit School Page
- [ ] Create directory: `app/dashboard/schools/[id]/`
- [ ] Create file: `app/dashboard/schools/[id]/page.tsx`
- [ ] Implement data fetching from Supabase
- [ ] Add form pre-population logic
- [ ] Implement update functionality
- [ ] Add error handling for invalid school IDs
- [ ] Add loading states during data fetch

### Task 1.3: Enhance School Form Component
- [ ] Rename `SchoolForm.tsx` to `school-form.tsx` for consistency
- [ ] Expand layout to full-page design
- [ ] Reorganize form fields into logical sections:
  - [ ] Basic Information (Name, Website, Description)
  - [ ] Contact Information (Email, Phone, Address, Location)
  - [ ] School Logo (Upload with preview)
  - [ ] Social Media (Facebook, Twitter, Instagram, YouTube)
- [ ] Implement two-column responsive layout
- [ ] Add proper form validation with error messages
- [ ] Enhance logo upload with preview and validation
- [ ] Add cancel/save buttons with proper styling

### Task 1.4: Create School Actions
- [ ] Create `addSchoolWithLogo` function in `lib/actions.ts`
- [ ] Create `updateSchoolWithLogo` function in `lib/actions.ts`
- [ ] Implement logo upload and storage logic
- [ ] Add proper error handling and validation
- [ ] Return structured response with success/error messages

## Phase 2: Update Navigation and Integration (Day 2)

### Task 2.1: Update Schools List Page
- [ ] Remove modal-related state variables:
  - [ ] `showDialog`
  - [ ] `dialogMode`
  - [ ] `editSchool`
  - [ ] `submitting`
- [ ] Remove `SchoolFormDialog` import and component
- [ ] Update "Add School" button to navigate to `/dashboard/schools/add`
- [ ] Update "Edit" buttons to navigate to `/dashboard/schools/[id]`
- [ ] Remove `handleAdd`, `handleEdit`, and `handleDialogSubmit` functions
- [ ] Clean up unused imports and dependencies

### Task 2.2: Add Breadcrumb Navigation
- [ ] Implement breadcrumb structure for add page:
  - [ ] Dashboard > Schools > Add School
- [ ] Implement breadcrumb structure for edit page:
  - [ ] Dashboard > Schools > [School Name]
- [ ] Add breadcrumb component to both pages
- [ ] Ensure consistent styling with existing breadcrumbs

### Task 2.3: Update Form Actions and Navigation
- [ ] Implement proper form submission handling
- [ ] Add success toast notifications
- [ ] Add error toast notifications with detailed messages
- [ ] Implement loading states during form submission
- [ ] Add form validation feedback
- [ ] Implement cancel functionality with navigation back to list

### Task 2.4: Update Type Definitions
- [ ] Review and update `School` type in `lib/types.ts` if needed
- [ ] Ensure all form fields are properly typed
- [ ] Add any missing type definitions for new functionality

## Phase 3: Enhanced Features and Cleanup (Day 3)

### Task 3.1: Enhanced Form Features
- [ ] Add field validation with real-time error messages
- [ ] Implement form state persistence (optional)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Enhance logo upload with:
  - [ ] File type validation
  - [ ] File size validation
  - [ ] Image preview
  - [ ] Remove/replace functionality
- [ ] Add social media URL validation
- [ ] Implement required field indicators

### Task 3.2: Remove Deprecated Components
- [ ] Delete `components/dashboard/SchoolFormDialog.tsx`
- [ ] Remove any remaining references to the dialog component
- [ ] Clean up unused imports across the codebase
- [ ] Update any documentation referencing the old modal
- [ ] Remove unused state and functions from schools list page

### Task 3.3: Testing and Validation
- [ ] Test Add School Flow:
  - [ ] Navigate to `/dashboard/schools/add`
  - [ ] Fill out all required fields
  - [ ] Upload school logo
  - [ ] Submit form and verify creation
  - [ ] Verify redirect to schools list
  - [ ] Verify success toast notification

- [ ] Test Edit School Flow:
  - [ ] Navigate to `/dashboard/schools/[id]`
  - [ ] Verify form pre-population
  - [ ] Modify fields and submit
  - [ ] Verify updates in database
  - [ ] Test logo replacement
  - [ ] Verify success toast notification

- [ ] Test Navigation:
  - [ ] Test breadcrumb navigation
  - [ ] Verify back/cancel functionality
  - [ ] Test direct URL access
  - [ ] Verify proper error handling for invalid IDs

- [ ] Test Database Operations:
  - [ ] Test school creation with logo upload
  - [ ] Test school updates with logo replacement
  - [ ] Verify data integrity
  - [ ] Test error handling for database failures

- [ ] Test UI/UX:
  - [ ] Test responsive design on mobile/tablet
  - [ ] Verify form validation messages
  - [ ] Test loading states and error handling
  - [ ] Verify toast notifications
  - [ ] Test accessibility features

### Task 3.4: Performance and Optimization
- [ ] Optimize form rendering performance
- [ ] Implement proper loading states
- [ ] Add error boundaries for better error handling
- [ ] Optimize image upload and preview
- [ ] Ensure proper cleanup of file objects and URLs

## Additional Tasks

### Task 4.1: Documentation Updates
- [ ] Update any internal documentation
- [ ] Update README if needed
- [ ] Document new routing structure
- [ ] Document form validation rules

### Task 4.2: Code Review and Refactoring
- [ ] Review code for consistency with existing patterns
- [ ] Ensure proper error handling throughout
- [ ] Verify TypeScript types are correct
- [ ] Check for any code duplication
- [ ] Ensure proper component separation

### Task 4.3: Final Testing
- [ ] End-to-end testing of complete user flows
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance testing
- [ ] Security testing for file uploads

## Success Criteria

### Functional Requirements
- [ ] Users can add new schools via dedicated page
- [ ] Users can edit existing schools via dedicated page
- [ ] Logo upload functionality works correctly
- [ ] Form validation prevents invalid submissions
- [ ] Navigation between pages works smoothly
- [ ] Success/error messages are displayed appropriately

### Technical Requirements
- [ ] Code follows established patterns
- [ ] No console errors or warnings
- [ ] Proper TypeScript typing throughout
- [ ] Responsive design works on all screen sizes
- [ ] Performance is acceptable (no lag on form interactions)

### User Experience Requirements
- [ ] Form layout is intuitive and easy to use
- [ ] Loading states provide clear feedback
- [ ] Error messages are helpful and actionable
- [ ] Navigation is consistent with rest of application
- [ ] Form fields are properly organized and labeled

## Notes

- Keep the old modal code until new pages are fully tested and working
- Test thoroughly before removing deprecated components
- Monitor for any issues after deployment
- Consider adding feature flags for gradual rollout if needed
- Ensure backward compatibility during transition period 