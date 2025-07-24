# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-07-23-course-deletion-error-fix/spec.md

> Created: 2025-07-23
> Version: 1.0.0

## Changes

### Foreign Key Constraint Modifications

The following foreign key constraints need to be modified to include `ON DELETE CASCADE`:

1. **course_gear.course_id** - Add CASCADE deletion
2. **course_skills.course_id** - Add CASCADE deletion  
3. **recommendations.course_id** - Add CASCADE deletion
4. **reviews.course_id** - Add CASCADE deletion

### Current Constraints

Based on the existing schema in `supabase/migrations/20250623035651_remote_schema.sql`:

```sql
-- Current constraints (no CASCADE)
ALTER TABLE ONLY "public"."course_gear"
    ADD CONSTRAINT "course_gear_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");

ALTER TABLE ONLY "public"."course_skills"
    ADD CONSTRAINT "course_skills_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");

ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");
```

## Specifications

### Migration File

Create new migration file: `supabase/migrations/[timestamp]_add_cascade_deletion.sql`

```sql
-- Migration: Add CASCADE deletion to course-related foreign keys
-- Purpose: Enable automatic deletion of related records when a course is deleted

-- Add CASCADE deletion to course_gear table
ALTER TABLE "public"."course_gear" 
DROP CONSTRAINT "course_gear_course_id_fkey",
ADD CONSTRAINT "course_gear_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

-- Add CASCADE deletion to course_skills table
ALTER TABLE "public"."course_skills" 
DROP CONSTRAINT "course_skills_course_id_fkey",
ADD CONSTRAINT "course_skills_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

-- Add CASCADE deletion to recommendations table
ALTER TABLE "public"."recommendations" 
DROP CONSTRAINT "recommendations_course_id_fkey",
ADD CONSTRAINT "recommendations_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

-- Add CASCADE deletion to reviews table
ALTER TABLE "public"."reviews" 
DROP CONSTRAINT "reviews_course_id_fkey",
ADD CONSTRAINT "reviews_course_id_fkey" 
FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;
```

### Updated Constraints

After migration, the constraints will be:

```sql
-- Updated constraints (with CASCADE)
ALTER TABLE ONLY "public"."course_gear"
    ADD CONSTRAINT "course_gear_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."course_skills"
    ADD CONSTRAINT "course_skills_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;
```

## Rationale

### Why CASCADE Deletion?

1. **Data Integrity**: Ensures that when a course is deleted, all related data is automatically removed
2. **Atomic Operations**: Database handles the deletion of related records in a single transaction
3. **Performance**: More efficient than manual cleanup in application code
4. **Simplicity**: Reduces complexity in application logic
5. **Consistency**: Prevents orphaned records that could cause data inconsistencies

### Deletion Order

The database will automatically handle the deletion order:
1. `bookmarks` (already has CASCADE)
2. `reviews` (new CASCADE)
3. `recommendations` (new CASCADE)
4. `course_skills` (new CASCADE)
5. `course_gear` (new CASCADE)
6. `courses` (main table)

### Performance Considerations

- **Indexes**: Existing indexes on `course_id` columns will optimize deletion performance
- **Transaction Size**: CASCADE operations are atomic and efficient
- **Locking**: Minimal table locking during deletion operations

### Data Integrity Rules

- **Referential Integrity**: Maintained by foreign key constraints
- **Cascade Behavior**: All related records are automatically deleted
- **No Orphaned Records**: Prevents data inconsistencies
- **Atomic Operations**: Either all related data is deleted or none is

### Rollback Considerations

If issues arise with CASCADE deletion:

1. **Immediate Rollback**: Drop and recreate constraints without CASCADE
2. **Data Recovery**: Restore from backup if needed
3. **Application Fallback**: Implement manual cleanup in application code

### Testing Requirements

- Test deletion of courses with various related data scenarios
- Verify that all related records are properly deleted
- Test rollback scenarios
- Validate performance with large datasets 