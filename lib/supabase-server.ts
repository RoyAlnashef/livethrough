import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Utility function to fetch course data server-side
export async function fetchCourseServer(id: string) {
  const supabase = await createClient()
  
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
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("course_type_id", courseTypeId)
    .neq("id", excludeId)
    .limit(8)

  if (error) {
    console.error("Error fetching similar courses:", error)
    return []
  }

  return data || []
} 