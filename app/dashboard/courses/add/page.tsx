'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CourseForm, CourseFormData } from "@/components/dashboard/course-form"
import { supabase } from "@/lib/supabase"

export default function AddCoursePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (data: CourseFormData) => {
    setLoading(true)
    setError(null)
    // Only send fields that exist in your courses table
    const courseData: Partial<CourseFormData> = { ...data }
    delete courseData.images
    const { error } = await supabase.from('courses').insert([courseData])
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard/courses')
    }
  }

  return (
    <>
      <CourseForm mode="add" onSubmit={handleSubmit} />
      {loading && <p className="text-zinc-400 mt-4">Creating course...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </>
  )
} 