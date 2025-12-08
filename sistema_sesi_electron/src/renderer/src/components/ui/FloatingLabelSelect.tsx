import React from 'react'
import { ArrowUpDown } from 'lucide-react'

export interface FloatingSelectProps extends React.ComponentProps<'select'> {
  label: string
  icon?: React.ReactNode
}

export const FloatingLabelSelect = ({
  label,
  children,
  icon,
  className,
  ...props
}: FloatingSelectProps): React.ReactElement => (
  <div className="relative w-full">
    <select
      {...props}
      className={`peer w-full h-[40px] border border-gray-200 rounded-lg px-3 pt-3 pb-1 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none disabled:opacity-50 disabled:bg-gray-50 cursor-pointer ${className}`}
    >
      {children}
    </select>
    <label className="absolute left-2 -top-2 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
      {label}
    </label>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      {icon || <ArrowUpDown size={14} />}
    </div>
  </div>
)
