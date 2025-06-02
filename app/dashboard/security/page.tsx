import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Shield, Key, Lock, Smartphone } from "lucide-react"

export const metadata = {
  title: "Security - Dashboard",
}

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Security" },
        ]}
      />
      
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Security</h1>
          <p className="text-zinc-400 text-sm">
            Manage your account security settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Shield className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Account Security</h2>
                <p className="text-sm text-zinc-400">Protect your account</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Two-Factor Authentication</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Login History</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  View
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Key className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Password</h2>
                <p className="text-sm text-zinc-400">Manage your password</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Change Password</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Password Recovery</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Configure
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Lock className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Session Management</h2>
                <p className="text-sm text-zinc-400">Control active sessions</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Active Sessions</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Logout All Devices</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Smartphone className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Device Management</h2>
                <p className="text-sm text-zinc-400">Manage trusted devices</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Trusted Devices</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Manage
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Device Notifications</span>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 