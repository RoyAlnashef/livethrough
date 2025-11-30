'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { StudentForm, StudentFormData } from "@/components/dashboard/student-form"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>()
  const [initialValues, setInitialValues] = useState<Partial<StudentFormData> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchStudent() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setInitialValues(data)
      } catch (err) {
        console.error('Failed to load student', err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchStudent()
  }, [id])

  const handleSubmit = async (data: StudentFormData) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', id)
      
      if (error) throw error
      toast.success('Student updated successfully!')
      setTimeout(() => {
        router.push('/dashboard/students')
      }, 800)
    } catch (err) {
      let message = 'Failed to update student'
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        message = (err as { message: string }).message
      } else {
        try {
          message = JSON.stringify(err)
        } catch {}
      }
      toast.error(message, { duration: Infinity, closeButton: true })
    }
  }

  if (loading) return <div className="p-8 text-zinc-300">Loading student...</div>
  if (!initialValues) return null

  return (
    <StudentForm mode="edit" initialValues={initialValues} onSubmit={handleSubmit} />
  )
} 