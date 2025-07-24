"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">{mode === "edit" ? "Edit School" : "Add New School"}</h1>
        <p className="text-zinc-400">Create and manage survival schools for the LiveThrough marketplace</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content - 2fr equivalent */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Basic Information</CardTitle>
              <CardDescription className="text-zinc-400">Essential school details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-400 mb-2">
                    School Name <span className="text-red-400">*</span>
                  </Label>
                  <Input 
                    id="name" 
                    value={school.name} 
                    onChange={e => handleChange("name", e.target.value)} 
                    required 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="e.g., Wilderness Survival Academy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-zinc-400 mb-2">Website</Label>
                  <Input 
                    id="website" 
                    value={school.website} 
                    onChange={e => handleChange("website", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="https://www.yourschool.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-400 mb-2">Description</Label>
                <Textarea 
                  id="description" 
                  value={school.description} 
                  onChange={e => handleChange("description", e.target.value)} 
                  rows={4}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                  placeholder="Describe your school's mission, expertise, and what makes it unique..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="text-zinc-400 mb-2">Contact Email</Label>
                  <Input 
                    id="contact_email" 
                    value={school.contact_email} 
                    onChange={e => handleChange("contact_email", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="contact@yourschool.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="text-zinc-400 mb-2">Contact Phone</Label>
                  <Input 
                    id="contact_phone" 
                    value={school.contact_phone} 
                    onChange={e => handleChange("contact_phone", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-zinc-400 mb-2">Address</Label>
                  <Input 
                    id="address" 
                    value={school.address} 
                    onChange={e => handleChange("address", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="123 Wilderness Way, Boulder, CO 80301"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-zinc-400 mb-2">Location</Label>
                  <Input 
                    id="location" 
                    value={school.location} 
                    onChange={e => handleChange("location", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="e.g., Boulder, CO"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Social Media</CardTitle>
              <CardDescription className="text-zinc-400">Connect your social media presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url" className="text-zinc-400 mb-2">Facebook</Label>
                  <Input 
                    id="facebook_url" 
                    value={school.facebook_url} 
                    onChange={e => handleChange("facebook_url", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="https://facebook.com/yourschool"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="text-zinc-400 mb-2">Twitter</Label>
                  <Input 
                    id="twitter_url" 
                    value={school.twitter_url} 
                    onChange={e => handleChange("twitter_url", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="https://twitter.com/yourschool"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="text-zinc-400 mb-2">Instagram</Label>
                  <Input 
                    id="instagram_url" 
                    value={school.instagram_url} 
                    onChange={e => handleChange("instagram_url", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="https://instagram.com/yourschool"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_url" className="text-zinc-400 mb-2">YouTube</Label>
                  <Input 
                    id="youtube_url" 
                    value={school.youtube_url} 
                    onChange={e => handleChange("youtube_url", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="https://youtube.com/@yourschool"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - 1fr equivalent */}
        <div className="space-y-6">
          {/* School Logo */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">School Logo</CardTitle>
              <CardDescription className="text-zinc-400">
                Upload your school logo to build brand recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo_upload" className="text-zinc-400 mb-2">Logo Image</Label>
                <Input 
                  id="logo_upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoFileChange}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 file:bg-teal-600 file:border-0 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer file:hover:bg-teal-700 h-auto"
                />
                {logoPreview && (
                  <div className="mt-4">
                    <img src={logoPreview} alt="Logo Preview" className="rounded-lg h-32 w-full object-cover border border-zinc-700" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Actions</CardTitle>
              <CardDescription className="text-zinc-400">
                Save your changes or cancel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={!school.name.trim() || isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : mode === "add" ? "Create School" : "Update School"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 