"use client"
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { School as SchoolIcon, Search, MapPin, Edit, Trash2 } from "lucide-react"
import { ExternalLinkIcon } from "@/components/tiptap-icons/external-link-icon"
import { useState, useEffect } from "react"
import { SchoolFormDialog } from "@/components/dashboard/SchoolFormDialog"
import { supabase } from "@/lib/supabase"
import type { School } from "@/lib/types"

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>("add")
  const [editSchool, setEditSchool] = useState<School | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSchools() {
      setLoading(true)
      const { data, error } = await supabase.from('schools').select('*').order('created_at', { ascending: false })
      if (error) {
        setSchools([])
      } else {
        setSchools(data as School[])
      }
      setLoading(false)
    }
    fetchSchools()
  }, [])

  const filteredSchools = schools.filter(school => {
    const q = searchQuery.toLowerCase()
    return (
      (school.name?.toLowerCase().includes(q) ?? false) ||
      (school.location?.toLowerCase().includes(q) ?? false) ||
      (school.id?.toLowerCase().includes(q) ?? false)
    )
  })

  const totalSchools = schools.length
  const uniqueLocations = new Set(schools.map(s => s.location)).size

  const handleAdd = () => {
    setDialogMode("add")
    setEditSchool(null)
    setShowDialog(true)
  }
  const handleEdit = (school: School) => {
    setDialogMode("edit")
    setEditSchool(school)
    setShowDialog(true)
  }
  const handleDialogSubmit = async (school: Partial<School>) => {
    setSubmitting(true)
    if (dialogMode === "add") {
      const insertData = { ...school }
      delete insertData.id
      delete insertData.created_at
      const { data, error } = await supabase.from('schools').insert([insertData]).select()
      if (!error && data && data.length > 0) {
        setSchools(prev => [data[0] as School, ...prev])
      }
    } else if (dialogMode === "edit" && school.id) {
      const updateData = { ...school }
      delete updateData.id
      delete updateData.created_at
      const { data, error } = await supabase.from('schools').update(updateData).eq('id', school.id).select()
      if (!error && data && data.length > 0) {
        setSchools(prev => prev.map(s => s.id === school.id ? data[0] as School : s))
      }
    }
    setSubmitting(false)
    setShowDialog(false)
  }
  const handleDelete = async (school: School) => {
    if (!school.id) return
    if (!window.confirm(`Are you sure you want to delete "${school.name}"?`)) return
    setDeletingId(school.id)
    const { error } = await supabase.from('schools').delete().eq('id', school.id)
    if (!error) {
      setSchools(prev => prev.filter(s => s.id !== school.id))
    }
    setDeletingId(null)
  }

  // Prepare stats data to match courses/students layout
  const statsData = [
    {
      label: "Total Schools",
      value: totalSchools.toString(),
      sub: `Across ${uniqueLocations} locations`,
      icon: SchoolIcon,
    },
    {
      label: "Active Locations",
      value: uniqueLocations.toString(),
      sub: "Training facilities",
      icon: MapPin,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Schools" },
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
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Schools</h1>
            <p className="text-zinc-400 text-sm">
              Manage and view all registered schools
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search schools..."
                className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-teal-700 hover:bg-teal-800 text-white" onClick={handleAdd}>
              + Add School
            </Button>
          </div>
        </div>
        <div className="mt-0">
          {loading ? (
            <div className="text-center text-zinc-400 py-8">Loading schools...</div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-sm text-zinc-400 mb-4">
              No schools found. Add your first school to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-zinc-200">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Location</th>
                    <th className="py-2 px-4 text-left">Created At</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.map(school => (
                    <tr key={school.id} className="border-b border-zinc-800 hover:bg-zinc-950">
                      <td className="py-2 px-4 font-mono text-xs">{school.id?.slice(0, 8)}</td>
                      <td className="py-2 px-4 flex items-center gap-2">
                        {school.logo_url && (
                          <img src={school.logo_url} alt="logo" className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <span>{school.name}</span>
                      </td>
                      <td className="py-2 px-4">{school.location}</td>
                      <td className="py-2 px-4">{school.created_at ? new Date(school.created_at).toLocaleDateString() : ""}</td>
                      <td className="py-2 px-4">
                        <button
                          className="p-1 hover:bg-zinc-800 rounded"
                          onClick={() => handleEdit(school)}
                          title="Edit"
                          disabled={deletingId === school.id}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {school.website && (
                          <a
                            href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                            className=" p-1 hover:bg-zinc-800 rounded ml-2 text-teal-400 inline-block"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open Website"
                            onClick={e => e.stopPropagation()}
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          className="p-1 hover:bg-zinc-800 rounded ml-2 text-red-400"
                          onClick={() => handleDelete(school)}
                          title="Delete"
                          disabled={deletingId === school.id}
                        >
                          {deletingId === school.id ? (
                            <span className="w-4 h-4 animate-spin">⏳</span>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <SchoolFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode={dialogMode}
        initialValues={editSchool ?? undefined}
        onSubmit={handleDialogSubmit}
        isSubmitting={submitting}
      />
    </div>
  )
} 