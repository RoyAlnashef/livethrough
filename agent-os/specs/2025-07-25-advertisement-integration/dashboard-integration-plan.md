# Dashboard Integration Plan

## Overview
Plan for integrating the new "Ads" page into the existing LiveThrough dashboard navigation and UI system.

## Current Dashboard Structure

### Navigation Analysis
Based on `components/dashboard/sidebar.tsx`, the current navigation structure is:

```typescript
const mainLinks = [
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Schools", href: "/dashboard/schools", icon: School },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Marketplace", href: "/", icon: Home },
]

const systemLinks = [
  { name: "Admin Users", href: "/dashboard/admin-users", icon: UserCog },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Security", href: "/dashboard/security", icon: Shield },
]
```

## Ads Page Integration Plan

### 1. Navigation Integration

#### Add to Main Links
```typescript
const mainLinks = [
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Schools", href: "/dashboard/schools", icon: School },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Ads", href: "/dashboard/ads", icon: Megaphone }, // New addition
  { name: "Marketplace", href: "/", icon: Home },
]
```

#### Icon Selection
- **Recommended**: `Megaphone` from Lucide React
- **Alternative**: `BarChart3`, `TrendingUp`, or `DollarSign`
- **Rationale**: Megaphone clearly represents advertising/marketing

### 2. Page Structure

#### File Location
```
app/dashboard/ads/
├── page.tsx                    # Main ads page
├── components/
│   ├── ad-slot-controls.tsx    # Enable/disable ad slots
│   ├── ad-analytics.tsx        # Analytics dashboard
│   ├── ad-settings.tsx         # Ad configuration
│   └── ad-performance.tsx      # Performance metrics
```

#### Page Layout
```tsx
// app/dashboard/ads/page.tsx
export default function AdsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ad Management</h1>
          <p className="text-zinc-400">Manage ad placements and view performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Add Ad Slot</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="slots">Ad Slots</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <AdOverview />
        </TabsContent>
        <TabsContent value="slots">
          <AdSlotControls />
        </TabsContent>
        <TabsContent value="analytics">
          <AdAnalytics />
        </TabsContent>
        <TabsContent value="settings">
          <AdSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 3. Component Design

#### Ad Overview Component
```tsx
// components/dashboard/ads/ad-overview.tsx
export function AdOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Revenue Card */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">$1,234.56</div>
          <p className="text-xs text-zinc-500 mt-1">+12.3% from last month</p>
        </CardContent>
      </Card>

      {/* Impressions Card */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Impressions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">45,678</div>
          <p className="text-xs text-zinc-500 mt-1">+8.7% from last month</p>
        </CardContent>
      </Card>

      {/* Clicks Card */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">1,234</div>
          <p className="text-xs text-zinc-500 mt-1">+15.2% from last month</p>
        </CardContent>
      </Card>

      {/* CTR Card */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Click-Through Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">2.7%</div>
          <p className="text-xs text-zinc-500 mt-1">+0.3% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Ad Slot Controls Component
```tsx
// components/dashboard/ads/ad-slot-controls.tsx
export function AdSlotControls() {
  const [adSlots, setAdSlots] = useState([
    {
      id: 'marketplace-interstitial',
      name: 'Marketplace Interstitial',
      location: 'Course list (every 9th course)',
      enabled: true,
      impressions: 23456,
      clicks: 678,
      ctr: 2.89,
    },
    {
      id: 'course-sidebar',
      name: 'Course Sidebar',
      location: 'Course detail pages (right sidebar)',
      enabled: true,
      impressions: 12345,
      clicks: 456,
      ctr: 3.69,
    },
    {
      id: 'course-content-interstitial',
      name: 'Course Content Interstitial',
      location: 'Course detail pages (between content)',
      enabled: false,
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Ad Slot Management</h3>
        <Button variant="outline" size="sm">Add New Slot</Button>
      </div>
      
      <div className="space-y-4">
        {adSlots.map((slot) => (
          <Card key={slot.id} className="bg-zinc-950 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">{slot.name}</h4>
                    <Badge variant={slot.enabled ? "default" : "secondary"}>
                      {slot.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{slot.location}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Impressions:</span>
                      <span className="text-white ml-1">{slot.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Clicks:</span>
                      <span className="text-white ml-1">{slot.clicks.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">CTR:</span>
                      <span className="text-white ml-1">{slot.ctr}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slot.enabled}
                    onCheckedChange={(enabled) => {
                      setAdSlots(slots => 
                        slots.map(s => s.id === slot.id ? { ...s, enabled } : s)
                      );
                    }}
                  />
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 4. Analytics Integration

#### Chart Components
```tsx
// components/dashboard/ads/ad-analytics.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdAnalytics() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedSlot, setSelectedSlot] = useState('all');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedSlot} onValueChange={setSelectedSlot}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ad Slots</SelectItem>
            <SelectItem value="marketplace-interstitial">Marketplace Interstitial</SelectItem>
            <SelectItem value="course-sidebar">Course Sidebar</SelectItem>
            <SelectItem value="course-content-interstitial">Course Content Interstitial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="date" stroke="#71717A" />
                <YAxis stroke="#71717A" />
                <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A' }} />
                <Line type="monotone" dataKey="revenue" stroke="#14B8A6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Click-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ctrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="date" stroke="#71717A" />
                <YAxis stroke="#71717A" />
                <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A' }} />
                <Line type="monotone" dataKey="ctr" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 5. Settings Component

#### Ad Configuration
```tsx
// components/dashboard/ads/ad-settings.tsx
export function AdSettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">AdSense Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adsense-client">AdSense Client ID</Label>
            <Input 
              id="adsense-client" 
              placeholder="ca-pub-XXXXXXXXXX"
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="adsense-slot-marketplace">Marketplace Ad Slot ID</Label>
            <Input 
              id="adsense-slot-marketplace" 
              placeholder="XXXXXXXXXX"
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="adsense-slot-course-sidebar">Course Sidebar Ad Slot ID</Label>
            <Input 
              id="adsense-slot-course-sidebar" 
              placeholder="XXXXXXXXXX"
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <div>
            <Label htmlFor="adsense-slot-course-content">Course Content Ad Slot ID</Label>
            <Input 
              id="adsense-slot-course-content" 
              placeholder="XXXXXXXXXX"
              className="bg-zinc-900 border-zinc-700"
            />
          </div>
          <Button>Save Configuration</Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="consent-required">Require Consent for Ads</Label>
              <p className="text-sm text-zinc-400">Show ads only after user consent</p>
            </div>
            <Switch id="consent-required" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="admin-exclusion">Exclude Admins from Ads</Label>
              <p className="text-sm text-zinc-400">Hide ads for admin users</p>
            </div>
            <Switch id="admin-exclusion" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Implementation Steps

### 1. Update Sidebar Navigation
- Add "Ads" to mainLinks array
- Import Megaphone icon from Lucide React
- Test navigation functionality

### 2. Create Page Structure
- Create `app/dashboard/ads/page.tsx`
- Create component files in `components/dashboard/ads/`
- Implement basic layout and navigation

### 3. Implement Core Components
- AdOverview with metric cards
- AdSlotControls with enable/disable functionality
- AdAnalytics with charts
- AdSettings with configuration options

### 4. Add Dependencies
- Install recharts for analytics charts
- Add any additional UI components needed

### 5. Test Integration
- Verify navigation works correctly
- Test responsive design
- Ensure consistent styling with existing dashboard

## Design Considerations

### 1. Consistent Styling
- Use existing zinc color scheme
- Match card and button styles
- Follow existing spacing patterns

### 2. Responsive Design
- Ensure mobile compatibility
- Test on various screen sizes
- Maintain usability on tablets

### 3. Accessibility
- Proper ARIA labels
- Keyboard navigation
- Screen reader compatibility

### 4. Performance
- Lazy load analytics data
- Optimize chart rendering
- Minimize bundle size impact 