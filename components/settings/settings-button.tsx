import { SettingsButtonProps } from '@/lib/types/settings'

export function SettingsButton({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = ''
}: SettingsButtonProps) {
  const baseClasses = 'px-6 py-2 rounded-md transition-colors font-medium'
  
  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    secondary: 'bg-zinc-900 text-white hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  )
} 