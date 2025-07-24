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