import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import ScoreGauge from '../components/ScoreGauge'
import * as api from '../api/endpoints'
import type {
  CoverLetter,
  InterviewQuestionSet,
  JobDescription,
  LearningRoadmap,
  MatchResult,
  Resume,
  SkillGapResult,
} from '../api/types'

type Action = 'match' | 'skillgap' | 'cover' | 'interview' | 'roadmap' | null

export default function Workspace() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [jds, setJds] = useState<JobDescription[]>([])
  const [resumeId, setResumeId] = useState('')
  const [jdId, setJdId] = useState('')

  const [activeAction, setActiveAction] = useState<Action>(null)
  const [error, setError] = useState<string | null>(null)

  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null)
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [interview, setInterview] = useState<InterviewQuestionSet | null>(null)
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null)
  const [downloadingReport, setDownloadingReport] = useState(false)

  useEffect(() => {
    api.listResumes().then(setResumes)
    api.listJobDescriptions().then(setJds)
  }, [])

  const ready = Boolean(resumeId && jdId)

  async function run(action: Exclude<Action, null>) {
    if (!ready) return
    setError(null)
    setActiveAction(action)
    try {
      if (action === 'match') setMatchResult(await api.matchResumeToJd(resumeId, jdId))
      if (action === 'skillgap') setSkillGap(await api.getSkillGap(resumeId, jdId))
      if (action === 'cover')
        setCoverLetter(await api.generateCoverLetter(resumeId, jdId, companyName || undefined))
      if (action === 'interview')
        setInterview(await api.generateInterviewQuestions(resumeId, jdId))
      if (action === 'roadmap') setRoadmap(await api.generateRoadmap(resumeId, jdId))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Try again.')
    } finally {
      setActiveAction(null)
    }
  }

  async function handleDownloadReport() {
    if (!ready) return
    setDownloadingReport(true)
    setError(null)
    try {
      const blob = await api.downloadReport(resumeId, jdId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'career_report.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError('Report generation failed.')
    } finally {
      setDownloadingReport(false)
    }
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">04 — Workspace</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-mist-100">
          Analyze &amp; prepare
        </h1>
        <p className="mt-2 text-mist-400">
          Pick a resume and a job description, then run any analysis against the pair.
        </p>
      </header>

      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-mist-400">
              Resume
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            >
              <option value="">Select a resume...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.original_filename}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-mist-400">
              Job description
            </label>
            <select
              value={jdId}
              onChange={(e) => setJdId(e.target.value)}
              className="focus-ring w-full rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            >
              <option value="">Select a job description...</option>
              {jds.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title || jd.extracted_data?.role_title || 'Untitled'}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(resumes.length === 0 || jds.length === 0) && (
          <p className="mt-3 text-xs text-mist-400">
            {resumes.length === 0 && 'Upload a resume first. '}
            {jds.length === 0 && 'Analyze a job description first.'}
          </p>
        )}
      </Card>

      {error && (
        <Card className="mb-6 border-red-900 bg-red-950/30">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      <div className="mb-8 flex flex-wrap gap-3">
        <Button disabled={!ready || activeAction !== null} onClick={() => run('match')}>
          {activeAction === 'match' ? 'Scoring...' : 'Run ATS match'}
        </Button>
        <Button
          variant="secondary"
          disabled={!ready || activeAction !== null}
          onClick={() => run('skillgap')}
        >
          {activeAction === 'skillgap' ? 'Analyzing...' : 'Skill gap plan'}
        </Button>
        <Button
          variant="secondary"
          disabled={!ready || activeAction !== null}
          onClick={() => run('interview')}
        >
          {activeAction === 'interview' ? 'Generating...' : 'Interview questions'}
        </Button>
        <Button
          variant="secondary"
          disabled={!ready || activeAction !== null}
          onClick={() => run('roadmap')}
        >
          {activeAction === 'roadmap' ? 'Building...' : 'Learning roadmap'}
        </Button>
        <Button
          variant="secondary"
          disabled={!ready || downloadingReport}
          onClick={handleDownloadReport}
        >
          {downloadingReport ? 'Preparing PDF...' : 'Download PDF report'}
        </Button>
      </div>

      {matchResult && (
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist-100">ATS Match</h2>
          <div className="flex flex-wrap gap-8">
            <ScoreGauge value={matchResult.ats_score} label="ATS Score" />
            <ScoreGauge value={matchResult.match_percentage} label="Match %" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-mist-400">Missing skills</p>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missing_skills.map((s) => (
                  <span key={s} className="rounded-full bg-ink-800 px-2.5 py-1 font-mono text-xs text-mist-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-mist-400">Weak areas</p>
              <ul className="space-y-1 text-sm text-mist-300">
                {matchResult.weak_areas.map((w, i) => (
                  <li key={i}>- {w}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-mist-400">Suggestions</p>
              <ul className="space-y-1 text-sm text-mist-300">
                {matchResult.suggestions.map((s, i) => (
                  <li key={i}>- {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {skillGap && (
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist-100">Skill Gap Plan</h2>
          <div className="space-y-3">
            {skillGap.skill_gaps.map((item) => (
              <div
                key={item.skill}
                className="flex items-center justify-between rounded-md border border-ink-700 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-mist-100">{item.skill}</p>
                  <p className="mt-0.5 text-xs text-mist-400">{item.resources.join(', ')}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : item.priority === 'Medium'
                          ? 'bg-mist-400/20 text-mist-300'
                          : 'bg-ink-800 text-mist-400'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="font-mono text-xs text-mist-400">{item.estimated_days}d</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(activeAction === 'cover' || coverLetter) && (
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist-100">Cover Letter</h2>
          <div className="mb-4 flex gap-3">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
              className="focus-ring flex-1 rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            />
            <Button disabled={!ready || activeAction !== null} onClick={() => run('cover')}>
              {activeAction === 'cover' ? 'Writing...' : 'Generate'}
            </Button>
          </div>
          {coverLetter && (
            <p className="whitespace-pre-line rounded-md bg-ink-800 p-4 text-sm leading-relaxed text-mist-200">
              {coverLetter.content}
            </p>
          )}
        </Card>
      )}
      {!coverLetter && activeAction !== 'cover' && ready && (
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist-100">Cover Letter</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
              className="focus-ring flex-1 rounded-md border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-mist-100"
            />
            <Button disabled={!ready || activeAction !== null} onClick={() => run('cover')}>
              Generate
            </Button>
          </div>
        </Card>
      )}

      {interview && (
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist-100">
            Interview Questions
          </h2>
          <div className="space-y-5">
            {(
              [
                ['HR', interview.questions.hr_questions],
                ['Technical', interview.questions.technical_questions],
                ['Coding', interview.questions.coding_questions],
                ['System Design', interview.questions.system_design_questions],
              ] as const
            ).map(
              ([label, qs]) =>
                qs.length > 0 && (
                  <div key={label}>
                    <p className="mb-2 text-xs uppercase tracking-widest text-amber-400">{label}</p>
                    <ul className="space-y-1.5 text-sm text-mist-300">
                      {qs.map((q, i) => (
                        <li key={i}>- {q}</li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        </Card>
      )}

      {roadmap && (
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist-100">
            Learning Roadmap
          </h2>
          <div className="space-y-4">
            {roadmap.roadmap.weeks.map((w) => (
              <div key={w.week_number} className="flex gap-4">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-amber-400">
                  W{w.week_number}
                </span>
                <div>
                  <p className="text-sm font-medium text-mist-100">{w.focus}</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-mist-300">
                    {w.topics.map((t, i) => (
                      <li key={i}>- {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Layout>
  )
}
