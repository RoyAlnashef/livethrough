'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StudentForm, StudentFormData } from "@/components/dashboard/student-form"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function AddStudentPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function isErrorWithMessage(err: unknown): err is { message: string } {
    return (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof (err as { message: unknown }).message === 'string'
    )
  }

  const handleSubmit = async (data: StudentFormData) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .insert([{ ...data, role: 'student' }])
      
      if (error) throw error
      toast.success('Student added successfully!')
      setTimeout(() => {
        router.push('/dashboard/students')
      }, 800)
    } catch (err: unknown) {
      console.error('Supabase error:', err)
      let message = 'Failed to add student'
      if (isErrorWithMessage(err)) {
        message = err.message
      } else {
        try {
          message = JSON.stringify(err)
        } catch {}
      }
      toast.error(message, { duration: Infinity, closeButton: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <StudentForm mode="add" onSubmit={handleSubmit} />
      {loading && <p className="text-zinc-400 mt-4">Adding student...</p>}
    </>
  )
} 