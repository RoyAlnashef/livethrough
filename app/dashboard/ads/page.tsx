"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { 
  Megaphone, 
  Settings, 
  BarChart3, 
  Code, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Copy,
  Check,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentUserRole } from "@/lib/auth-utils"

// Mock data for ad slots - in real implementation, this would come from database
const AD_SLOTS = [
  {
    id: "sidebar-top",
    name: "Sidebar Top",
    description: "Top of sidebar on course pages",
    size: "300x250",
    enabled: true,
    impressions: 1247,
    clicks: 23,
    ctr: 1.84,
    revenue: 45.67
  },
  {
    id: "content-between",
    name: "Content Between",
    description: "Between course content sections",
    size: "728x90",
    enabled: true,
    impressions: 2156,
    clicks: 67,
    ctr: 3.11,
    revenue: 89.23
  },
  {
    id: "footer",
    name: "Footer",
    description: "Bottom of page footer",
    size: "728x90",
    enabled: false,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    revenue: 0
  },
  {
    id: "marketplace-sidebar",
    name: "Marketplace Sidebar",
    description: "Sidebar on marketplace pages",
    size: "300x250",
    enabled: true,
    impressions: 892,
    clicks: 34,
    ctr: 3.81,
    revenue: 56.78
  }
]

export default function AdsPage() {
  const router = useRouter()
  const [adSlots, setAdSlots] = useState(AD_SLOTS)
  const [copiedSlot, setCopiedSlot] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string } | null>(null)
  const [analyticsData, setAnalyticsData] = useState<{ 
    data: unknown[]; 
    summary: { 
      impressions: number; 
      clicks: number; 
      totalEvents: number; 
      bySlot: Record<string, { impressions: number; clicks: number; ctr: number }> 
    } 
  } | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const handleToggleSlot = (slotId: string) => {
    setAdSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, enabled: !slot.enabled }
          : slot
      )
    )
  }

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const response = await fetch(`/api/ads/analytics?from=${getDateFromRange(dateRange)}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Analytics data received:', data)
        setAnalyticsData(data)
      } else {
        console.error('Failed to fetch analytics:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }, [dateRange])

  // Helper function to get date from range
  const getDateFromRange = (range: string) => {
    const now = new Date()
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  // Check admin access on component mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = await getCurrentUserRole()
        setCurrentUser(user)
        
        if (!user || user.role !== 'admin') {
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Error checking admin access:', error)
        router.push('/dashboard')
        return
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  // Fetch analytics when date range changes
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAnalytics()
    }
  }, [dateRange, currentUser, fetchAnalytics])

  const handleCopyCode = async (slotId: string) => {
    const code = `<AdSlot slotId="${slotId}" size="content" />`
    try {
      await navigator.clipboard.writeText(code)
      setCopiedSlot(slotId)
      setTimeout(() => setCopiedSlot(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Use real analytics data if available, otherwise fall back to mock data
  const totalImpressions = analyticsData?.summary?.impressions || adSlots.reduce((sum, slot) => sum + slot.impressions, 0)
  const totalClicks = analyticsData?.summary?.clicks || adSlots.reduce((sum, slot) => sum + slot.clicks, 0)
  const totalRevenue = 0 // No revenue tracking yet - would come from AdSense API
  const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0.00"
  
  // Check if we're showing real data
  const hasRealData = analyticsData?.summary && analyticsData.summary.totalEvents > 0

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumbs
          segments={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Ads" },
          ]}
        />
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumbs
          segments={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Ads" },
          ]}
        />
        <div className="text-zinc-400">Access denied. Admin privileges required.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Ads" },
        ]}
      />
      
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Advertisement Management</h1>
          <p className="text-zinc-400 text-sm">
            Manage ad slots, view performance analytics, and configure ad settings
          </p>
          {hasRealData && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-400">Live Analytics Data</span>
            </div>
          )}
          {!hasRealData && analyticsData && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-yellow-400">Demo Data (No live events yet)</span>
            </div>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Impressions</p>
                  <p className="text-xl font-semibold text-white">{totalImpressions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <MousePointer className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Clicks</p>
                  <p className="text-xl font-semibold text-white">{totalClicks.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Overall CTR</p>
                  <p className="text-xl font-semibold text-white">{overallCTR}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Megaphone className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Revenue</p>
                  <p className="text-xl font-semibold text-white">
                    {totalRevenue > 0 ? `$${totalRevenue.toFixed(2)}` : 'Not Available'}
                  </p>
                  {totalRevenue === 0 && (
                    <p className="text-xs text-zinc-500">Requires AdSense API integration</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
          <Label htmlFor="date-range" className="text-sm text-zinc-300">Date Range:</Label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 text-sm text-white"
            disabled={analyticsLoading}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
          {analyticsLoading && (
            <div className="text-sm text-zinc-400">Loading analytics...</div>
          )}
        </div>

        {/* Ad Slots Management */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Ad Slot Management
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Enable or disable ad slots and view their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adSlots.map((slot) => (
                <div key={slot.id} className="border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slot.enabled}
                          onCheckedChange={() => handleToggleSlot(slot.id)}
                        />
                        <span className="text-sm font-medium text-white">{slot.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {slot.size}
                      </Badge>
                      {slot.enabled ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(slot.id)}
                      className="border-zinc-700"
                    >
                      {copiedSlot === slot.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copiedSlot === slot.id ? "Copied!" : "Copy Code"}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-3">{slot.description}</p>
                  
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                     <div>
                       <p className="text-zinc-400">Impressions</p>
                       <p className="text-white font-medium">
                         {analyticsData?.summary?.bySlot?.[slot.id]?.impressions || slot.impressions}
                       </p>
                     </div>
                     <div>
                       <p className="text-zinc-400">Clicks</p>
                       <p className="text-white font-medium">
                         {analyticsData?.summary?.bySlot?.[slot.id]?.clicks || slot.clicks}
                       </p>
                     </div>
                     <div>
                       <p className="text-zinc-400">CTR</p>
                       <p className="text-white font-medium">
                         {analyticsData?.summary?.bySlot?.[slot.id]?.ctr || slot.ctr}%
                       </p>
                     </div>
                     <div>
                       <p className="text-zinc-400">Revenue</p>
                       <p className="text-white font-medium">
                         {slot.revenue > 0 ? `$${slot.revenue.toFixed(2)}` : 'N/A'}
                       </p>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ad Code Configuration */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Ad Code Configuration
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Manage AdSense client ID and slot configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adsense-client" className="text-sm text-zinc-300">
                Google AdSense Client ID
              </Label>
              <Input
                id="adsense-client"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="bg-zinc-800 border-zinc-700 text-white"
                defaultValue={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""}
              />
            </div>
            
            <div>
              <Label htmlFor="custom-ad-code" className="text-sm text-zinc-300">
                Custom Ad Code (Optional)
              </Label>
              <Textarea
                id="custom-ad-code"
                placeholder="Paste custom ad code here..."
                className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                Changes to ad configuration require a page refresh to take effect.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Analytics
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Detailed performance metrics for each ad slot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 text-zinc-400 font-medium">Ad Slot</th>
                    <th className="text-right py-2 text-zinc-400 font-medium">Impressions</th>
                    <th className="text-right py-2 text-zinc-400 font-medium">Clicks</th>
                    <th className="text-right py-2 text-zinc-400 font-medium">CTR</th>
                    <th className="text-right py-2 text-zinc-400 font-medium">Revenue</th>
                    <th className="text-right py-2 text-zinc-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                                     {adSlots.map((slot) => {
                     const realData = analyticsData?.summary?.bySlot?.[slot.id]
                     return (
                       <tr key={slot.id} className="border-b border-zinc-800/50">
                         <td className="py-3 text-white">{slot.name}</td>
                         <td className="py-3 text-right text-white">
                           {realData?.impressions || slot.impressions}
                         </td>
                         <td className="py-3 text-right text-white">
                           {realData?.clicks || slot.clicks}
                         </td>
                         <td className="py-3 text-right text-white">
                           {realData?.ctr || slot.ctr}%
                         </td>
                         <td className="py-3 text-right text-white">
                           {slot.revenue > 0 ? `$${slot.revenue.toFixed(2)}` : 'N/A'}
                         </td>
                         <td className="py-3 text-right">
                           <Badge 
                             className={cn(
                               slot.enabled 
                                 ? "bg-green-500/10 text-green-400 border-green-500/20"
                                 : "bg-zinc-800 text-zinc-400"
                             )}
                           >
                             {slot.enabled ? "Active" : "Disabled"}
                           </Badge>
                         </td>
                       </tr>
                     )
                   })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 