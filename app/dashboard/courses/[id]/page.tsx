'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CourseForm } from "@/components/dashboard/course-form"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Course } from "@/lib/types"
import { updateCourseWithImages } from "@/lib/actions"

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>()
  const [initialValues, setInitialValues] = useState<Partial<Course> | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show toast after reload if update was successful
  useEffect(() => {
    const successMsg = sessionStorage.getItem('courseUpdateSuccess');
    if (successMsg) {
      toast.success(successMsg);
      sessionStorage.removeItem('courseUpdateSuccess');
    }
  }, []);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        const normalizedData = { ...data }
        if (typeof normalizedData.skills === 'string') {
          normalizedData.skills = normalizedData.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        } else if (!Array.isArray(normalizedData.skills)) {
          normalizedData.skills = []
        }
        
        if (typeof normalizedData.environment === 'string') {
          normalizedData.environment = normalizedData.environment.split(',').map((s: string) => s.trim()).filter(Boolean)
        } else if (!Array.isArray(normalizedData.environment)) {
          normalizedData.environment = []
        }
        
        // Handle photo_url which might be a JSON string
        if (typeof normalizedData.photo_url === 'string' && normalizedData.photo_url.startsWith('[')) {
          try {
            normalizedData.photo_url = JSON.parse(normalizedData.photo_url)
          } catch (e) {
            console.error('Failed to parse photo_url:', e)
            normalizedData.photo_url = []
          }
        } else if (!Array.isArray(normalizedData.photo_url)) {
          normalizedData.photo_url = []
        }
        
        // Sanitize photo URLs
        if (Array.isArray(normalizedData.photo_url)) {
          normalizedData.photo_url = normalizedData.photo_url.filter(
            (url: string) => typeof url === 'string' && (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:'))
          )
        }
        
        setInitialValues(normalizedData)
      } catch (error: unknown) {
        console.error("Failed to load course.", error)
        if (error instanceof Error) {
          toast.error(error.message || 'Failed to load course')
        } else {
          toast.error('An unknown error occurred while loading the course')
        }
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchCourse()
  }, [id])

  const handleSubmit = async (data: Course, newImageFiles: File[], deletedImageUrls: string[]) => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('courseData', JSON.stringify(data))
    newImageFiles.forEach(file => {
      formData.append('newImages', file)
    })
    deletedImageUrls.forEach(url => {
      formData.append('deletedImageUrls', url)
    })

    try {
      const result = await updateCourseWithImages(id, formData)

      if (result.success) {
        sessionStorage.setItem('courseUpdateSuccess', 'Course updated successfully!');
        window.location.reload();
      } else {
        toast.error(result.message, { duration: 5000, closeButton: true })
      }
    } catch {
      toast.error('An unexpected error occurred.', { duration: 5000, closeButton: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-zinc-300">Loading course...</div>
  if (!initialValues) return null

  return (
    <CourseForm mode="edit" initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  )
} 