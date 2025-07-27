import { SettingsSectionProps } from '@/lib/types/settings'

export function SettingsSection({ 
  title, 
  description, 
  children, 
  className = '' 
}: SettingsSectionProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 p-6 rounded-lg ${className}`}>
      <div className="pb-4 mb-6 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && (
          <p className="text-sm text-zinc-400 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
} 