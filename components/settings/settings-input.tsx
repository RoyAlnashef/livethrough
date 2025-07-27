import { SettingsInputProps } from '@/lib/types/settings'

export function SettingsInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false
}: SettingsInputProps) {
  return (
    <div>
              <label 
          htmlFor={id}
          className="block text-zinc-400 mb-2"
        >
          {label}
          {required && <span className="text-teal-500 ml-1">*</span>}
        </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-sm 
          focus:outline-none focus:ring-2 focus:ring-teal-600
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}  
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
} 