# Course Photos Folder Deletion Bug - Technical Specification

## Problem Description

**Bug**: Course photo folders in the Supabase `course-photos` bucket are being completely deleted when users remove all images from a course during editing, causing the course folder to disappear and breaking image loading for that course.

**Root Cause**: When all images are removed from a course during editing, the current logic in `updateCourseWithImages` function deletes individual image files but doesn't preserve the course folder structure. Supabase Storage automatically removes empty folders, which causes the entire course folder to be deleted.

**Impact**: 
- Course folders disappear from storage
- Future image uploads for the same course fail because the folder no longer exists
- Course images fail to load in the marketplace
- Data inconsistency between database records and actual storage

## Current Implementation Analysis

### Current Flow (Problematic)
1. User edits course and removes all images
2. `CourseForm.removePhoto()` adds image URLs to `deletedImageUrls` array
3. `updateCourseWithImages()` processes the update:
   - Updates course record with empty `photo_url` array
   - Calls `deleteCoursePhoto()` for each deleted image URL
   - Each `deleteCoursePhoto()` call removes individual files from storage
4. Supabase Storage automatically removes the empty course folder
5. Course folder is permanently lost

### Key Code Locations
- **`lib/actions.ts`**: `updateCourseWithImages()` function (lines 138-250)
- **`lib/supabase-storage.ts`**: `deleteCoursePhoto()` function (lines 60-75)
- **`components/dashboard/course-form.tsx`**: `removePhoto()` function (lines 175-195)

## Solution Design

### Approach: Preserve Course Folder Structure

Instead of allowing folders to be deleted, we'll implement a mechanism to preserve the course folder structure even when all images are removed.

### Technical Solution

#### 1. Create Folder Preservation Function

Add a new function in `lib/supabase-storage.ts` to ensure course folders are preserved:

```typescript
export async function ensureCourseFolderExists(
  supabase: SupabaseClient,
  courseId: string
): Promise<void> {
  // Upload a placeholder file to maintain folder structure
  const placeholderPath = `${courseId}/.keep`
  const placeholderContent = Buffer.from('Course folder preserved')
  
  try {
    await supabase.storage
      .from(COURSE_PHOTOS_BUCKET)
      .upload(placeholderPath, placeholderContent, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      })
  } catch (error) {
    console.warn(`Failed to create placeholder for course ${courseId}:`, error)
    // Don't throw - this is not critical
  }
}
```

#### 2. Modify Update Course Logic

Update the `updateCourseWithImages` function in `lib/actions.ts`:

```typescript
// After successful course update, ensure folder exists if all images were removed
if (finalPhotoUrls.length === 0) {
  try {
    await ensureCourseFolderExists(supabase, courseId)
  } catch (error) {
    console.warn('Failed to preserve course folder:', error)
    // Don't fail the entire operation for this
  }
}
```

#### 3. Add Folder Cleanup on Course Deletion

Create a new function to properly clean up course folders when courses are deleted:

```typescript
export async function deleteCourseFolder(
  supabase: SupabaseClient,
  courseId: string
): Promise<void> {
  try {
    // List all files in the course folder
    const { data: files, error: listError } = await supabase.storage
      .from(COURSE_PHOTOS_BUCKET)
      .list(courseId)
    
    if (listError) {
      console.error('Error listing course files:', listError)
      return
    }
    
    if (files && files.length > 0) {
      // Remove all files in the folder
      const filePaths = files.map(file => `${courseId}/${file.name}`)
      const { error: removeError } = await supabase.storage
        .from(COURSE_PHOTOS_BUCKET)
        .remove(filePaths)
      
      if (removeError) {
        console.error('Error removing course files:', removeError)
      }
    }
  } catch (error) {
    console.error('Error deleting course folder:', error)
  }
}
```

#### 4. Update Course Deletion Logic

Modify course deletion in `components/dashboard/course-form.tsx` and `app/dashboard/courses/page.tsx`:

```typescript
// In handleDeleteCourse and handleDeleteConfirmed
import { deleteCourseFolder } from '@/lib/supabase-storage'

// After successful course deletion from database
if (course.id) {
  try {
    await deleteCourseFolder(supabase, course.id)
  } catch (error) {
    console.warn('Failed to clean up course folder:', error)
    // Don't fail the deletion for storage cleanup issues
  }
}
```

## Implementation Tasks

### Task 1: Add Folder Preservation Functions
**File**: `lib/supabase-storage.ts`
**Priority**: High
**Estimated Time**: 1 hour

- [ ] Add `ensureCourseFolderExists()` function
- [ ] Add `deleteCourseFolder()` function
- [ ] Add proper error handling and logging
- [ ] Add TypeScript types and JSDoc comments

### Task 2: Update Course Update Logic
**File**: `lib/actions.ts`
**Priority**: High
**Estimated Time**: 30 minutes

- [ ] Modify `updateCourseWithImages()` to call `ensureCourseFolderExists()` when all images are removed
- [ ] Add proper error handling for folder preservation
- [ ] Ensure folder preservation doesn't block the main update operation

### Task 3: Update Course Deletion Logic
**Files**: 
- `components/dashboard/course-form.tsx`
- `app/dashboard/courses/page.tsx`
**Priority**: Medium
**Estimated Time**: 1 hour

- [ ] Import `deleteCourseFolder` function
- [ ] Update `handleDeleteCourse()` in CourseForm
- [ ] Update `handleDeleteConfirmed()` in CoursesPage
- [ ] Add proper error handling

### Task 4: Add Safety Checks
**File**: `lib/supabase-storage.ts`
**Priority**: Medium
**Estimated Time**: 30 minutes

- [ ] Add validation to prevent deletion of placeholder files during normal image deletion
- [ ] Add function to check if course folder exists
- [ ] Add recovery mechanism for missing folders

### Task 5: Testing
**Priority**: High
**Estimated Time**: 2 hours

- [ ] Test course editing with image removal
- [ ] Test course editing with all images removed
- [ ] Test course deletion
- [ ] Test folder recreation for courses with missing folders
- [ ] Test error scenarios and edge cases

## Error Handling Strategy

### Non-Critical Operations
- Folder preservation and cleanup operations should not fail the main course operations
- Use try-catch blocks with warning logs for storage operations
- Graceful degradation when storage operations fail

### Critical Operations
- Course creation, update, and deletion from database remain critical
- Storage operations are secondary and shouldn't block database operations

## Monitoring and Logging

### Add Logging Points
- Course folder creation/preservation attempts
- Course folder deletion attempts
- Failed storage operations
- Recovery operations for missing folders

### Metrics to Track
- Number of course folders preserved
- Number of course folders deleted
- Failed storage operations
- Recovery operations performed

## Rollback Plan

If issues arise with the new folder preservation logic:

1. **Immediate**: Disable folder preservation by commenting out the `ensureCourseFolderExists()` calls
2. **Short-term**: Revert to previous behavior while investigating
3. **Long-term**: Implement alternative solution if needed

## Future Enhancements

### Potential Improvements
1. **Batch Operations**: Implement batch folder operations for better performance
2. **Folder Monitoring**: Add periodic checks for orphaned folders
3. **Storage Analytics**: Track storage usage and folder statistics
4. **Migration Tool**: Create tool to recreate missing folders for existing courses

### Alternative Approaches Considered
1. **Database Tracking**: Store folder existence in database (rejected - adds complexity)
2. **Storage Policies**: Use Supabase storage policies (rejected - limited control)
3. **Background Jobs**: Use background jobs for folder management (rejected - overkill for current scale)

## Success Criteria

### Functional Requirements
- [ ] Course folders are preserved when all images are removed
- [ ] Course folders are properly cleaned up when courses are deleted
- [ ] No impact on existing course creation and update workflows
- [ ] Recovery mechanism works for courses with missing folders

### Non-Functional Requirements
- [ ] No performance degradation for course operations
- [ ] Proper error handling and logging
- [ ] Backward compatibility with existing courses
- [ ] Minimal storage overhead (placeholder files are tiny)

## Risk Assessment

### Low Risk
- Adding folder preservation logic
- Non-critical storage operations
- Graceful error handling

### Medium Risk
- Changes to course deletion logic
- Potential for orphaned placeholder files

### Mitigation Strategies
- Comprehensive testing before deployment
- Gradual rollout with monitoring
- Clear rollback procedures
- Regular cleanup of orphaned files

## Timeline

**Total Estimated Time**: 5 hours
**Recommended Implementation Order**:
1. Task 1 (Folder preservation functions) - Day 1
2. Task 2 (Update course update logic) - Day 1
3. Task 3 (Update course deletion logic) - Day 2
4. Task 4 (Safety checks) - Day 2
5. Task 5 (Testing) - Day 3

**Deployment Strategy**: Deploy during low-traffic period with monitoring enabled. 