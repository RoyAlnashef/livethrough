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