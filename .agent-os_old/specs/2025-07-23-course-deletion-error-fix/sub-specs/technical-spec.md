# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-07-23-course-deletion-error-fix/spec.md

> Created: 2025-07-23
> Version: 1.0.0

## Technical Requirements

- **Foreign Key Constraint Handling** - Properly handle all foreign key relationships when deleting courses
- **Error Mapping** - Map database error codes to user-friendly error messages
- **Storage Cleanup** - Ensure course folders are cleaned up from Supabase storage
- **User Feedback** - Provide loading states, progress indicators, and clear success/error messages
- **Data Integrity** - Maintain referential integrity during deletion process
- **Performance** - Complete deletion operations within reasonable time (< 5 seconds)

## Approach Options

**Option A:** Manual Cleanup in Application Code
- Pros: Full control over deletion order, explicit error handling, no database changes required
- Cons: More complex application logic, potential for race conditions, harder to maintain

**Option B:** Database CASCADE + Application Enhancement (Selected)
- Pros: Database handles referential integrity, simpler application logic, better performance, atomic operations
- Cons: Requires database migration, less control over deletion order

**Rationale:** Option B provides better data integrity guarantees and simpler application logic. The database migration is straightforward and the CASCADE deletion ensures atomic operations.

## External Dependencies

- **Supabase Service Role Key** - Required for server-side deletion operations
- **Justification:** Server actions need elevated permissions to perform deletion operations and access storage buckets

## Implementation Details

### Centralized Deletion Function

Create `deleteCourseWithCleanup()` in `lib/actions.ts`:

```typescript
export async function deleteCourseWithCleanup(courseId: string): Promise<ActionResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Delete course (CASCADE will handle related data)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
    
    if (error) {
      console.error('Error deleting course:', error)
      return {
        success: false,
        message: getErrorMessage(error)
      }
    }

    // Clean up storage folder
    try {
      await deleteCourseFolder(supabase, courseId)
    } catch (storageError) {
      console.warn(`Failed to clean up course folder for ${courseId}:`, storageError)
      // Don't fail the deletion for storage cleanup issues
    }

    return {
      success: true,
      message: 'Course deleted successfully'
    }

  } catch (error) {
    console.error('Unexpected error in deleteCourseWithCleanup:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred during deletion'
    }
  }
}
```

### Error Mapping Function

```typescript
const getErrorMessage = (error: any): string => {
  if (error?.code === '23503') {
    return 'Cannot delete course: It has related data that must be removed first';
  }
  if (error?.code === '23505') {
    return 'Cannot delete course: Duplicate entry detected';
  }
  if (error?.code === '42P01') {
    return 'Cannot delete course: Database table not found';
  }
  if (error?.message?.includes('permission')) {
    return 'Cannot delete course: Insufficient permissions';
  }
  return error?.message || 'An unknown error occurred';
};
```

### Frontend Integration

Update `handleDeleteConfirmed()` in `app/dashboard/courses/page.tsx`:

```typescript
const handleDeleteConfirmed = async () => {
  setShowDeleteDialog(false);
  
  try {
    toast.loading('Deleting course(s)...');
    
    const results = await Promise.allSettled(
      pendingDeleteIds.map(id => deleteCourseWithCleanup(id))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
    
    if (successful.length > 0) {
      toast.success(`Successfully deleted ${successful.length} course(s)`);
    }
    
    if (failed.length > 0) {
      const errorMessages = failed.map(r => 
        r.status === 'rejected' ? 'Unknown error' : r.value.message
      );
      toast.error(`Failed to delete ${failed.length} course(s): ${errorMessages.join(', ')}`);
    }
    
    await fetchCourses();
    setSelectedRows(new Set());
    
  } catch (error) {
    console.error('Error in handleDeleteConfirmed:', error);
    toast.error('An unexpected error occurred during deletion');
  }
};
```

## Database Migration

Create migration to add CASCADE deletion:

```sql
-- Add CASCADE deletion to all course-related foreign keys
ALTER TABLE "public"."course_gear" 
DROP CONSTRAINT "course_gear_course_id_fkey",
ADD CONSTRAINT "course_gear_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

ALTER TABLE "public"."course_skills" 
DROP CONSTRAINT "course_skills_course_id_fkey",
ADD CONSTRAINT "course_skills_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

ALTER TABLE "public"."recommendations" 
DROP CONSTRAINT "recommendations_course_id_fkey",
ADD CONSTRAINT "recommendations_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

ALTER TABLE "public"."reviews" 
DROP CONSTRAINT "reviews_course_id_fkey",
ADD CONSTRAINT "reviews_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;
```

## Performance Considerations

- **Batch Operations**: Use `Promise.allSettled()` for multiple course deletions
- **Storage Cleanup**: Don't block deletion for storage cleanup failures
- **Error Handling**: Provide immediate feedback for user actions
- **Database Optimization**: CASCADE deletion is more efficient than manual cleanup

## Security Considerations

- **Service Role Key**: Only use service role key in server actions
- **Input Validation**: Validate course IDs before deletion
- **Permission Checks**: Ensure user has permission to delete courses
- **Audit Trail**: Log deletion operations for security monitoring 