"use client"

import { useState, useEffect } from "react"
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
  onCancel?: () => void
  isSubmitting?: boolean
  storageKey?: string // Add storageKey prop
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
  tiktok_url?: string
}

export function SchoolForm({ mode, initialValues, onSubmit, onCancel, isSubmitting, storageKey }: SchoolFormProps) {
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
    tiktok_url: "",
    ...initialValues,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [logoError, setLogoError] = useState<string>("")

  // Restore form state from localStorage on mount and on pageshow (bfcache restore)
  useEffect(() => {
    if (!storageKey) return;
    const restore = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSchool((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    };
    restore();
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('pageshow', restore);
    };
  }, [storageKey]);

  // Save form state to localStorage on change
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(school));
  }, [school, storageKey]);

  const validateField = (field: keyof School, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'School name is required'
        if (value.trim().length < 2) return 'School name must be at least 2 characters'
        if (value.trim().length > 100) return 'School name must be less than 100 characters'
        return ''
      case 'website':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Website must be a valid URL starting with http:// or https://'
        }
        return ''
      case 'contact_email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        return ''
      case 'facebook_url':
      case 'twitter_url':
      case 'instagram_url':
      case 'youtube_url':
      case 'tiktok_url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://'
        }
        return ''
      default:
        return ''
    }
  }

  const handleChange = (field: keyof School, value: string) => {
    setSchool((prev) => ({ ...prev, [field]: value }))
    // Only update errors in real-time if the field has been touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof School) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    // Always validate and show errors on blur
    const error = validateField(field, school[field] || "")
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        setLogoError("Invalid file type. Please upload a JPG, PNG, WEBP, GIF, or SVG image.");
        setLogoFile(null);
        setLogoPreview("");
        return;
      }
      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setLogoError("File size exceeds 2MB. Please upload a smaller image.");
        setLogoFile(null);
        setLogoPreview("");
        return;
      }
      setLogoError("");
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setLogoError("");
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate all fields
    Object.keys(school).forEach((field) => {
      const value = school[field as keyof School]
      const error = validateField(field as keyof School, value || '')
      if (error) {
        newErrors[field] = error
      }
    })
    
    setErrors(newErrors)
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    Object.keys(school).forEach((field) => {
      allTouched[field] = true
    })
    setTouched(allTouched)
    
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    
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
    if (storageKey) localStorage.removeItem(storageKey);
  }

  const handleCancel = () => {
    if (storageKey) localStorage.removeItem(storageKey);
    if (onCancel) onCancel();
  }

  return (
    <div>
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
                    value={school.name ?? ""}
                    onChange={e => handleChange("name", e.target.value)} 
                    onBlur={() => handleBlur("name")}
                    required 
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.name && errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Wilderness Survival Academy"
                  />
                  {touched.name && errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-zinc-400 mb-2">Website</Label>
                  <Input 
                    id="website" 
                    value={school.website ?? ""}
                    onChange={e => handleChange("website", e.target.value)} 
                    onBlur={() => handleBlur("website")}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.website && errors.website ? 'border-red-500' : ''
                    }`}
                    placeholder="https://www.yourschool.com"
                  />
                  {touched.website && errors.website && (
                    <p className="text-red-400 text-sm mt-1">{errors.website}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-400 mb-2">Description</Label>
                <Textarea 
                  id="description" 
                  value={school.description ?? ""}
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
                         value={school.contact_email ?? ""}
                         onChange={e => handleChange("contact_email", e.target.value)} 
                         onBlur={() => handleBlur("contact_email")}
                         className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                           touched.contact_email && errors.contact_email ? 'border-red-500' : ''
                         }`}
                         placeholder="contact@yourschool.com"
                       />
                       {touched.contact_email && errors.contact_email && (
                         <p className="text-red-400 text-sm mt-1">{errors.contact_email}</p>
                       )}
                     </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="text-zinc-400 mb-2">Contact Phone</Label>
                  <Input 
                    id="contact_phone" 
                    value={school.contact_phone ?? ""}
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
                    value={school.address ?? ""}
                    onChange={e => handleChange("address", e.target.value)} 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                    placeholder="123 Wilderness Way, Boulder, CO 80301"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-zinc-400 mb-2">Location</Label>
                  <Input 
                    id="location" 
                    value={school.location ?? ""}
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
                    value={school.facebook_url ?? ""}
                    onChange={e => handleChange("facebook_url", e.target.value)} 
                    onBlur={() => handleBlur("facebook_url")}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.facebook_url && errors.facebook_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://facebook.com/yourschool"
                  />
                  {touched.facebook_url && errors.facebook_url && (
                    <p className="text-red-400 text-sm mt-1">{errors.facebook_url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="text-zinc-400 mb-2">Twitter</Label>
                  <Input 
                    id="twitter_url" 
                    value={school.twitter_url ?? ""}
                    onChange={e => handleChange("twitter_url", e.target.value)} 
                    onBlur={() => handleBlur("twitter_url")}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.twitter_url && errors.twitter_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://twitter.com/yourschool"
                  />
                  {touched.twitter_url && errors.twitter_url && (
                    <p className="text-red-400 text-sm mt-1">{errors.twitter_url}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="text-zinc-400 mb-2">Instagram</Label>
                  <Input 
                    id="instagram_url" 
                    value={school.instagram_url ?? ""}
                    onChange={e => handleChange("instagram_url", e.target.value)} 
                    onBlur={() => handleBlur("instagram_url")}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.instagram_url && errors.instagram_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://instagram.com/yourschool"
                  />
                  {touched.instagram_url && errors.instagram_url && (
                    <p className="text-red-400 text-sm mt-1">{errors.instagram_url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_url" className="text-zinc-400 mb-2">YouTube</Label>
                  <Input 
                    id="youtube_url" 
                    value={school.youtube_url ?? ""}
                    onChange={e => handleChange("youtube_url", e.target.value)} 
                    onBlur={() => handleBlur("youtube_url")}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.youtube_url && errors.youtube_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://youtube.com/@yourschool"
                  />
                  {touched.youtube_url && errors.youtube_url && (
                    <p className="text-red-400 text-sm mt-1">{errors.youtube_url}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tiktok_url" className="text-zinc-400 mb-2">TikTok</Label>
                  <Input 
                    id="tiktok_url" 
                    value={school.tiktok_url ?? ""}
                    onChange={e => handleChange("tiktok_url", e.target.value)} 
                    onBlur={() => handleBlur("tiktok_url")}
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 ${
                      touched.tiktok_url && errors.tiktok_url ? 'border-red-500' : ''
                    }`}
                    placeholder="https://tiktok.com/@yourschool"
                  />
                  {touched.tiktok_url && errors.tiktok_url && (
                    <p className="text-red-400 text-sm mt-1">{errors.tiktok_url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  {/* Empty div to maintain grid layout */}
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
                {logoError && (
                  <div className="text-red-400 text-sm mt-2">{logoError}</div>
                )}
                {(logoPreview || school.logo_url) && (
                  <div className="mt-4">
                    <div className="rounded-lg p-4 w-full border border-zinc-700 bg-zinc-800 flex items-center justify-center relative">
                      <img 
                        src={logoPreview || school.logo_url} 
                        alt="Logo Preview" 
                        className="max-h-full max-w-full object-contain p-2" 
                      />
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute top-2 right-2 bg-zinc-900 text-red-400 border border-zinc-700 rounded-full px-2 py-1 text-xs hover:bg-zinc-800 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
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
              {onCancel && (
                <Button 
                  type="button" 
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100" 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 