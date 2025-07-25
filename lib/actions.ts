'use server'

import { createClient } from '@supabase/supabase-js'
import { processImage } from './image-processing'
import { uploadCoursePhoto, deleteCoursePhoto, ensureCourseFolderExists, deleteCourseFolder, uploadSchoolLogo } from './supabase-storage'
import { Course, School } from './types'
import { revalidatePath } from 'next/cache'

export interface ActionResponse {
  success: boolean
  message: string
  data?: {
    courseId?: string
    photoUrls?: string[]
    newPhotoUrls?: string[]
    deletedImageUrls?: string[]
  }
}

export async function addCourseWithImages(formData: FormData): Promise<ActionResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Extract course data
    const courseDataString = formData.get('courseData') as string
    if (!courseDataString) {
      return {
        success: false,
        message: 'Course data is required'
      }
    }

    const courseData: Course = JSON.parse(courseDataString)
    // Fix: ensure school_id is null if not set
    const insertCourseData = {
      ...courseData,
      school_id: !courseData.school_id ? null : courseData.school_id,
    }
    
    // Extract image files
    const imageFiles = formData.getAll('newImages') as File[]
    
    // 1. Create course without photos to get an ID
    const { data: courseDataResult, error: insertError } = await supabase
      .from('courses')
      .insert([{ ...insertCourseData, photo_url: [] }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating course:', insertError)
      return {
        success: false,
        message: `Failed to create course: ${insertError.message}`
      }
    }

    if (!courseDataResult) {
      return {
        success: false,
        message: 'Failed to create course: No data returned'
      }
    }

    const courseId = courseDataResult.id
    let photoUrls: string[] = []

    // 2. Process and upload images if any
    if (imageFiles.length > 0) {
      try {
        // Process images with Sharp
        const processedImages = await Promise.all(
          imageFiles.map(file => processImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 80,
            format: 'webp'
          }))
        )

        // Upload processed images to Supabase storage
        const uploadPromises = processedImages.map(async (processedImage) => {
          return uploadCoursePhoto(
            supabase,
            processedImage.buffer,
            processedImage.fileName,
            processedImage.mimeType,
            courseId
          );
        });

        photoUrls = await Promise.all(uploadPromises)
      } catch (error) {
        console.error('Error processing/uploading images:', error)
        // Even though the course record was created, the overall action failed
        // because the primary part (image upload) did not complete.
        return {
          success: false,
          message: error instanceof Error ? `Course created, but image upload failed: ${error.message}` : 'Course created, but image upload failed due to an unknown error.'
        }
      }
    }

    // 3. Update course with photo URLs if any were uploaded
    if (photoUrls.length > 0) {
      const { error: updateError } = await supabase
        .from('courses')
        .update({ photo_url: photoUrls })
        .eq('id', courseId)
      
      if (updateError) {
        console.error('Error updating course with photos:', updateError)
        // Course was created successfully, but photo URLs couldn't be saved
        // This is not a critical error, so we'll still return success
      }
    }

    // Revalidate the courses page to show the new course
    revalidatePath('/dashboard/courses')
    revalidatePath('/account/courses')

    return {
      success: true,
      message: `Course created successfully!${photoUrls.length > 0 ? ` ${photoUrls.length} image(s) uploaded.` : ''}`,
      data: { courseId, photoUrls }
    }

  } catch (error) {
    console.error('Unexpected error in addCourseWithImages:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function updateCourseWithImages(
  courseId: string, 
  formData: FormData
): Promise<ActionResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Extract course data
    const courseDataString = formData.get('courseData') as string
    if (!courseDataString) {
      return {
        success: false,
        message: 'Course data is required'
      }
    }

    const courseData: Course = JSON.parse(courseDataString)
    
    // Extract image files and deleted URLs
    const imageFiles = formData.getAll('newImages') as File[]
    const deletedImageUrls = formData.getAll('deletedImageUrls') as string[]
    
    let newPhotoUrls: string[] = []
    let finalPhotoUrls: string[] = [...(courseData.photo_url || [])]

    // 1. Process and upload new images if any
    if (imageFiles.length > 0) {
      try {
        // Process images with Sharp
        const processedImages = await Promise.all(
          imageFiles.map(file => processImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 80,
            format: 'webp'
          }))
        )

        // Upload processed images to Supabase storage
        const uploadPromises = processedImages.map(async (processedImage) => {
          return uploadCoursePhoto(
            supabase,
            processedImage.buffer,
            processedImage.fileName,
            processedImage.mimeType,
            courseId
          );
        });

        newPhotoUrls = await Promise.all(uploadPromises)
      } catch (error) {
        console.error('Error processing/uploading new images:', error)
        return {
          success: false,
          message: error instanceof Error ? `Image upload failed: ${error.message}` : 'Image upload failed due to an unknown error.'
        }
      }
    }

    // 2. Combine existing and new photo URLs (remove deleted ones, add new ones)
    // Remove deleted URLs from the final array
    finalPhotoUrls = finalPhotoUrls.filter(url => !deletedImageUrls.includes(url))
    finalPhotoUrls = [...finalPhotoUrls, ...newPhotoUrls]

    // 3. Update course with final photo URLs
    const { error: updateError } = await supabase
      .from('courses')
      .update({ ...courseData, photo_url: finalPhotoUrls })
      .eq('id', courseId)

    if (updateError) {
      console.error('Error updating course:', updateError)
      return {
        success: false,
        message: `Failed to update course: ${updateError.message}`
      }
    }

    // 4. Only after successful update, delete images marked for removal
    if (deletedImageUrls.length > 0) {
      try {
        await Promise.all(
          deletedImageUrls.map(url => deleteCoursePhoto(supabase, url))
        )
      } catch (error) {
        console.error('Error deleting images:', error)
        // Not a critical error, but log it
      }
    }

    // 5. Ensure course folder exists if all images were removed
    if (finalPhotoUrls.length === 0) {
      try {
        await ensureCourseFolderExists(supabase, courseId)
      } catch (error) {
        console.warn('Failed to preserve course folder:', error)
        // Don't fail the entire operation for this
      }
    }

    // Revalidate the courses page
    revalidatePath('/dashboard/courses')
    revalidatePath('/account/courses')

    return {
      success: true,
      message: `Course updated successfully!${newPhotoUrls.length > 0 ? ` ${newPhotoUrls.length} new image(s) uploaded.` : ''}${deletedImageUrls.length > 0 ? ` ${deletedImageUrls.length} image(s) deleted.` : ''}`,
      data: { courseId, newPhotoUrls, deletedImageUrls }
    }

  } catch (error) {
    console.error('Unexpected error in updateCourseWithImages:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Maps database error codes to user-friendly error messages
 * @param error - The error object from Supabase
 * @returns A user-friendly error message
 */
const getErrorMessage = (error: unknown): string => {
  const errorObj = error as { code?: string; message?: string };
  
  if (errorObj?.code === '23503') {
    return 'Cannot delete course: It has related data that must be removed first';
  }
  if (errorObj?.code === '23505') {
    return 'Cannot delete course: Duplicate entry detected';
  }
  if (errorObj?.code === '42P01') {
    return 'Cannot delete course: Database table not found';
  }
  if (errorObj?.message?.includes('permission')) {
    return 'Cannot delete course: Insufficient permissions';
  }
  return errorObj?.message || 'An unknown error occurred';
};

/**
 * Deletes a course with proper cleanup of related data and storage
 * @param courseId - The ID of the course to delete
 * @returns Promise<ActionResponse> - Result of the deletion operation
 */
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

export interface SchoolActionResponse {
  success: boolean
  message: string
  data?: {
    schoolId?: string
    logoUrl?: string
  }
}

export async function addSchoolWithLogo(formData: FormData): Promise<SchoolActionResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Extract school data
    const schoolDataString = formData.get('schoolData') as string
    if (!schoolDataString) {
      return {
        success: false,
        message: 'School data is required'
      }
    }

    const schoolData: School = JSON.parse(schoolDataString)
    
    // Extract logo file
    const logoFile = formData.get('logoFile') as File
    
    // 1. Create school without logo to get an ID
    const { data: schoolDataResult, error: insertError } = await supabase
      .from('schools')
      .insert([{ ...schoolData, logo_url: '' }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating school:', insertError)
      return {
        success: false,
        message: `Failed to create school: ${insertError.message}`
      }
    }

    if (!schoolDataResult) {
      return {
        success: false,
        message: 'Failed to create school: No data returned'
      }
    }

    const schoolId = schoolDataResult.id
    let logoUrl = ''

    // 2. Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      try {
        // Process logo with Sharp for optimization
        const processedLogo = await processImage(logoFile, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 85,
          format: 'webp'
        })

        // Upload processed logo to Supabase storage
        logoUrl = await uploadSchoolLogo(
          supabase,
          new File([processedLogo.buffer], processedLogo.fileName, {
            type: processedLogo.mimeType
          }),
          schoolId
        )
      } catch (error) {
        console.error('Error processing/uploading logo:', error)
        // School was created successfully, but logo upload failed
        return {
          success: false,
          message: error instanceof Error ? `School created, but logo upload failed: ${error.message}` : 'School created, but logo upload failed due to an unknown error.'
        }
      }
    }

    // 3. Update school with logo URL if uploaded
    if (logoUrl) {
      const { error: updateError } = await supabase
        .from('schools')
        .update({ logo_url: logoUrl })
        .eq('id', schoolId)
      
      if (updateError) {
        console.error('Error updating school with logo:', updateError)
        // School was created successfully, but logo URL couldn't be saved
        // This is not a critical error, so we'll still return success
      }
    }

    // Revalidate the schools page to show the new school
    revalidatePath('/dashboard/schools')

    return {
      success: true,
      message: `School created successfully!${logoUrl ? ' Logo uploaded.' : ''}`,
      data: { schoolId, logoUrl }
    }

  } catch (error) {
    console.error('Unexpected error in addSchoolWithLogo:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function updateSchoolWithLogo(
  schoolId: string, 
  formData: FormData
): Promise<SchoolActionResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Extract school data
    const schoolDataString = formData.get('schoolData') as string
    if (!schoolDataString) {
      return {
        success: false,
        message: 'School data is required'
      }
    }

    const schoolData: School = JSON.parse(schoolDataString)
    
    // Extract logo file
    const logoFile = formData.get('logoFile') as File
    
    let logoUrl = schoolData.logo_url || ''

    // 1. Upload new logo if provided
    if (logoFile && logoFile.size > 0) {
      try {
        // Process logo with Sharp for optimization
        const processedLogo = await processImage(logoFile, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 85,
          format: 'webp'
        })

        // Upload processed logo to Supabase storage
        logoUrl = await uploadSchoolLogo(
          supabase,
          new File([processedLogo.buffer], processedLogo.fileName, {
            type: processedLogo.mimeType
          }),
          schoolId
        )
      } catch (error) {
        console.error('Error processing/uploading new logo:', error)
        return {
          success: false,
          message: error instanceof Error ? `Logo upload failed: ${error.message}` : 'Logo upload failed due to an unknown error.'
        }
      }
    }

    // 2. Update school with new data and logo URL
    const { error: updateError } = await supabase
      .from('schools')
      .update({ ...schoolData, logo_url: logoUrl })
      .eq('id', schoolId)

    if (updateError) {
      console.error('Error updating school:', updateError)
      return {
        success: false,
        message: `Failed to update school: ${updateError.message}`
      }
    }

    // Revalidate the schools page
    revalidatePath('/dashboard/schools')

    return {
      success: true,
      message: `School updated successfully!${logoFile && logoFile.size > 0 ? ' New logo uploaded.' : ''}`,
      data: { schoolId, logoUrl }
    }

  } catch (error) {
    console.error('Unexpected error in updateSchoolWithLogo:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}