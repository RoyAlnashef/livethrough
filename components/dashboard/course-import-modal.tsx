"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Loader2, Globe, AlertCircle } from "lucide-react"

interface ImportedCourseData {
  title: string
  description: string
  price: number
  duration: number
  difficulty: string
  location: string
  course_type: string
  photo_url?: string[]
}

interface CourseImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportSuccess: (courseData: ImportedCourseData) => void
}

export function CourseImportModal({ open, onOpenChange, onImportSuccess }: CourseImportModalProps) {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleScanPage = async () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL")
      return
    }

    setIsScanning(true)
    setError("")

    try {
      const res = await fetch("/api/scrape-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to scan the page. Please check the URL and try again.")
        return
      }
      // Map images to photo_url if present
      const courseData = { ...data }
      if (Array.isArray(courseData.images)) {
        courseData.photo_url = courseData.images
        delete courseData.images
      }
      onImportSuccess(courseData)
      onOpenChange(false)
      setUrl("")
    } catch {
      setError("Failed to scan the page. Please check the URL and try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleClose = () => {
    setUrl("")
    setError("")
    setIsScanning(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-500" />
            Import Course from URL
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Our system will scan the page you provide and extract relevant course information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="course-url" className="text-zinc-200">
              Course URL
            </Label>
            <Input
              id="course-url"
              type="url"
              placeholder="https://example.com/survival-course"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              className="bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-500"
              disabled={isScanning}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="font-medium text-zinc-200 mb-2">What will be imported:</h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Course title and description</li>
              <li>• Pricing information</li>
              <li>• Duration and difficulty level</li>
              <li>• Location and course type</li>
              <li>• Course images (if available)</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
              disabled={isScanning}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleScanPage}
            disabled={isScanning || !url.trim()}
            className="bg-teal-700 hover:bg-teal-800 text-white"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning Page...
              </>
            ) : (
              "Scan Page"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 