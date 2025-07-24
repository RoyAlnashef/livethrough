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
- [x] Create directory: `app/dashboard/schools/[id]/`
- [x] Create file: `app/dashboard/schools/[id]/page.tsx`
- [x] Implement data fetching from Supabase
- [x] Add form pre-population logic
- [x] Implement update functionality
- [x] Add error handling for invalid school IDs
- [x] Add loading states during data fetch

### Task 1.3: Enhance School Form Component
- [x] Rename `SchoolForm.tsx` to `school-form.tsx` for consistency
- [x] Expand layout to full-page design
- [x] Reorganize form fields into logical sections:
  - [x] Basic Information (Name, Website, Description)
  - [x] Contact Information (Email, Phone, Address, Location)
  - [x] School Logo (Upload with preview)
  - [x] Social Media (Facebook, Twitter, Instagram, YouTube, TikTok)
- [x] Implement two-column responsive layout
- [x] Add proper form validation with error messages
- [x] Enhance logo upload with preview and validation
- [x] Add cancel/save buttons with proper styling

### Task 1.4: Create School Actions
- [x] Create `addSchoolWithLogo` function in `lib/actions.ts`
- [x] Create `updateSchoolWithLogo` function in `lib/actions.ts`
- [x] Implement logo upload and storage logic
- [x] Add proper error handling and validation
- [x] Return structured response with success/error messages

## Phase 2: Update Navigation and Integration (Day 2)

### Task 2.1: Update Schools List Page
- [x] Remove modal-related state variables:
  - [x] `showDialog`
  - [x] `dialogMode`
  - [x] `editSchool`
  - [x] `submitting`
- [x] Remove `SchoolFormDialog` import and component
- [x] Update "Add School" button to navigate to `/dashboard/schools/add`
- [x] Update "Edit" buttons to navigate to `/dashboard/schools/[id]`
- [x] Remove `handleAdd`, `handleEdit`, and `handleDialogSubmit` functions
- [x] Clean up unused imports and dependencies

### Task 2.2: Add Breadcrumb Navigation
- [x] Implement breadcrumb structure for add page:
  - [x] Dashboard > Schools > Add School
- [x] Implement breadcrumb structure for edit page:
  - [x] Dashboard > Schools > [School Name]
- [x] Add breadcrumb component to both pages
- [x] Ensure consistent styling with existing breadcrumbs

### Task 2.3: Update Form Actions and Navigation
- [x] Implement proper form submission handling
- [x] Add success toast notifications
- [x] Add error toast notifications with detailed messages
- [x] Implement loading states during form submission
- [x] Add form validation feedback
- [x] Implement cancel functionality with navigation back to list

### Task 2.4: Update Type Definitions
- [x] Review and update `School` type in `lib/types.ts` if needed
- [x] Ensure all form fields are properly typed
- [x] Add any missing type definitions for new functionality

## Phase 3: Enhanced Features and Cleanup (Day 3)

### Task 3.1: Enhanced Form Features
- [x] Add field validation with real-time error messages
- [x] Implement form state persistence (optional)
- [x] Enhance logo upload with:
  - [x] File type validation
  - [x] File size validation
  - [x] Image preview
  - [x] Remove/replace functionality
- [x] Add social media URL validation

### Task 3.2: Remove Deprecated Components
- [x] Delete `components/dashboard/SchoolFormDialog.tsx`
- [x] Remove any remaining references to the dialog component
- [x] Clean up unused imports across the codebase
- [x] Update any documentation referencing the old modal
- [x] Remove unused state and functions from schools list page

### Task 3.3: Testing and Validation
- [x] Test Add School Flow:
  - [x] Navigate to `/dashboard/schools/add`
  - [x] Fill out all required fields
  - [x] Upload school logo
  - [x] Submit form and verify creation
  - [x] Verify redirect to schools list
  - [x] Verify success toast notification

- [x] Test Edit School Flow:
  - [x] Navigate to `/dashboard/schools/[id]`
  - [x] Verify form pre-population
  - [x] Modify fields and submit
  - [x] Verify updates in database
  - [x] Test logo replacement
  - [x] Verify success toast notification

- [x] Test Navigation:
  - [x] Test breadcrumb navigation
  - [x] Verify back/cancel functionality
  - [x] Test direct URL access
  - [x] Verify proper error handling for invalid IDs

- [x] Test Database Operations:
  - [x] Test school creation with logo upload
  - [x] Test school updates with logo replacement
  - [x] Verify data integrity
  - [x] Test error handling for database failures

- [x] Test UI/UX:
  - [x] Test responsive design on mobile/tablet
  - [x] Verify form validation messages
  - [x] Test loading states and error handling
  - [x] Verify toast notifications
  - [x] Test accessibility features



## Additional Tasks

### Task 4.1: Documentation Updates
- [x] Update any internal documentation
- [x] Update README if needed
- [x] Document new routing structure
- [x] Document form validation rules

### Task 4.2: Code Review and Refactoring
- [x] Review code for consistency with existing patterns
- [x] Ensure proper error handling throughout
- [x] Verify TypeScript types are correct
- [x] Check for any code duplication
- [x] Ensure proper component separation

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

- All validation is now handled by shared helpers in `lib/validation.ts` for consistency across forms.
- All documentation is up to date with the new full-page form structure and removal of the old modal. 