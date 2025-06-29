import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Settings, Bell, Globe, Palette } from "lucide-react"

export const metadata = {
  title: "Settings - Dashboard",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Settings" },
        ]}
      />
      
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-zinc-400 text-sm">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Settings className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">General Settings</h2>
                <p className="text-sm text-zinc-400">Basic account settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Email Notifications</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Account Type</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Change
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Bell className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Notifications</h2>
                <p className="text-sm text-zinc-400">Manage your alerts</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Push Notifications</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Email Digest</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Configure
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Globe className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Language & Region</h2>
                <p className="text-sm text-zinc-400">Localization settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Language</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Time Zone</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Change
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Palette className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Appearance</h2>
                <p className="text-sm text-zinc-400">Customize your experience</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Theme</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Font Size</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Change
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 