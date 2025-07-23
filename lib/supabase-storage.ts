import { SupabaseClient } from '@supabase/supabase-js'

const COURSE_PHOTOS_BUCKET = 'course-photos'
const SCHOOL_PHOTOS_BUCKET = 'school-photos'

export async function uploadCoursePhoto(
  supabase: SupabaseClient,
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  courseId: string
): Promise<string> {
  const fullPath = `${courseId}/${Date.now()}-${fileName}`

  console.log(`Uploading to Supabase Storage:`, {
    bucket: COURSE_PHOTOS_BUCKET,
    path: fullPath,
    fileName,
    mimeType,
    bufferSize: buffer.length,
    courseId
  });

  const { error: uploadError } = await supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .upload(fullPath, buffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading photo:', uploadError)
    console.error('Upload error details:', {
      message: uploadError.message,
      name: uploadError.name
    })
    throw new Error(`Failed to upload photo: ${uploadError.message}`)
  }

  console.log(`Successfully uploaded to storage: ${fullPath}`);

  const { data } = supabase.storage.from(COURSE_PHOTOS_BUCKET).getPublicUrl(fullPath)

  if (!data.publicUrl) {
    console.error('Could not get public URL for uploaded file:', fullPath)
    throw new Error('Could not get public URL for uploaded file.')
  }
  
  console.log(`Generated public URL: ${data.publicUrl}`);
  return data.publicUrl
}

export async function getCoursePhotoUrl(supabase: SupabaseClient, filePath: string) {
  const { data } = await supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteCoursePhoto(supabase: SupabaseClient, publicUrl: string) {
  const filePath = new URL(publicUrl).pathname.split(`/${COURSE_PHOTOS_BUCKET}/`)[1]
  
  if (!filePath) {
    console.error('Could not extract file path from public URL:', publicUrl)
    return
  }
  
  // Safety check: Prevent deletion of placeholder files
  if (filePath.endsWith('/.keep')) {
    console.warn('Attempted to delete placeholder file, skipping:', filePath)
    return
  }
  
  const { error } = await supabase.storage.from(COURSE_PHOTOS_BUCKET).remove([filePath])

  if (error) {
    console.error('Error deleting photo from storage:', error)
    throw error
  }
}

export async function listCoursePhotos(supabase: SupabaseClient, courseId: string) {
  const { data, error } = await supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .list('', {
      search: courseId
    })

  if (error) {
    throw error
  }

  return data
}

export async function uploadSchoolLogo(
  supabase: SupabaseClient,
  file: File,
  schoolId: string
): Promise<string> {
  const fullPath = `${schoolId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from(SCHOOL_PHOTOS_BUCKET)
    .upload(fullPath, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading school logo:', JSON.stringify(uploadError, null, 2))
    throw new Error('Failed to upload school logo.')
  }

  const { data } = supabase.storage.from(SCHOOL_PHOTOS_BUCKET).getPublicUrl(fullPath)

  if (!data.publicUrl) {
    throw new Error('Could not get public URL for uploaded school logo.')
  }
  return data.publicUrl
} 

/**
 * Copies an image from a public URL to a new course's folder in Supabase Storage.
 * @param supabase Supabase client
 * @param imageUrl The public URL of the image to copy
 * @param newCourseId The ID of the new (duplicated) course
 * @returns The new public URL of the copied image
 */
export async function copyCoursePhotoToNewCourse(
  supabase: SupabaseClient,
  imageUrl: string,
  newCourseId: string
): Promise<string> {
  // 1. Download the image as a buffer
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${imageUrl}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Get the file extension from the URL (default to .jpg)
  const urlObj = new URL(imageUrl);
  const pathname = urlObj.pathname;
  const extMatch = pathname.match(/\.[a-zA-Z0-9]+$/);
  const ext = extMatch ? extMatch[0] : '.jpg';

  // 3. Generate a new filename
  const fileName = `copy-${Date.now()}${ext}`;

  // 4. Upload to Supabase Storage under the new course's folder
  return await uploadCoursePhoto(
    supabase,
    buffer,
    fileName,
    response.headers.get('content-type') || 'image/jpeg',
    newCourseId
  );
} 

/**
 * Ensures a course folder exists in storage by creating a placeholder file.
 * This prevents the folder from being automatically deleted when all images are removed.
 * @param supabase Supabase client
 * @param courseId The ID of the course
 */
export async function ensureCourseFolderExists(
  supabase: SupabaseClient,
  courseId: string
): Promise<void> {
  // Upload a placeholder file to maintain folder structure
  const placeholderPath = `${courseId}/.keep`
  const placeholderContent = Buffer.from('Course folder preserved')
  
  try {
    const { error } = await supabase.storage
      .from(COURSE_PHOTOS_BUCKET)
      .upload(placeholderPath, placeholderContent, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      })

    if (error) {
      console.warn(`Failed to create placeholder for course ${courseId}:`, error)
    } else {
      console.log(`Created placeholder file for course ${courseId}`)
    }
  } catch (error) {
    console.warn(`Failed to create placeholder for course ${courseId}:`, error)
    // Don't throw - this is not critical
  }
}

/**
 * Checks if a course folder exists in storage.
 * @param supabase Supabase client
 * @param courseId The ID of the course
 * @returns Promise<boolean> True if the folder exists, false otherwise
 */
export async function courseFolderExists(
  supabase: SupabaseClient,
  courseId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from(COURSE_PHOTOS_BUCKET)
      .list(courseId, { limit: 1 })

    if (error) {
      console.warn(`Error checking if course folder exists for ${courseId}:`, error)
      return false
    }

    return data !== null && data.length > 0
  } catch (error) {
    console.warn(`Failed to check if course folder exists for ${courseId}:`, error)
    return false
  }
}

/**
 * Deletes all files in a course folder and optionally the folder itself.
 * This should be called when a course is deleted to clean up storage.
 * @param supabase Supabase client
 * @param courseId The ID of the course to delete
 */
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
      } else {
        console.log(`Successfully deleted ${filePaths.length} files for course ${courseId}`)
      }
    } else {
      console.log(`No files found for course ${courseId}`)
    }
  } catch (error) {
    console.error('Error deleting course folder:', error)
  }
}

/**
 * Recovers a missing course folder by creating it with a placeholder file.
 * This can be used to fix courses that have lost their storage folders.
 * @param supabase Supabase client
 * @param courseId The ID of the course
 */
export async function recoverCourseFolder(
  supabase: SupabaseClient,
  courseId: string
): Promise<void> {
  try {
    const exists = await courseFolderExists(supabase, courseId)
    if (!exists) {
      console.log(`Recovering missing folder for course ${courseId}`)
      await ensureCourseFolderExists(supabase, courseId)
    }
  } catch (error) {
    console.error(`Failed to recover course folder for ${courseId}:`, error)
  }
} 