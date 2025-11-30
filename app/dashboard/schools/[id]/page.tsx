'use client'
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SchoolForm } from "@/components/dashboard/school-form"
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
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
  const router = useRouter()
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

      // Log the data being sent
      console.log('Updating school with:', updateData)

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
      // Log the error details
      console.error('Error updating school:', JSON.stringify(error, null, 2))
      toast.error('Failed to update school. Please try again.', { 
        duration: 5000, 
        closeButton: true 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

           if (loading) return (
           <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
             <Breadcrumbs
               segments={[
                 { name: "Dashboard", href: "/dashboard" },
                 { name: "Schools", href: "/dashboard/schools" },
                 { name: "Loading..." },
               ]}
             />
             <div className="p-8 text-zinc-300">Loading school...</div>
           </div>
         )
         if (!initialValues) return null

         return (
           <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
             <Breadcrumbs
               segments={[
                 { name: "Dashboard", href: "/dashboard" },
                 { name: "Schools", href: "/dashboard/schools" },
                 { name: initialValues.name || "Edit School" },
               ]}
             />
             <SchoolForm
               mode="edit"
               initialValues={initialValues}
               onSubmit={handleSubmit}
               onCancel={() => router.push('/dashboard/schools')}
               isSubmitting={isSubmitting}
               storageKey={id ? `schoolFormEdit_${id}` : undefined}
             />
           </div>
         )
} 