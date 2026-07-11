import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'focus-ring inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    primary: 'bg-amber-500 text-ink-950 hover:bg-amber-400',
    secondary: 'bg-ink-800 text-mist-100 hover:bg-ink-700 border border-ink-600',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
