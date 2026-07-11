import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Card from '../components/Card'
import * as api from '../api/endpoints'
import type { DashboardSummary } from '../api/types'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getDashboard()
      .then(setSummary)
      .finally(() => setLoading(false))
  }, [])

  const stats = summary
    ? [
        { label: 'Resumes', value: summary.resumes.length },
        { label: 'Job Descriptions', value: summary.job_descriptions.length },
        { label: 'Cover Letters', value: summary.cover_letters.length },
        { label: 'Interview Sets', value: summary.interview_question_sets.length },
        { label: 'Roadmaps', value: summary.learning_roadmaps.length },
      ]
    : []

  return (
    <Layout>
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">01 — Dashboard</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-mist-100">
          Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-2 text-mist-400">Everything you've built so far, in one place.</p>
      </header>

      {loading ? (
        <p className="text-mist-400">Loading...</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {stats.map((s) => (
              <Card key={s.label} className="text-center">
                <p className="font-mono text-3xl font-semibold text-amber-400">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-mist-400">{s.label}</p>
              </Card>
            ))}
          </div>

          {summary && summary.cover_letters.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 font-display text-lg font-semibold text-mist-100">
                Recent cover letters
              </h2>
              <div className="space-y-3">
                {summary.cover_letters.slice(0, 3).map((cl) => (
                  <Card key={cl.id}>
                    <p className="line-clamp-2 text-sm text-mist-300">{cl.content}</p>
                    <p className="mt-2 font-mono text-xs text-mist-400">
                      {new Date(cl.created_at).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {summary &&
            summary.resumes.length === 0 &&
            summary.job_descriptions.length === 0 && (
              <Card>
                <p className="text-mist-300">
                  Nothing here yet. Upload a resume and analyze a job description to get started.
                </p>
              </Card>
            )}
        </>
      )}
    </Layout>
  )
}
