"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabase'
import { uploadSchoolLogo } from '@/lib/supabase-storage'

interface SchoolFormProps {
  mode: "add" | "edit"
  initialValues?: Partial<School>
  onSubmit: (data: School) => void
  isSubmitting?: boolean
}

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
}

export function SchoolForm({ mode, initialValues, onSubmit, isSubmitting }: SchoolFormProps) {
  const [school, setSchool] = useState<School>({
    name: "",
    description: "",
    website: "",
    logo_url: "",
    contact_email: "",
    location: "",
    contact_phone: "",
    address: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    youtube_url: "",
    ...initialValues,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  const handleChange = (field: keyof School, value: string) => {
    setSchool((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let logoUrl = school.logo_url
    if (logoFile) {
      try {
        // Use school.id if editing, otherwise use school.name (slugified) or 'new-school'
        const schoolId = school.id || school.name.replace(/\s+/g, '-').toLowerCase() || 'new-school'
        logoUrl = await uploadSchoolLogo(supabase, logoFile, schoolId)
      } catch {
        console.error('Failed to upload logo. Please try again.')
        return
      }
    }
    onSubmit({ ...school, logo_url: logoUrl })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>{mode === "add" ? "Add School" : "Edit School"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">School Name</Label>
              <Input id="name" value={school.name} onChange={e => handleChange("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={school.website} onChange={e => handleChange("website", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={school.description} onChange={e => handleChange("description", e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input id="contact_email" value={school.contact_email} onChange={e => handleChange("contact_email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={school.location} onChange={e => handleChange("location", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input id="contact_phone" value={school.contact_phone} onChange={e => handleChange("contact_phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={school.address} onChange={e => handleChange("address", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook</Label>
              <Input id="facebook_url" value={school.facebook_url} onChange={e => handleChange("facebook_url", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter</Label>
              <Input id="twitter_url" value={school.twitter_url} onChange={e => handleChange("twitter_url", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input id="instagram_url" value={school.instagram_url} onChange={e => handleChange("instagram_url", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube</Label>
              <Input id="youtube_url" value={school.youtube_url} onChange={e => handleChange("youtube_url", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_upload">School Logo</Label>
            <Input id="logo_upload" type="file" accept="image/*" onChange={handleLogoFileChange} />
            {logoPreview && (
              <img src={logoPreview} alt="Logo Preview" className="mt-2 rounded h-20" />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white" disabled={isSubmitting}>
              {mode === "add" ? "Add School" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
} 