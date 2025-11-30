'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { validateEmail, validateRequired, validatePhone } from "@/lib/validation"

interface StudentFormProps {
  mode: "add" | "edit"
  initialValues?: Partial<StudentFormData>
  onSubmit: (data: StudentFormData) => void
}

export interface StudentFormData {
  full_name: string
  email: string
  phone: string
  status: string
}

const defaultValues: StudentFormData = {
  full_name: "",
  email: "",
  phone: "",
  status: "Active",
}

export function StudentForm({ mode, initialValues, onSubmit }: StudentFormProps) {
  const router = useRouter()
  const [formData, setFormData] = React.useState<StudentFormData>({
    ...defaultValues,
    ...initialValues,
  })
  const [errors, setErrors] = React.useState<Partial<Record<keyof StudentFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {}
    if (validateRequired(formData.full_name, 'Full name')) {
      newErrors.full_name = validateRequired(formData.full_name, 'Full name')!
    }
    if (validateEmail(formData.email)) {
      newErrors.email = validateEmail(formData.email)!
    }
    if (formData.phone && validatePhone(formData.phone)) {
      newErrors.phone = validatePhone(formData.phone)!
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/students')
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">
        {mode === "add" ? "Add Student" : "Edit Student"}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Basic Information */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white mb-2">Basic Information</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="full_name" className="text-zinc-300 mb-2">Full Name *</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name} 
                  onChange={e => handleInputChange("full_name", e.target.value)} 
                  className={cn(
                    "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400",
                    errors.full_name && "border-red-500"
                  )}
                  placeholder="Enter student's full name" 
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-zinc-300 mb-2">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={e => handleInputChange("email", e.target.value)} 
                  className={cn(
                    "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400",
                    errors.email && "border-red-500"
                  )}
                  placeholder="Enter student's email" 
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-zinc-300 mb-2">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={e => handleInputChange("phone", e.target.value)} 
                  className={cn(
                    "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400",
                    errors.phone && "border-red-500"
                  )}
                  placeholder="Enter student's phone number" 
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-8">
          {/* Student Settings */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-white mb-2">Student Settings</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="status" className="text-zinc-300 mb-2">Status *</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange("status", value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white flex-1">
                  {mode === "add" ? "Add Student" : "Update Student"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
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