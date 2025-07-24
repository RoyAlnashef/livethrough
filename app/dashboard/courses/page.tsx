"use client";

import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, MapPin, X, MoreVertical, Edit, Trash2, Archive, CheckCircle, Undo, ExternalLink, Download, Loader2, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link"
import { toast } from "sonner"
import { CourseImportModal } from "@/components/dashboard/course-import-modal"
import { copyCoursePhotoToNewCourse } from "@/lib/supabase-storage";
import { deleteCourseWithCleanup } from "@/lib/actions";

interface Course {
  id: string
  title: string
  status: string
  enrolled?: number
  max_students?: number
  location: string
  created_at: string
  schools: {
    id: string
    name: string
  }
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Published"
      ? "bg-green-900 text-green-400"
      : status === "Draft"
      ? "bg-zinc-800 text-zinc-400"
      : "bg-zinc-700 text-zinc-300";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
}

// Utility to omit keys from an object
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const itemsPerPage = 25
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    locations: 0,
    revenue: 0
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [deleteType, setDeleteType] = useState<'single' | 'bulk'>('single');
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  
  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => {
    const searchLower = searchQuery.toLowerCase()
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.id.toLowerCase().includes(searchLower) ||
      course.schools?.name.toLowerCase().includes(searchLower) ||
      course.location.toLowerCase().includes(searchLower) ||
      course.status.toLowerCase().includes(searchLower)
    )
  })

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const fetchCourses = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('id,title,created_at,status,location,schools(id,name)')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching courses:', error)
        return
      }

      if (data) {
        const transformedData = data.map(course => ({
          ...course,
          schools: Array.isArray(course.schools) ? course.schools[0] : course.schools
        }));
        setCourses(transformedData as Course[]);
        
        // Calculate stats
        const uniqueLocations = new Set(data.map(course => course.location))
        
        setStats({
          totalCourses: data.length,
          activeStudents: 0,
          locations: uniqueLocations.size,
          revenue: 0
        })
      }
      setLoading(false)
    }

  useEffect(() => {
    fetchCourses()
  }, [])

  const statsData = [
    {
      label: "Total Courses",
      value: stats.totalCourses.toString(),
      sub: "Active courses",
      icon: BookOpen,
    },
    {
      label: "Locations",
      value: stats.locations.toString(),
      sub: "Unique locations",
      icon: MapPin,
    },
  ]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(
        filteredCourses
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map(course => course.id)
      )
      setSelectedRows(newSelected)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (courseId: string, index: number, shiftKey: boolean) => {
    const newSelected = new Set(selectedRows);
    const isChecked = selectedRows.has(courseId);
    if (shiftKey && lastClickedIndex !== null) {
      // Shift+click: select range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const visibleCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      const shouldCheck = !isChecked;
      for (let i = start; i <= end; i++) {
        const id = visibleCourses[i].id;
        if (shouldCheck) {
          newSelected.add(id);
        } else {
          newSelected.delete(id);
        }
      }
    } else {
      if (isChecked) {
        newSelected.delete(courseId);
      } else {
        newSelected.add(courseId);
      }
      setLastClickedIndex(index);
    }
    setSelectedRows(newSelected);
  };

  const confirmDelete = (ids: string[], type: 'single' | 'bulk') => {
    setPendingDeleteIds(ids);
    setDeleteType(type);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    setShowDeleteDialog(false);
    
    try {
      toast.loading('Deleting course(s)...');
      
      // Delete each course with proper cleanup
      const results = await Promise.allSettled(
        pendingDeleteIds.map(id => deleteCourseWithCleanup(id))
      );
      
      // Process results
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
      
      if (successful.length > 0) {
        toast.success(`Successfully deleted ${successful.length} course(s)`);
      }
      
      if (failed.length > 0) {
        const errorMessages = failed.map(r => 
          r.status === 'rejected' ? 'Unknown error' : r.value.message
        );
        toast.error(`Failed to delete ${failed.length} course(s): ${errorMessages.join(', ')}`);
      }
      
      // Refresh courses list
      await fetchCourses();
      setSelectedRows(new Set());
      
    } catch (error) {
      console.error('Error in handleDeleteConfirmed:', error);
      toast.error('An unexpected error occurred during deletion');
    }
  };

  const handleRowStatusChange = async (courseId: string, newStatus: "Published" | "Draft") => {
    // Find the course
    const course = courses.find(c => c.id === courseId);
    if (newStatus === "Published") {
      if (!course?.title || !course?.schools?.name) {
        toast.error("Cannot publish: Course is missing name or school.");
        return;
      }
    }
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);
      if (error) throw error;
      toast.success(`Course ${newStatus === 'Published' ? 'published' : 'unpublished'} successfully!`);
      // Refresh courses
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('id,title,created_at,status,location,schools(id,name)')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      if (data) {
        const transformedData = data.map(course => ({
          ...course,
          schools: Array.isArray(course.schools) ? course.schools[0] : course.schools
        }));
        setCourses(transformedData as Course[]);
      }
      setSelectedRows(new Set());
    } catch (error) {
      toast.error('Error updating course status.');
      console.error(error);
    }
  }

  const handleBulkStatusChange = async (newStatus: "Published" | "Draft") => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .in('id', Array.from(selectedRows));
      if (error) throw error;
      toast.success(`${newStatus === 'Published' ? 'Published' : 'Unpublished'} ${selectedRows.size} courses successfully!`);
      // Refresh courses
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('id,title,created_at,status,location,schools(id,name)')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      if (data) {
        const transformedData = data.map(course => ({
          ...course,
          schools: Array.isArray(course.schools) ? course.schools[0] : course.schools
        }));
        setCourses(transformedData as Course[]);
      }
      setSelectedRows(new Set());
    } catch (error) {
      toast.error('Error updating course status.');
      console.error(error);
    }
  }

  const handleImportSuccess = (courseData: {
    title: string
    description: string
    price: number
    duration: number
    difficulty: string
    location: string
    course_type: string
  }) => {
    // TODO: This will be enhanced in Step 7 to pre-populate the course form
    // For now, we'll redirect to the add course page with the data
    console.log("Imported course data:", courseData)
    toast.success("Course data imported! Redirecting to course form...")
    
    // Store the imported data in sessionStorage for the course form to access
    sessionStorage.setItem('importedCourseData', JSON.stringify(courseData))
    
    // Redirect to the add course page
    router.push("/dashboard/courses/add")
  }

  // Helper: check if any selected course is missing a school
  const anySelectedMissingSchool = Array.from(selectedRows).some(
    id => {
      const course = courses.find(c => c.id === id);
      return !course?.schools?.id;
    }
  );

  // Handler to duplicate a course


  const handleDuplicateCourse = async (courseId: string) => {
    setDuplicatingId(courseId);
    try {
      // 1. Fetch full course data (including photo_url)
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      if (error || !course) throw error || new Error('Course not found');

      // 2. Prepare new course object (empty photo_url for now)
      const newCourse = {
        ...omit(course, ['id', 'created_at', 'updated_at']),
        status: 'Draft',
        photo_url: [], // We'll update this after copying images
      };

      // 3. Insert new course to get its ID
      const { data: inserted, error: insertError } = await supabase
        .from('courses')
        .insert([newCourse])
        .select()
        .single();
      if (insertError || !inserted) throw insertError || new Error('Failed to insert duplicate');

      const newCourseId = inserted.id;

      // 4. Copy each image to the new course's folder
      let originalPhotoUrls: string[] = [];
      if (Array.isArray(course.photo_url)) {
        originalPhotoUrls = course.photo_url;
      } else if (typeof course.photo_url === "string" && course.photo_url.startsWith("[")) {
        try {
          originalPhotoUrls = JSON.parse(course.photo_url);
        } catch {
          originalPhotoUrls = [];
        }
      }

      const newPhotoUrls: string[] = [];
      for (const imageUrl of originalPhotoUrls) {
        try {
          // You can add a toast or console.log here for debugging
          const newUrl = await copyCoursePhotoToNewCourse(supabase, imageUrl, newCourseId);
          newPhotoUrls.push(newUrl);
        } catch (err) {
          console.error(`Failed to copy image: ${imageUrl}`, err);
        }
      }

      // 5. Update the photo_url in the new course's row
      const { error: updateError } = await supabase
        .from('courses')
        .update({ photo_url: newPhotoUrls })
        .eq('id', newCourseId);
      if (updateError) throw updateError;

      toast.success('Course duplicated as draft!');
      // 4. Redirect to edit page for new course
      router.push(`/dashboard/courses/${newCourseId}`);
    } catch (err: unknown) {
      let message = 'Unknown error';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        message = (err as { message?: unknown }).message as string;
      }
      toast.error('Failed to duplicate course: ' + message);
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Courses" },
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-950 rounded-xl p-5 flex flex-col gap-2 border border-zinc-800 relative"
          >
            <stat.icon className="absolute right-4 top-4 w-6 h-6 text-zinc-700" />
            <div className="text-zinc-400 text-xs font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 mt-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Course Management</h2>
            <p className="text-zinc-400 text-sm">
              Manage all survival courses offered through LiveThrough
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {selectedRows.size > 0 && (
              <div className="flex gap-2 mr-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 px-4 py-2"
                    >
                      Actions ({selectedRows.size})
                      <MoreVertical className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                    <DropdownMenuItem 
                      className={`text-green-400 hover:bg-zinc-800 hover:text-green-300 cursor-pointer ${anySelectedMissingSchool ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
                      onClick={() => !anySelectedMissingSchool && handleBulkStatusChange('Published')}
                      disabled={anySelectedMissingSchool}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                      onClick={() => handleBulkStatusChange('Draft')}
                    >
                      <Undo className="h-4 w-4 mr-2" />
                      Unpublish Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                      onClick={() => confirmDelete(Array.from(selectedRows), 'bulk')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer"
                      onClick={() => confirmDelete(Array.from(selectedRows), 'bulk')}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="relative w-full md:w-[400px]">
              <Input
                placeholder="Search courses..."
                className="bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800 font-semibold px-4 py-2 rounded-sm flex items-center gap-2"
              onClick={() => setShowImportModal(true)}
            >
              <Download className="h-4 w-4" />
              Import
            </Button>
            <Button
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2 rounded-sm"
              onClick={() => router.push("/dashboard/courses/add")}
            >
              + Add Course
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-2 px-3 text-left font-semibold">
                  <Checkbox
                    checked={selectedRows.size === filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length}
                    onCheckedChange={handleSelectAll}
                    className="border-zinc-700"
                  />
                </th>
                <th className="py-2 px-3 text-left font-semibold">ID</th>
                <th className="py-2 px-3 text-left font-semibold">Course</th>
                <th className="py-2 px-3 text-left font-semibold">School</th>
                <th className="py-2 px-3 text-left font-semibold">Status</th>
                <th className="py-2 px-3 text-left font-semibold">Location</th>
                <th className="py-2 px-3 text-left font-semibold">Created At</th>
                <th className="py-2 px-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-zinc-400">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-zinc-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                filteredCourses
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((course, idx) => {
                    console.log('Course status:', course.status);
                    return (
                      <tr
                        key={course.id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <Checkbox
                            checked={selectedRows.has(course.id)}
                            onClick={(event) => handleSelectRow(course.id, idx, event.shiftKey)}
                            className="border-zinc-700"
                          />
                        </td>
                        <td className="py-2 px-3 text-zinc-400 font-mono whitespace-nowrap">
                          <Link href={`/dashboard/courses/${course.id}`} className="hover:underline">
                          {course.id.slice(0, 5)}...
                          </Link>
                        </td>
                        <td className="py-2 px-3 font-medium text-white whitespace-nowrap">
                          <Link href={`/dashboard/courses/${course.id}`} className="hover:underline">
                            {course.title}
                          </Link>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{course.schools?.name || "No School"}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <StatusBadge status={course.status} />
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{course.location}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {new Date(course.created_at.replace(' ', 'T')).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer" onClick={() => window.open(`/marketplace/courses/${course.id}`, '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer" onClick={() => router.push(`/dashboard/courses/${course.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              {course.status === 'Published' ? (
                                <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer" onClick={async () => await handleRowStatusChange(course.id, 'Draft')}>
                                  <Undo className="h-4 w-4 mr-2" />
                                  Unpublish Course
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-400 hover:bg-zinc-800 hover:text-green-300 cursor-pointer" onClick={async () => await handleRowStatusChange(course.id, 'Published')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Publish Course
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer" onClick={() => confirmDelete([course.id], 'single')}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer" onClick={() => confirmDelete([course.id], 'single')}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Course
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                                onClick={() => handleDuplicateCourse(course.id)}
                                disabled={duplicatingId === course.id}
                              >
                                {duplicatingId === course.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-2" />
                                )}
                                Duplicate Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })
              )}
            </tbody>
          </table>
          {filteredCourses.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-zinc-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCourses.length / itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(filteredCourses.length / itemsPerPage)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteType === 'bulk'
                ? `Are you sure you want to delete ${pendingDeleteIds.length} courses? This action cannot be undone.`
                : 'Are you sure you want to delete this course? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CourseImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
} 