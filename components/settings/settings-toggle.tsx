import { SettingsToggleProps } from '@/lib/types/settings'

export function SettingsToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label 
          htmlFor={id}
          className="text-white font-medium cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-zinc-400 mt-1">{description}</p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`
          w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
          peer-checked:bg-teal-600
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}></div>
      </label>
    </div>
  )
} 