import { FormEvent, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import * as api from '../api/endpoints'
import type { JobDescription } from '../api/types'

export default function JobDescriptions() {
  const [jds, setJds] = useState<JobDescription[]>([])
  const [title, setTitle] = useState('')
  const [rawText, setRawText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    try {
      setJds(await api.listJobDescriptions())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!rawText.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      await api.createJobDescription(rawText, title || undefined)
      setTitle('')
      setRawText('')
      await refresh()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
          03 — Job Descriptions
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-mist-100">
          Analyze a job posting
        </h1>
        <p className="mt-2 text-mist-400">
          Paste any job description. The AI extracts required skills, preferred skills, and
          experience level.
        </p>
      </header>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-mist-400">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Backend Engineer at Acme Corp"
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-mist-400">
              Job description text
            </label>
            <textarea
              required
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Analyzing...' : 'Analyze job description'}
          </Button>
        </form>
      </Card>

      {loading ? (
        <p className="text-mist-400">Loading...</p>
      ) : jds.length === 0 ? (
        <p className="text-mist-400">No job descriptions analyzed yet.</p>
      ) : (
        <div className="space-y-4">
          {jds.map((jd) => (
            <Card key={jd.id}>
              <p className="text-sm font-medium text-mist-100">
                {jd.title || jd.extracted_data?.role_title || 'Untitled role'}
              </p>
              <p className="mt-1 font-mono text-xs text-mist-400">
                {new Date(jd.created_at).toLocaleString()}
              </p>
              {jd.extracted_data && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {jd.extracted_data.required_skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-ink-800 px-2.5 py-1 font-mono text-xs text-amber-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
