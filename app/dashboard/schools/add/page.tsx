'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SchoolForm } from "@/components/dashboard/school-form"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

// Use the School interface from SchoolForm component
interface School {
  id?: string
  name: string
  description: string
  website: string
  logo_url: string
  contact_email: string
  location: string
  contact_phone?: string
  address?: string
  facebook_url?: string
  twitter_url?: string
  instagram_url?: string
  youtube_url?: string
  tiktok_url?: string
}

export default function AddSchoolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: School) => {
    setIsSubmitting(true)

    try {
      // Prepare the data for insertion (remove id and created_at if present)
      const insertData = { ...data }
      if (insertData.id) delete insertData.id

      // Insert the school into the database
      const { error } = await supabase
        .from('schools')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.success('School created successfully!')
      router.push('/dashboard/schools')
    } catch (error) {
      console.error('Error creating school:', error)
      toast.error('Failed to create school. Please try again.', { 
        duration: 5000, 
        closeButton: true 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SchoolForm 
      mode="add" 
      onSubmit={handleSubmit} 
      isSubmitting={isSubmitting} 
    />
  )
} 