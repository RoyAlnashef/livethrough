'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SchoolForm } from "@/components/dashboard/school-form"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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

export default function EditSchoolPage() {
  const { id } = useParams<{ id: string }>()
  const [initialValues, setInitialValues] = useState<Partial<School> | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show toast after reload if update was successful
  useEffect(() => {
    const successMsg = sessionStorage.getItem('schoolUpdateSuccess');
    if (successMsg) {
      toast.success(successMsg);
      sessionStorage.removeItem('schoolUpdateSuccess');
    }
  }, []);

  useEffect(() => {
    async function fetchSchool() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        setInitialValues(data)
      } catch (error: unknown) {
        console.error("Failed to load school.", error)
        if (error instanceof Error) {
          toast.error(error.message || 'Failed to load school')
        } else {
          toast.error('An unknown error occurred while loading the school')
        }
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchSchool()
  }, [id])

  const handleSubmit = async (data: School) => {
    setIsSubmitting(true)

    try {
      // Prepare the data for update (remove id and created_at if present)
      const updateData = { ...data }
      if (updateData.id) delete updateData.id

      // Update the school in the database
      const { error } = await supabase
        .from('schools')
        .update(updateData)
        .eq('id', id)

      if (error) {
        throw error
      }

      sessionStorage.setItem('schoolUpdateSuccess', 'School updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating school:', error)
      toast.error('Failed to update school. Please try again.', { 
        duration: 5000, 
        closeButton: true 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-zinc-300">Loading school...</div>
  if (!initialValues) return null

  return (
    <SchoolForm 
      mode="edit" 
      initialValues={initialValues} 
      onSubmit={handleSubmit} 
      isSubmitting={isSubmitting} 
    />
  )
} 