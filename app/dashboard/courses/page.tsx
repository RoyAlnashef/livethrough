"use client";

import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, MapPin, BarChart3, X, MoreVertical, Edit, Trash2, Archive } from "lucide-react"
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

interface Course {
  id: string
  title: string
  duration: string
  difficulty: string
  price: number
  status: string
  enrolled: number
  max_students: number
  location: string
  schools: {
    id: string
    name: string
  }
}

function DifficultyBadge({ level }: { level: string }) {
  const color =
    level === "Beginner"
      ? "bg-green-900 text-green-400"
      : level === "Intermediate"
      ? "bg-yellow-900 text-yellow-400"
      : level === "Advanced"
      ? "bg-orange-900 text-orange-400"
      : "bg-red-900 text-red-400";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{level}</span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active"
      ? "bg-green-900 text-green-400"
      : status === "Draft"
      ? "bg-zinc-800 text-zinc-400"
      : "bg-zinc-700 text-zinc-300";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
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

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => {
    const searchLower = searchQuery.toLowerCase()
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.schools?.name.toLowerCase().includes(searchLower) ||
      course.location.toLowerCase().includes(searchLower) ||
      course.difficulty.toLowerCase().includes(searchLower) ||
      course.status.toLowerCase().includes(searchLower)
    )
  })

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('*, schools!inner(id, name)')
      
      if (error) {
        console.error('Error fetching courses:', error)
        return
      }

      if (data) {
        setCourses(data)
        
        // Calculate stats
        const uniqueLocations = new Set(data.map(course => course.location))
        const totalEnrolled = data.reduce((sum, course) => sum + course.enrolled, 0)
        const totalRevenue = data.reduce((sum, course) => sum + (course.price * course.enrolled), 0)
        
        setStats({
          totalCourses: data.length,
          activeStudents: totalEnrolled,
          locations: uniqueLocations.size,
          revenue: totalRevenue
        })
      }
      setLoading(false)
    }

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
      label: "Active Students",
      value: stats.activeStudents.toString(),
      sub: "Currently enrolled",
      icon: Users,
    },
    {
      label: "Locations",
      value: stats.locations.toString(),
      sub: "Unique locations",
      icon: MapPin,
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      sub: "Total revenue",
      icon: BarChart3,
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

  const handleSelectRow = (courseId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(courseId)
    } else {
      newSelected.delete(courseId)
    }
    setSelectedRows(newSelected)
  }

  const confirmDelete = (ids: string[], type: 'single' | 'bulk') => {
    setPendingDeleteIds(ids);
    setDeleteType(type);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    setShowDeleteDialog(false);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .in('id', pendingDeleteIds);
      if (error) throw error;
      // Refresh courses after deletion
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('*, schools!inner(id, name)');
      if (fetchError) throw fetchError;
      if (data) setCourses(data);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Error deleting course(s):', error);
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
            className="bg-zinc-900 rounded-xl p-5 flex flex-col gap-2 border border-zinc-800 relative"
          >
            <stat.icon className="absolute right-4 top-4 w-6 h-6 text-zinc-700" />
            <div className="text-zinc-400 text-xs font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mt-2">
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
                <th className="py-2 px-3 text-left font-semibold">Duration</th>
                <th className="py-2 px-3 text-left font-semibold">Difficulty</th>
                <th className="py-2 px-3 text-left font-semibold">Price</th>
                <th className="py-2 px-3 text-left font-semibold">Status</th>
                <th className="py-2 px-3 text-left font-semibold">Location</th>
                <th className="py-2 px-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-4 text-center text-zinc-400">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-4 text-center text-zinc-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                filteredCourses
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((course) => {
                    console.log('Course status:', course.status);
                    return (
                      <tr
                        key={course.id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <Checkbox
                            checked={selectedRows.has(course.id)}
                            onCheckedChange={(checked) => handleSelectRow(course.id, checked as boolean)}
                            className="border-zinc-700"
                          />
                        </td>
                        <td className="py-2 px-3 text-zinc-400 font-mono whitespace-nowrap">
                          {course.id.slice(0, 5)}...
                        </td>
                        <td className="py-2 px-3 font-medium text-white whitespace-nowrap">
                          {course.title}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{course.schools?.name || "No School"}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{course.duration}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <DifficultyBadge level={course.difficulty} />
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">${course.price}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <StatusBadge status={course.status} />
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{course.location}</td>
                        <td className="py-2 px-3 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer" onClick={() => router.push(`/dashboard/courses/${course.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer" onClick={() => confirmDelete([course.id], 'single')}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Course
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
    </div>
  )
} 