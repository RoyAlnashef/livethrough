'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseFormProps {
  mode: "add" | "edit"
  initialValues?: Partial<CourseFormData>
  onSubmit: (data: CourseFormData) => void
}

export interface CourseFormData {
  title: string
  description: string
  difficulty: string
  duration: string
  price: string
  images: File[]
  environment: string
  skills: string[]
  prerequisites: string
  location: string
  latitude: string
  longitude: string
  status: string
}

const defaultValues: CourseFormData = {
  title: "",
  description: "",
  difficulty: "",
  duration: "",
  price: "0",
  images: [],
  environment: "",
  skills: [],
  prerequisites: "",
  location: "",
  latitude: "",
  longitude: "",
  status: "Draft",
}

export function CourseForm({ mode, initialValues, onSubmit }: CourseFormProps) {
  const [formData, setFormData] = React.useState<CourseFormData>({
    ...defaultValues,
    ...initialValues,
  })
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])

  const handleInputChange = (field: keyof CourseFormData, value: unknown) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setFormData((prev) => ({ ...prev, images: files }))
    setImagePreviews(files.map(file => URL.createObjectURL(file)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">
        {mode === "add" ? "Create Course" : "Edit Course"}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Basic Information */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white mb-2">Basic Information</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title" className="text-zinc-300 mb-2">Course Title *</Label>
                <Input id="title" value={formData.title} onChange={e => handleInputChange("title", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="Enter course title" />
              </div>
              <div>
                <Label htmlFor="description" className="text-zinc-300 mb-2">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => handleInputChange("description", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="Describe what students will learn in this course" rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty" className="text-zinc-300 mb-2">Difficulty Level *</Label>
                  <Select value={formData.difficulty} onValueChange={value => handleInputChange("difficulty", value)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-zinc-300 mb-2">Duration</Label>
                  <Input id="duration" value={formData.duration} onChange={e => handleInputChange("duration", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="e.g., 4 days, 2 weeks" />
                </div>
                <div>
                  <Label htmlFor="price" className="text-zinc-300 mb-2">Price ($)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" min={0} />
                </div>
              </div>
            </div>
          </div>
          {/* Course Images */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white mb-2">Course Images</h2>
            <p className="text-zinc-400 text-sm">Upload images that will be displayed on your course page. The first image will be used as the main thumbnail.</p>
            <input type="file" accept="image/png,image/jpeg,image/gif" multiple onChange={handleImageChange} className="hidden" id="course-images-upload" />
            <label htmlFor="course-images-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-6 cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <span className="text-zinc-400 mb-2">Upload course images</span>
              <span className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB each. Recommended size: 1200×800px</span>
            </label>
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-32 h-20 object-cover rounded border border-zinc-700" />
                ))}
              </div>
            )}
          </div>
          {/* Course Details & Schedule */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white mb-2">Course Details & Schedule</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="environment" className="text-zinc-300 mb-2">Environment</Label>
                <Select value={formData.environment} onValueChange={value => handleInputChange("environment", value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
                    <SelectValue placeholder="Select environments" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="desert">Desert</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skills" className="text-zinc-300 mb-2">Skills Taught</Label>
                <Input id="skills" value={formData.skills.join(", ")} onChange={e => handleInputChange("skills", e.target.value.split(",").map(s => s.trim()))} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="Select skills" />
              </div>
              <div>
                <Label htmlFor="prerequisites" className="text-zinc-300 mb-2">Prerequisites</Label>
                <Textarea id="prerequisites" value={formData.prerequisites} onChange={e => handleInputChange("prerequisites", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="List any required prerequisites or certifications" rows={2} />
              </div>
              <div>
                <Label htmlFor="location" className="text-zinc-300 mb-2">Location</Label>
                <Input id="location" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="e.g., Denver, CO or Yosemite National Park" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-zinc-300 mb-2">Latitude</Label>
                  <Input id="latitude" value={formData.latitude} onChange={e => handleInputChange("latitude", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="37.7749" />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-zinc-300 mb-2">Longitude</Label>
                  <Input id="longitude" value={formData.longitude} onChange={e => handleInputChange("longitude", e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400" placeholder="-122.4194" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-8">
          {/* Course Settings */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white mb-2">Course Settings</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="status" className="text-zinc-300 mb-2">Status *</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange("status", value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white flex-1">
                  {mode === "add" ? "Create Course" : "Update Course"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setFormData(defaultValues)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
} 