"use client";

import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, TrendingUp, Calendar, X, MoreVertical, Trash2, Download } from "lucide-react"
import { useState, useEffect } from "react"
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
} from "@/components/ui/dialog";
import { toast } from "sonner"
import { getNewsletterSubscriptions, deleteNewsletterSubscriptions } from "@/lib/newsletter-actions"

interface NewsletterSubscription {
  id: string
  email: string
  created_at: string
}

interface NewsletterStats {
  totalSubscribers: number
  newThisMonth: number
  newThisWeek: number
  growthRate: number
}

export default function NewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<NewsletterStats>({
    totalSubscribers: 0,
    newThisMonth: 0,
    newThisWeek: 0,
    growthRate: 0
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
  const [deleteType, setDeleteType] = useState<'single' | 'bulk'>('single')
  const itemsPerPage = 25

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const searchLower = searchQuery.toLowerCase()
    return (
      subscription.email.toLowerCase().includes(searchLower) ||
      subscription.id.toLowerCase().includes(searchLower) ||
      subscription.created_at.toLowerCase().includes(searchLower)
    )
  })

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const result = await getNewsletterSubscriptions()
      
      if (!result.success) {
        console.error('Error fetching subscriptions:', result.error)
        toast.error('Failed to load newsletter subscriptions')
        return
      }

      if (result.data) {
        setSubscriptions(result.data)
        
        // Calculate stats
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        const newThisWeek = result.data.filter((sub: NewsletterSubscription) => new Date(sub.created_at) >= oneWeekAgo).length
        const newThisMonth = result.data.filter((sub: NewsletterSubscription) => new Date(sub.created_at) >= oneMonthAgo).length
        
        // Calculate growth rate (comparing this month to last month)
        const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        const lastMonth = result.data.filter((sub: NewsletterSubscription) => {
          const date = new Date(sub.created_at)
          return date >= twoMonthsAgo && date < oneMonthAgo
        }).length
        
        const growthRate = lastMonth > 0 ? ((newThisMonth - lastMonth) / lastMonth) * 100 : 0
        
        setStats({
          totalSubscribers: result.data.length,
          newThisMonth,
          newThisWeek,
          growthRate
        })
      }
    } catch (error) {
      console.error('Error in fetchSubscriptions:', error)
      toast.error('Failed to load newsletter subscriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const statsData = [
    {
      label: "Total Subscribers",
      value: stats.totalSubscribers.toString(),
      sub: "Newsletter subscribers",
      icon: Users,
    },
    {
      label: "New This Month",
      value: stats.newThisMonth.toString(),
      sub: "Subscriptions this month",
      icon: Calendar,
    },
    {
      label: "New This Week",
      value: stats.newThisWeek.toString(),
      sub: "Subscriptions this week",
      icon: TrendingUp,
    },
    {
      label: "Growth Rate",
      value: `${stats.growthRate > 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%`,
      sub: "vs last month",
      icon: TrendingUp,
    },
  ]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(
        filteredSubscriptions
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map(subscription => subscription.id)
      )
      setSelectedRows(newSelected)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (subscriptionId: string) => {
    const newSelected = new Set(selectedRows)
    if (selectedRows.has(subscriptionId)) {
      newSelected.delete(subscriptionId)
    } else {
      newSelected.add(subscriptionId)
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
      toast.loading('Deleting subscription(s)...')
      
      const result = await deleteNewsletterSubscriptions(pendingDeleteIds)
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      toast.success(`Successfully deleted ${pendingDeleteIds.length} subscription(s)`)
      
      // Refresh subscriptions list
      await fetchSubscriptions()
      setSelectedRows(new Set())
      
    } catch (error) {
      console.error('Error in handleDeleteConfirmed:', error)
      toast.error('Failed to delete subscription(s)')
    }
  }

  const exportSubscriptions = async () => {
    try {
      const csvContent = [
        ['Email', 'Subscription Date'],
        ...subscriptions.map(sub => [
          sub.email,
          new Date(sub.created_at).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Subscriptions exported successfully')
    } catch (error) {
      console.error('Error exporting subscriptions:', error)
      toast.error('Failed to export subscriptions')
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Newsletter" },
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
            <h2 className="text-xl font-semibold text-white">Newsletter Management</h2>
            <p className="text-zinc-400 text-sm">
              Manage newsletter subscriptions and track subscriber growth
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
                placeholder="Search subscribers..."
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
              onClick={exportSubscriptions}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-2 px-3 text-left font-semibold">
                  <Checkbox
                    checked={selectedRows.size === filteredSubscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length}
                    onCheckedChange={handleSelectAll}
                    className="border-zinc-700"
                  />
                </th>
                <th className="py-2 px-3 text-left font-semibold">ID</th>
                <th className="py-2 px-3 text-left font-semibold">Email</th>
                <th className="py-2 px-3 text-left font-semibold">Subscription Date</th>
                <th className="py-2 px-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-zinc-400">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-zinc-400">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filteredSubscriptions
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <Checkbox
                          checked={selectedRows.has(subscription.id)}
                          onCheckedChange={() => handleSelectRow(subscription.id)}
                          className="border-zinc-700"
                        />
                      </td>
                      <td className="py-2 px-3 text-zinc-400 font-mono whitespace-nowrap">
                        {subscription.id.slice(0, 8)}...
                      </td>
                      <td className="py-2 px-3 font-medium text-white">
                        {subscription.email}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {new Date(subscription.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer"
                              onClick={() => confirmDelete([subscription.id], 'single')}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          {filteredSubscriptions.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-zinc-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubscriptions.length)} of {filteredSubscriptions.length} subscriptions
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSubscriptions.length / itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(filteredSubscriptions.length / itemsPerPage)}
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
                ? `Are you sure you want to delete ${pendingDeleteIds.length} subscription(s)? This action cannot be undone.`
                : 'Are you sure you want to delete this subscription? This action cannot be undone.'}
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