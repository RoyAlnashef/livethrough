'use client'

import React from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  AlertTriangle, 
  FileText 
} from 'lucide-react'

interface SettingsNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="w-5 h-5" />
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="w-5 h-5" />
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Lock className="w-5 h-5" />
  },
  {
    id: 'danger',
    label: 'Danger',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: 'legal',
    label: 'Legal',
    icon: <FileText className="w-5 h-5" />
  }
]

export function SettingsNavigation({ activeSection, onSectionChange }: SettingsNavigationProps) {
  return (
    <nav className="w-80 p-6 pl-0 space-y-2">
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors
              ${activeSection === section.id
                ? 'bg-teal-950 border border-teal-800 text-white'
                : 'text-white hover:bg-zinc-900'
              }
            `}
          >
            <div className={`
              ${activeSection === section.id ? 'text-white' : 'text-white'}
            `}>
              {section.icon}
            </div>
            <span className="font-medium">{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
} 