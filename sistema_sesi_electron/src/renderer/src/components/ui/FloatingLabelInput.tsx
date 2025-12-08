import React from 'react'

export interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string
  icon?: React.ReactNode
}

export const FloatingLabelInput = ({
  label,
  icon,
  className,
  ...props
}: FloatingInputProps): React.ReactElement => (
  <div className="relative w-full">
    <input
      {...props}
      placeholder=" " // Required for :placeholder-shown logic
      className={`peer w-full h-[40px] border border-gray-200 rounded-lg px-3 pt-3 pb-1 text-sm bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-transparent disabled:opacity-50 disabled:bg-gray-50 ${className}`}
    />
    <label className="absolute left-2 -top-2 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 pointer-events-none">
      {label}
    </label>
    {icon && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {icon}
      </div>
    )}
  </div>
)
