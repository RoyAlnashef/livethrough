'use client'

import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, MoreVertical, Edit, Trash2, Archive, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  email: string
  full_name: string
  phone: string | null
  created_at: string
  last_sign_in: string | null
  status?: string // For future use (e.g., Active/Archived)
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [totalStudents, setTotalStudents] = useState(0)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
  const [deleteType, setDeleteType] = useState<'single' | 'bulk'>('single')
  const itemsPerPage = 25
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setStudents(data || [])
      setTotalStudents(count || 0)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(
        filteredStudents
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map(student => student.id)
      )
      setSelectedRows(newSelected)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(studentId)
    } else {
      newSelected.delete(studentId)
    }
    setSelectedRows(newSelected)
  }

  const confirmDelete = (ids: string[], type: 'single' | 'bulk') => {
    setPendingDeleteIds(ids)
    setDeleteType(type)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirmed = async () => {
    setShowDeleteDialog(false)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .in('id', pendingDeleteIds)
      if (error) throw error
      // Refresh students after deletion
      fetchStudents()
      setSelectedRows(new Set())
    } catch (error) {
      console.error('Error deleting student(s):', error)
    }
  }

  // Stats data for cards
  const statsData = [
    {
      label: "Total Students",
      value: totalStudents.toString(),
      sub: "Active accounts",
      icon: Users,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Students" },
        ]}
      />

      {/* Stats Cards */}
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

      {/* Management Section */}
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 mt-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Student Management</h2>
            <p className="text-zinc-400 text-sm">
              Manage all students registered through LiveThrough
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
                      // onClick={() => {}}
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
                placeholder="Search students..."
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
              onClick={() => router.push("/dashboard/students/add")}
            >
              + Add Student
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-2 px-3 text-left font-semibold">
                  <Checkbox
                    checked={selectedRows.size === filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length && filteredStudents.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-zinc-700"
                  />
                </th>
                <th className="py-2 px-3 text-left font-semibold">Name</th>
                <th className="py-2 px-3 text-left font-semibold">Email</th>
                <th className="py-2 px-3 text-left font-semibold">Phone</th>
                <th className="py-2 px-3 text-left font-semibold">Joined</th>
                <th className="py-2 px-3 text-left font-semibold">Last Sign In</th>
                <th className="py-2 px-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-zinc-400">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-zinc-400">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <Checkbox
                          checked={selectedRows.has(student.id)}
                          onCheckedChange={(checked) => handleSelectRow(student.id, checked as boolean)}
                          className="border-zinc-700"
                        />
                      </td>
                      <td className="py-2 px-3 font-medium text-white whitespace-nowrap">{student.full_name}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{student.email}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{student.phone || '-'}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{new Date(student.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{student.last_sign_in ? new Date(student.last_sign_in).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem 
                              className="text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                              onClick={() => router.push(`/dashboard/students/${student.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-800 cursor-pointer">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Student
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer" onClick={() => confirmDelete([student.id], 'single')}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-zinc-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredStudents.length / itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(filteredStudents.length / itemsPerPage)}
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
                ? `Are you sure you want to delete ${pendingDeleteIds.length} students? This action cannot be undone.`
                : 'Are you sure you want to delete this student? This action cannot be undone.'}
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