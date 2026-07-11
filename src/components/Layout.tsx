import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', glyph: '01' },
  { to: '/resumes', label: 'Resumes', glyph: '02' },
  { to: '/job-descriptions', label: 'Job Descriptions', glyph: '03' },
  { to: '/workspace', label: 'Workspace', glyph: '04' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="flex w-64 shrink-0 flex-col border-r border-ink-700 bg-ink-900">
        <div className="border-b border-ink-700 px-6 py-6">
          <p className="font-display text-lg font-semibold tracking-tight text-mist-100">
            Career<span className="text-amber-400">Assistant</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-mist-400">
            AI-powered
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-ink-800 text-amber-400'
                    : 'text-mist-300 hover:bg-ink-800 hover:text-mist-100'
                }`
              }
            >
              <span className="font-mono text-xs text-mist-400">{item.glyph}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-700 px-6 py-4">
          <p className="truncate text-sm text-mist-300">{user?.email}</p>
          <button
            onClick={logout}
            className="focus-ring mt-2 text-xs font-medium text-mist-400 transition-colors hover:text-amber-400"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  )
}
