'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CourseForm, CourseFormData } from "@/components/dashboard/course-form"
import { supabase } from "@/lib/supabase"

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>()
  const [initialValues, setInitialValues] = useState<Partial<CourseFormData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        setError("Failed to load course.")
        setLoading(false)
        return
      }
      const normalizedData = { ...data }
      if (typeof normalizedData.skills === 'string') {
        normalizedData.skills = normalizedData.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      } else if (!Array.isArray(normalizedData.skills)) {
        normalizedData.skills = []
      }
      setInitialValues(normalizedData)
      setLoading(false)
    }
    if (id) fetchCourse()
  }, [id])

  const handleSubmit = async (data: CourseFormData) => {
    // TODO: Implement course update logic (e.g., call API or Supabase)
    console.log("Course updated:", data)
  }

  if (loading) return <div className="p-8 text-zinc-300">Loading course...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!initialValues) return null

  return (
    <CourseForm mode="edit" initialValues={initialValues} onSubmit={handleSubmit} />
  )
} 