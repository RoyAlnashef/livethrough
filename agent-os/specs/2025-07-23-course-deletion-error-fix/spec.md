# Spec Requirements Document

> Spec: Course Deletion Error Fix
> Created: 2025-07-23
> Status: Planning

## Overview

Fix the course deletion error in the dashboard that prevents users from deleting courses due to foreign key constraint violations. This will improve user experience by providing proper error handling, clear feedback, and ensuring all related data is cleaned up during deletion.

## User Stories

### Course Deletion Success

As a dashboard user, I want to delete courses without encountering foreign key constraint errors, so that I can manage my course inventory effectively and receive clear feedback about the deletion status.

**Detailed Workflow:**
1. User selects one or more courses for deletion
2. System shows confirmation dialog
3. User confirms deletion
4. System handles all related data cleanup (reviews, recommendations, course_gear, course_skills)
5. System cleans up storage folders
6. User receives success confirmation
7. Course list refreshes automatically

### Error Handling and Feedback

As a dashboard user, I want to receive clear error messages when course deletion fails, so that I understand what went wrong and can take appropriate action.

**Detailed Workflow:**
1. User attempts to delete course
2. If deletion fails, system shows specific error message
3. Error message explains the issue (e.g., "Cannot delete course: It has related data")
4. System provides guidance on how to resolve the issue
5. User can retry or take alternative action

## Spec Scope

1. **Centralized Deletion Function** - Create server action that handles all foreign key relationships and data cleanup
2. **Enhanced Error Handling** - Implement specific error messages and user feedback for different failure scenarios
3. **Database Migration** - Add CASCADE deletion to foreign key constraints for related tables
4. **Storage Cleanup** - Ensure course folders are properly cleaned up after deletion
5. **User Experience Improvements** - Add loading states, progress indicators, and clear success/error feedback

## Out of Scope

- Soft deletion or archiving functionality
- Batch operations optimization for large-scale deletions
- Audit trail implementation
- Recovery tools for accidentally deleted courses
- Background job processing for deletions

## Expected Deliverable

1. Users can successfully delete courses without foreign key constraint errors
2. All related data (reviews, recommendations, course_gear, course_skills) is properly cleaned up
3. Storage folders are cleaned up after course deletion
4. Users receive clear, actionable error messages when deletion fails
5. Loading states and progress indicators provide feedback during deletion process

## Spec Documentation

- Tasks: @.agent-os/specs/2025-07-23-course-deletion-error-fix/tasks.md
- Technical Specification: @.agent-os/specs/2025-07-23-course-deletion-error-fix/sub-specs/technical-spec.md
- Database Schema: @.agent-os/specs/2025-07-23-course-deletion-error-fix/sub-specs/database-schema.md
- Tests Specification: @.agent-os/specs/2025-07-23-course-deletion-error-fix/sub-specs/tests.md 