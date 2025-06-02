import { supabase } from './supabase'

const COURSE_PHOTOS_BUCKET = 'course-photos'

export async function uploadCoursePhoto(file: File, courseId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${courseId}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  return data
}

export async function getCoursePhotoUrl(filePath: string) {
  const { data } = supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteCoursePhoto(filePath: string) {
  const { error } = await supabase.storage
    .from(COURSE_PHOTOS_BUCKET)
    .remove([filePath])

  if (error) {
    throw error
  }
}

export async function listCoursePhotos(courseId: string) {
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