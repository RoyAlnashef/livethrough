# Tests Specification

This is the tests coverage details for the spec detailed in @.agent-os/specs/2025-07-23-course-deletion-error-fix/spec.md

> Created: 2025-07-23
> Version: 1.0.0

## Test Coverage

### Unit Tests

**deleteCourseWithCleanup Function**
- Test successful course deletion with CASCADE handling
- Test error handling for foreign key constraint violations
- Test error handling for permission denied scenarios
- Test error handling for network failures
- Test storage cleanup success and failure scenarios
- Test error message mapping for different error codes

**getErrorMessage Function**
- Test mapping of PostgreSQL error code 23503 (foreign key violation)
- Test mapping of PostgreSQL error code 23505 (unique constraint violation)
- Test mapping of PostgreSQL error code 42P01 (table not found)
- Test mapping of permission-related error messages
- Test fallback for unknown error types

**Frontend Deletion Handlers**
- Test handleDeleteConfirmed with single course deletion
- Test handleDeleteConfirmed with bulk course deletion
- Test error handling and user feedback display
- Test loading states and progress indicators
- Test toast notification display for success and error cases

### Integration Tests

**Course Deletion Workflow**
- Test complete deletion workflow from UI to database
- Test deletion of course with reviews
- Test deletion of course with recommendations
- Test deletion of course with course_gear relationships
- Test deletion of course with course_skills relationships
- Test deletion of course with multiple related data types
- Test deletion of course with storage files

**Database Migration**
- Test CASCADE deletion constraints work correctly
- Test foreign key relationships are maintained
- Test deletion order is handled properly by database
- Test rollback of migration if needed

**Error Scenarios**
- Test deletion failure due to insufficient permissions
- Test deletion failure due to network issues
- Test partial deletion success (some courses deleted, others failed)
- Test storage cleanup failure doesn't block database deletion

### Feature Tests

**User Experience**
- Test user can successfully delete a single course
- Test user can successfully delete multiple courses
- Test user receives clear error messages when deletion fails
- Test user sees loading indicators during deletion process
- Test user gets confirmation of successful deletions
- Test course list refreshes after successful deletion

**Edge Cases**
- Test deletion of course with no related data
- Test deletion of course with maximum related data
- Test deletion during high system load
- Test deletion with concurrent user access
- Test deletion of non-existent course ID

### Mocking Requirements

**Supabase Client**
- Mock successful course deletion responses
- Mock foreign key constraint violation errors
- Mock permission denied errors
- Mock network timeout errors
- Mock storage cleanup success and failure

**Storage Operations**
- Mock deleteCourseFolder success
- Mock deleteCourseFolder failure
- Mock file listing operations
- Mock file removal operations

**Toast Notifications**
- Mock toast.loading calls
- Mock toast.success calls
- Mock toast.error calls
- Verify correct messages are displayed

## Test Implementation

### Unit Test Examples

```typescript
// Test deleteCourseWithCleanup function
describe('deleteCourseWithCleanup', () => {
  it('should successfully delete course with CASCADE handling', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null })
    };
    
    const result = await deleteCourseWithCleanup('course-id');
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('Course deleted successfully');
  });

  it('should handle foreign key constraint violations', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ 
        error: { code: '23503', message: 'foreign key violation' }
      })
    };
    
    const result = await deleteCourseWithCleanup('course-id');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Cannot delete course: It has related data that must be removed first');
  });
});

// Test getErrorMessage function
describe('getErrorMessage', () => {
  it('should map PostgreSQL error codes correctly', () => {
    expect(getErrorMessage({ code: '23503' })).toBe('Cannot delete course: It has related data that must be removed first');
    expect(getErrorMessage({ code: '23505' })).toBe('Cannot delete course: Duplicate entry detected');
    expect(getErrorMessage({ code: '42P01' })).toBe('Cannot delete course: Database table not found');
  });
});
```

### Integration Test Examples

```typescript
// Test complete deletion workflow
describe('Course Deletion Integration', () => {
  it('should delete course and all related data', async () => {
    // Setup test data
    const courseId = 'test-course-id';
    await createTestCourseWithRelatedData(courseId);
    
    // Perform deletion
    const result = await deleteCourseWithCleanup(courseId);
    
    // Verify results
    expect(result.success).toBe(true);
    expect(await courseExists(courseId)).toBe(false);
    expect(await relatedDataExists(courseId)).toBe(false);
    expect(await storageFolderExists(courseId)).toBe(false);
  });
});
```

### Feature Test Examples

```typescript
// Test user interface
describe('Course Deletion UI', () => {
  it('should show loading state and success message', async () => {
    render(<CoursesPage />);
    
    // Select course for deletion
    const deleteButton = screen.getByText('Delete Course');
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    // Verify loading state
    expect(screen.getByText('Deleting course(s)...')).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Successfully deleted 1 course(s)')).toBeInTheDocument();
    });
  });
});
```

## Test Data Setup

### Test Course Creation

```typescript
const createTestCourseWithRelatedData = async (courseId: string) => {
  // Create course
  await supabase.from('courses').insert({
    id: courseId,
    title: 'Test Course',
    status: 'Draft'
  });
  
  // Create related data
  await supabase.from('reviews').insert({
    course_id: courseId,
    user_id: 'test-user',
    rating: 5
  });
  
  await supabase.from('recommendations').insert({
    course_id: courseId,
    user_id: 'test-user'
  });
  
  // Create storage files
  await createTestStorageFiles(courseId);
};
```

### Test Data Cleanup

```typescript
const cleanupTestData = async (courseId: string) => {
  // Clean up database records
  await supabase.from('reviews').delete().eq('course_id', courseId);
  await supabase.from('recommendations').delete().eq('course_id', courseId);
  await supabase.from('courses').delete().eq('id', courseId);
  
  // Clean up storage files
  await deleteTestStorageFiles(courseId);
};
```

## Performance Testing

### Load Testing

- Test deletion performance with courses having various amounts of related data
- Test bulk deletion performance with multiple courses
- Test concurrent deletion operations
- Test deletion performance under high system load

### Stress Testing

- Test deletion with maximum related data (100+ reviews, recommendations, etc.)
- Test deletion during database maintenance
- Test deletion with network latency
- Test deletion with storage service issues

## Test Environment Setup

### Database Setup

- Use test database with same schema as production
- Create test data fixtures for various scenarios
- Implement database cleanup between tests
- Use transaction rollback for test isolation

### Storage Setup

- Use test storage bucket for file operations
- Create test file fixtures
- Implement storage cleanup between tests
- Mock external storage services when needed

### Mock Configuration

- Configure Supabase client mocks
- Configure toast notification mocks
- Configure file system mocks
- Configure network request mocks 