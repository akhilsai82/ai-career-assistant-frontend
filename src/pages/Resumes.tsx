import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import * as api from '../api/endpoints'
import type { Resume } from '../api/types'

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    try {
      setResumes(await api.listResumes())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      await api.uploadResume(file)
      await refresh()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">02 — Resumes</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-mist-100">Your resumes</h1>
        <p className="mt-2 text-mist-400">Upload a PDF or DOCX to start analyzing against job descriptions.</p>
      </header>

      <Card className="mb-6">
        <label className="focus-ring flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-ink-600 py-10 text-center transition-colors hover:border-amber-500">
          <span className="text-sm text-mist-300">
            {uploading ? 'Uploading...' : 'Click to choose a PDF or DOCX file'}
          </span>
          <span className="mt-1 text-xs text-mist-400">Max 5MB</span>
          <input
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </Card>

      {loading ? (
        <p className="text-mist-400">Loading...</p>
      ) : resumes.length === 0 ? (
        <p className="text-mist-400">No resumes uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mist-100">{r.original_filename}</p>
                <p className="mt-1 font-mono text-xs text-mist-400">
                  {new Date(r.uploaded_at).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-ink-800 px-3 py-1 text-xs text-mist-300">
                {r.content_type === 'application/pdf' ? 'PDF' : 'DOCX'}
              </span>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
