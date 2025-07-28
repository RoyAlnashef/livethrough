import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

// Utility function to fetch course data server-side
export async function fetchCourseServer(id: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("courses")
    .select("*, schools(*), course_types(id, name)")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }

  // Process the data similar to client-side
  const courseData = {
    ...data,
    skills: typeof data.skills === 'string' ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : data.skills || [],
    photo_url: typeof data.photo_url === 'string' && data.photo_url.startsWith('[') ? JSON.parse(data.photo_url) : Array.isArray(data.photo_url) ? data.photo_url : [],
    course_type: data.course_types ? data.course_types : undefined,
  }

  return courseData
}

// Utility function to fetch similar courses server-side
export async function fetchSimilarCoursesServer(courseTypeId: string, excludeId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("courses")
    .select("*, schools(*)")
    .eq("course_type_id", courseTypeId)
    .neq("id", excludeId)
    .limit(8)

  if (error) {
    console.error("Error fetching similar courses:", error)
    return []
  }

  // Process the data similar to client-side
  const processedData = (data || []).map(course => ({
    ...course,
    skills: typeof course.skills === 'string' ? course.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : course.skills || [],
    photo_url: typeof course.photo_url === 'string' && course.photo_url.startsWith('[') ? JSON.parse(course.photo_url) : Array.isArray(course.photo_url) ? course.photo_url : [],
  }))

  return processedData
} 