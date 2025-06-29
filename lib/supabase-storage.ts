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

  const { error: uploadError } = await supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .upload(fullPath, buffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading photo:', uploadError)
    throw new Error('Failed to upload photo.')
  }

  const { data } = supabase.storage.from(COURSE_PHOTOS_BUCKET).getPublicUrl(fullPath)

  if (!data.publicUrl) {
    throw new Error('Could not get public URL for uploaded file.')
  }
  
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