"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Clock, Star, ImageIcon, X, Plus, ExternalLink } from "lucide-react"
// import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Course, School } from "@/lib/types"
import { supabase } from "@/lib/supabase"

import { deleteCourseWithCleanup } from "@/lib/actions"
import { validateImageFile, formatFileSize } from "@/lib/image-validation"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

interface CourseFormProps {
  mode: "add" | "edit"
  initialValues?: Partial<Course>
  onSubmit: (data: Course, newImageFiles: File[], deletedImageUrls: string[]) => void
  isSubmitting?: boolean
}

const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"]
const statusOptions = ["Draft", "Published", "Archived"]

const environmentOptions = [
  "Deciduous Forest",
  "Coniferous Forest",
  "Desert",
  "Mountain",
  "Coastal",
  "Prairie",
  "Wetland",
  "Urban",
  "Arctic",
  "Tropical",
  "Alpine Tundra",
  "Arctic Tundra",
  "Tropical Rain Forest",
  "Urban Sprawl",
  "Grassland",
]

// Utility: Chunked upload for a single file
async function uploadImageInChunks(
  file: File,
  courseId: string,
  onProgress?: (done: number, total: number) => void
): Promise<string> {
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const fileId = uuidv4();
  let publicUrl: string | null = null;

  console.log(`Starting chunked upload for ${file.name}:`, {
    fileType: file.type,
    fileSize: file.size,
    totalChunks,
    courseId
  });

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, (i + 1) * CHUNK_SIZE);
    const chunk = file.slice(start, end);
    const res = await fetch('/api/upload-chunk', {
      method: 'POST',
      headers: {
        'x-file-id': fileId,
        'x-chunk-index': i.toString(),
        'x-total-chunks': totalChunks.toString(),
        'x-original-name': file.name,
        'x-course-id': courseId || 'temp',
        'x-file-type': file.type, // Add file type to headers
      },
      body: chunk,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Upload failed at chunk ${i}: ${errorData.error || res.statusText}`);
    }
    
    const data = await res.json();
    if (onProgress) onProgress(i + 1, totalChunks);
    if (data.status === 'file_complete' && data.publicUrl) {
      publicUrl = data.publicUrl;
      console.log(`Upload completed for ${file.name}:`, data.publicUrl);
    }
  }
  if (!publicUrl) throw new Error('Failed to upload image');
  return publicUrl;
}

export function CourseForm({ mode, initialValues, onSubmit, isSubmitting }: CourseFormProps) {
  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    price: 0,
    duration: 1,
    difficulty: "Beginner",
    environment: [],
    prerequisites: "",
    skills: [],
    location: "",
    status: "Draft",
    photo_url: [],
    course_type: undefined,
    school_id: "",
    ...initialValues,
  })

  const [courseTypes, setCourseTypes] = useState<{ id: string; name: string }[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([])

  // Add these new state variables after the existing useState declarations
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const router = useRouter();
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    const fetchCourseTypes = async () => {
      // Fetch all course types from the 'course_types' table.
      const { data, error } = await supabase.from("course_types").select("id, name")
      if (error) {
        console.error("Error fetching course types:", error.message)
      } else if (data) {
        setCourseTypes(data)
      }
    }
    fetchCourseTypes()

    // Fetch schools from Supabase
    const fetchSchools = async () => {
      const { data, error } = await supabase.from("schools").select("id, name")
      if (error) {
        console.error("Error fetching schools:", error.message)
      } else if (data) {
        setSchools(data)
      }
    }
    fetchSchools()
  }, [])

  useEffect(() => {
    if (mode === "add" && initialValues) {
      setCourse(prev => ({ ...prev, ...initialValues }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  const addSkill = (skill: string) => {
    if (skill && !(course.skills || []).includes(skill)) {
      setCourse((prev) => ({ ...prev, skills: [...(prev.skills || []), skill] }))
    }
    setNewSkill("")
  }

  const removeSkill = (skill: string) => {
    setCourse((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skill),
    }))
  }

  const removePhoto = (photo: string) => {
    // Check if it's a preview URL from a newly added file
    if (photo.startsWith('blob:')) {
      const fileIndex = imagePreviews.indexOf(photo);
      if (fileIndex > -1) {
        URL.revokeObjectURL(photo); // Clean up blob URL
        setImagePreviews(prev => prev.filter((_, i) => i !== fileIndex));
        setNewImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
    } else {
      // It's an existing photo URL from the database
      setDeletedImageUrls(prev => [...prev, photo]);
      setCourse(prev => ({ ...prev, photo_url: prev.photo_url.filter(p => p !== photo) }));
    }
  };

  // Add these new functions after the existing functions
  const handleFileUpload = (files: FileList) => {
    const fileList = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileList.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    // Show errors if any
    if (errors.length > 0) {
      toast.error(`Some files couldn't be uploaded:\n${errors.join('\n')}`, {
        duration: 5000,
        closeButton: true
      });
    }

    // Add valid files
    if (validFiles.length > 0) {
      setNewImageFiles(prev => [...prev, ...validFiles]);
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);

      // Show success message
      if (validFiles.length === 1) {
        toast.success(`Added ${validFiles[0].name} (${formatFileSize(validFiles[0].size)})`);
      } else {
        toast.success(`Added ${validFiles.length} images`);
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const allImages = [...course.photo_url, ...imagePreviews];
    const newOrderedImages = [...allImages];
    const [movedItem] = newOrderedImages.splice(fromIndex, 1);
    newOrderedImages.splice(toIndex, 0, movedItem);

    const newPhotoUrls: string[] = [];
    const newPreviews: string[] = [];
    const newFiles: File[] = [];

    newOrderedImages.forEach(img => {
      if (img.startsWith('blob:')) {
        const previewIndex = imagePreviews.indexOf(img);
        if (previewIndex > -1) {
          newPreviews.push(img);
          newFiles.push(newImageFiles[previewIndex]);
        }
      } else {
        newPhotoUrls.push(img);
      }
    });

    setCourse(prev => ({ ...prev, photo_url: newPhotoUrls }));
    setImagePreviews(newPreviews);
    setNewImageFiles(newFiles);
  }

  const setFeaturedImage = (index: number) => {
    moveImage(index, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    // Only require school_id if publishing
    if (course.status === "Published" && !course.school_id) {
      setFormError("A school must be selected to publish a course. Save as draft or select a school.");
      return;
    }
    // Fix: set school_id to undefined if empty string
    const courseToSubmit = {
      ...course,
      school_id: course.school_id === "" ? undefined : course.school_id,
    };
    const uploadedUrls = [...courseToSubmit.photo_url];
    if (newImageFiles.length > 0) {
      toast.info('Uploading images...');
      try {
        for (let idx = 0; idx < newImageFiles.length; idx++) {
          const file = newImageFiles[idx];
          toast.info(`Uploading ${file.name} (${idx + 1}/${newImageFiles.length})`);
          
          let url: string;
          try {
            // Try chunked upload first
            url = await uploadImageInChunks(file, courseToSubmit.id || 'temp');
          } catch (chunkedError) {
            console.warn(`Chunked upload failed for ${file.name}, trying direct upload:`, chunkedError);
            
            // Fallback to direct upload for webp files or if chunked upload fails
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/test-direct-upload', {
              method: 'POST',
              body: formData
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(`Direct upload failed: ${errorData.error || response.statusText}`);
            }
            
            const result = await response.json();
            if (!result.success) {
              throw new Error(`Direct upload failed: ${result.error}`);
            }
            
            url = result.publicUrl;
          }
          
          uploadedUrls.push(url);
        }
        toast.success('All images uploaded!');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast.error('Image upload failed: ' + errorMsg);
        return;
      }
    }
    onSubmit({ ...courseToSubmit, photo_url: uploadedUrls }, [], deletedImageUrls);
  };

  const allImages = [...course.photo_url, ...imagePreviews];

  const handleDeleteCourse = async () => {
    if (!course.id) return;
    try {
      const result = await deleteCourseWithCleanup(course.id);
      
      if (result.success) {
        toast.success('Course deleted successfully!');
        router.push('/dashboard/courses');
      } else {
        toast.error(result.message);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course.');
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">{mode === "edit" ? "Edit Course" : "Add New Course"}</h1>
        <p className="text-zinc-400">Create and manage survival courses for the LiveThrough marketplace</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content - 2fr equivalent */}
        <div className="col-span-2 space-y-6">
          {/* Combined Course Details */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Course Details</CardTitle>
              <CardDescription className="text-zinc-400">Essential course details, pricing, and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-zinc-400 mb-2">
                  Course Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  required
                  value={course.title}
                  onChange={(e) => setCourse((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Winter Survival Basics"
                  className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
                />
              </div>
              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-zinc-400 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price (USD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={course.price}
                    onChange={(e) => setCourse((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="299"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-zinc-400 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration (days)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={course.duration}
                    onChange={(e) => setCourse((prev) => ({ ...prev, duration: parseInt(e.target.value, 10) || 1 }))}
                    min="1"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                </div>
              </div>
              {/* Difficulty & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-400 mb-2">Difficulty Level</Label>
                  <Select
                    value={course.difficulty}
                    onValueChange={(value) => setCourse((prev) => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-zinc-50 focus:bg-zinc-700">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-zinc-400 mb-2">Course Type</Label>
                  <Select
                    value={course.course_type_id || ""}
                    onValueChange={(value) => setCourse((prev) => ({ ...prev, course_type_id: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-50">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {courseTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="text-zinc-50 focus:bg-zinc-700">
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Location & Environment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-zinc-400 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={course.location}
                    onChange={(e) => setCourse((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Alaska, USA"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 mb-2 block">Environment Type</Label>
                  <div className="flex gap-2 mb-3">
                    <Select
                      value={course.environment[0] || ""}
                      onValueChange={env => setCourse(prev => ({ ...prev, environment: [env] }))}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-50">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {environmentOptions.map(env => (
                            <SelectItem key={env} value={env} className="text-zinc-50 focus:bg-zinc-700">
                              {env}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Skills */}
              <div>
                <h3 className="font-semibold text-zinc-100 mb-2">Skills Taught</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        if (newSkill.trim()) {
                          newSkill.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => addSkill(skill));
                        }
                      }
                    }}
                    placeholder="e.g., Bow Hunting, Trapping, Edible Plants"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
                  />
                  <Button
                    onClick={() => {
                      if (newSkill.trim()) {
                        newSkill.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => addSkill(skill));
                      }
                    }}
                    disabled={!newSkill.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {course.skills && course.skills.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-zinc-400 hover:bg-zinc-800 hover:text-teal-400"
                      onClick={() => setCourse(prev => ({ ...prev, skills: [] }))}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(course.skills || []).map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Images */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Course Images
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Upload and manage photos to showcase your course. The first image will be your featured image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allImages.length === 0 ? (
                // Large dropzone when no images are present
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver ? "border-teal-500 bg-teal-500/10" : "border-zinc-600 hover:border-zinc-500"
                  }`}
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                  <p className="text-zinc-400 mb-2">
                    Drag and drop images here, or{" "}
                    <label className="text-teal-400 hover:text-teal-300 cursor-pointer underline">
                      browse files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-zinc-500">Supports JPG, PNG, GIF, WebP up to 10MB each. Images will be optimized and converted to WebP format for better performance.</p>
                </div>
              ) : (
                // Grid view when images are present, with upload box as the first item
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-zinc-300">Uploaded Images ({allImages.length})</h4>
                    <p className="text-xs text-zinc-500">Drag to reorder</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Upload Area as a card */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors flex flex-col justify-center items-center aspect-[3/2] ${
                        isDragOver ? "border-teal-500 bg-teal-500/10" : "border-zinc-600 hover:border-zinc-500"
                      }`}
                    >
                      <ImageIcon className="h-8 w-8 text-zinc-400 mb-2" />
                      <p className="text-xs text-zinc-400">
                        <label className="text-teal-400 hover:text-teal-300 cursor-pointer underline">
                          Add more images
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">or drag & drop</p>
                    </div>

                    {/* Image Thumbnails */}
                    {allImages.map((url, index) => (
                      <div
                        key={url}
                        draggable
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          if (draggedIndex !== null && draggedIndex !== index) {
                            moveImage(draggedIndex, index)
                          }
                          setDraggedIndex(null)
                        }}
                        className="relative group cursor-move"
                      >
                        <div className="relative">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Course image ${index + 1}`}
                            width={300}
                            height={200}
                            className="w-full aspect-[3/2] object-cover rounded-lg bg-zinc-800"
                          />

                          {/* Featured Badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                              Featured
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            {index !== 0 && (
                              <button
                                onClick={() => setFeaturedImage(index)}
                                className="bg-teal-600 hover:bg-teal-700 text-white rounded p-1 text-xs"
                                title="Set as featured"
                              >
                                <Star className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => removePhoto(url)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded p-1"
                              title="Delete image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Image Info */}
                        <div className="mt-2 text-xs text-zinc-400">
                          {index === 0 ? "Featured Image" : `Image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Course Description</CardTitle>
              <CardDescription className="text-zinc-400">Detailed course description and overview</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Label htmlFor="description" className="text-zinc-400 mb-2">
                Add an overview of your course here.
              </Label> */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden">
                <SimpleEditor
                  value={course.description || ""}
                  onChange={val => setCourse(prev => ({ ...prev, description: val }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1fr equivalent */}
        <div className="space-y-6">
          {/* Publishing Settings */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Publishing</CardTitle>
              <CardDescription className="text-zinc-400">Control course visibility and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-400 mb-2">Status</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={course.status}
                    onValueChange={(value) =>
                      setCourse((prev) => ({
                        ...prev,
                        status: value as "Draft" | "Published" | "Archived",
                      }))
                    }
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="text-zinc-50 focus:bg-zinc-700">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {course.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 flex items-center gap-1 text-teal-500 hover:text-teal-400"
                      type="button"
                      onClick={() => window.open(`/marketplace/courses/${course.id}`, '_blank')}
                      tabIndex={0}
                    >View
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* <Separator className="bg-zinc-700" />

              <div className="flex items-center justify-between">
                <Label className="text-zinc-400 mb-2">Featured Course</Label>
                <Switch className="data-[state=checked]:bg-teal-600" />
              </div> */}

              <Separator className="bg-zinc-700 mb-7" />

              <div className="space-y-3">
                {/* <div className="text-sm text-zinc-400 text-center mb-2">
                  Last updated: {course.id ? new Date().toLocaleDateString() : "Never"}
                </div> */}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!course.title.trim() || (course.status === "Published" && !course.school_id) || isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : course.id ? "Update Course" : "Create Course"}
                </Button>
                {formError && (
                  <div className="text-red-400 text-sm mt-2 text-center">{formError}</div>
                )}
                {course.id && (
                  <>
                    <Button variant="link" className="w-full text-gray-400 hover:text-red-500" onClick={() => setShowDeleteDialog(true)}>
                      Delete Course
                    </Button>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Course</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this course? This action cannot be undone.<br/>
                            <span className="block mt-4 mb-2 font-medium">Type <span className="bg-zinc-800 px-2 py-1 rounded text-red-400">delete course</span> to confirm.</span>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={e => setDeleteConfirmText(e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 mt-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="delete course"
                              autoFocus
                            />
                            {deleteConfirmText && deleteConfirmText !== "delete course" && (
                              <span className="text-xs text-red-400 mt-1 block">You must type <b>delete course</b> to enable deletion.</span>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" onClick={() => setDeleteConfirmText("")}>Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={handleDeleteCourse} disabled={deleteConfirmText !== "delete course"}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* School Assignment */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Survival School</CardTitle>
              <CardDescription className="text-zinc-400">
                Select your school to display your contact info on this course. Schools are required to publish a course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-400 mb-2">
                  Select a school<span className="text-red-400">*</span>
                </Label>
                <Select
                  value={course.school_id}
                  onValueChange={(value) => setCourse((prev) => ({ ...prev, school_id: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-50">
                    <SelectValue placeholder="your school here..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id} className="text-zinc-50 focus:bg-zinc-700">
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 