import type { ReactNode } from 'react'

export default function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-lg border border-ink-700 bg-ink-900 p-6 ${className}`}
    >
      {children}
    </div>
  )
}
