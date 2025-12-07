"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
}

export function CourseFormDialog({ open, onOpenChange, mode }: CourseFormDialogProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    school: "",
    duration: "",
    difficulty: "",
    price: "",
    maxCapacity: "",
    location: "",
    status: "Draft",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{mode === "add" ? "Add New Course" : "Edit Course"}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {mode === "add" ? "Create a new survival course for LiveThrough." : "Update the course information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">
                Course Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                placeholder="e.g., Wilderness Survival Basics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school" className="text-zinc-300">
                School
              </Label>
              <Select value={formData.school} onValueChange={(value) => handleInputChange("school", value)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="john-smith">John Smith</SelectItem>
                  <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="mike-davis">Mike Davis</SelectItem>
                  <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              placeholder="Describe what students will learn in this course..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-zinc-300">
                Duration
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                placeholder="e.g., 3 days"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-zinc-300">
                Difficulty
              </Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
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
            <div className="space-y-2">
              <Label htmlFor="price" className="text-zinc-300">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                placeholder="299"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxCapacity" className="text-zinc-300">
                Max Capacity
              </Label>
              <Input
                id="maxCapacity"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => handleInputChange("maxCapacity", e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-zinc-300">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-zinc-300">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              placeholder="e.g., Rocky Mountains, CO"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white">
              {mode === "add" ? "Create Course" : "Update Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
