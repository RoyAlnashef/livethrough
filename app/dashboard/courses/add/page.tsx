'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CourseForm } from "@/components/dashboard/course-form"
import { toast } from "sonner"
import { Course } from "@/lib/types"
import { addCourseWithImages } from "@/lib/actions"

export default function AddCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialValues, setInitialValues] = useState<Partial<Course> | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const imported = sessionStorage.getItem('importedCourseData')
      if (imported) {
        try {
          setInitialValues(JSON.parse(imported))
        } catch {}
        sessionStorage.removeItem('importedCourseData')
      }
    }
  }, [])

  const handleSubmit = async (data: Course, newImageFiles: File[]) => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('courseData', JSON.stringify(data))
    newImageFiles.forEach(file => {
      formData.append('newImages', file)
    })

    try {
      const result = await addCourseWithImages(formData)

      if (result.success) {
        toast.success(result.message)
        router.push('/dashboard/courses')
      } else {
        toast.error(result.message, { duration: 5000, closeButton: true })
      }
    } catch {
      toast.error('An unexpected error occurred.', { duration: 5000, closeButton: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CourseForm mode="add" initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  )
} 