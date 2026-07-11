import { apiClient } from './client'
import type {
  CoverLetter,
  DashboardSummary,
  InterviewQuestionSet,
  JobDescription,
  LearningRoadmap,
  MatchResult,
  OptimizeResult,
  Resume,
  SkillGapResult,
  User,
} from './types'

// --- Auth ---
export async function register(email: string, password: string, fullName?: string) {
  const res = await apiClient.post<User>('/auth/register', {
    email,
    password,
    full_name: fullName || null,
  })
  return res.data
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<{ access_token: string; token_type: string }>(
    '/auth/login',
    { email, password },
  )
  return res.data
}

export async function getCurrentUser() {
  const res = await apiClient.get<User>('/auth/me')
  return res.data
}

// --- Resumes ---
export async function uploadResume(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient.post<Resume>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function listResumes() {
  const res = await apiClient.get<Resume[]>('/resumes')
  return res.data
}

// --- Job Descriptions ---
export async function createJobDescription(rawText: string, title?: string) {
  const res = await apiClient.post<JobDescription>('/job-descriptions', {
    raw_text: rawText,
    title: title || null,
  })
  return res.data
}

export async function listJobDescriptions() {
  const res = await apiClient.get<JobDescription[]>('/job-descriptions')
  return res.data
}

// --- Match & Skill Gap ---
export async function matchResumeToJd(resumeId: string, jobDescriptionId: string) {
  const res = await apiClient.post<MatchResult>('/match', {
    resume_id: resumeId,
    job_description_id: jobDescriptionId,
  })
  return res.data
}

export async function getSkillGap(resumeId: string, jobDescriptionId: string) {
  const res = await apiClient.post<SkillGapResult>('/match/skill-gap', {
    resume_id: resumeId,
    job_description_id: jobDescriptionId,
  })
  return res.data
}

// --- Optimize ---
export async function optimizeBulletPoint(originalText: string, targetContext?: string) {
  const res = await apiClient.post<OptimizeResult>('/optimize', {
    original_text: originalText,
    target_context: targetContext || null,
  })
  return res.data
}

// --- Cover Letters ---
export async function generateCoverLetter(
  resumeId: string,
  jobDescriptionId: string,
  companyName?: string,
) {
  const res = await apiClient.post<CoverLetter>('/cover-letters', {
    resume_id: resumeId,
    job_description_id: jobDescriptionId,
    company_name: companyName || null,
  })
  return res.data
}

// --- Interview Questions ---
export async function generateInterviewQuestions(resumeId: string, jobDescriptionId: string) {
  const res = await apiClient.post<InterviewQuestionSet>('/interview-questions', {
    resume_id: resumeId,
    job_description_id: jobDescriptionId,
  })
  return res.data
}

// --- Learning Roadmap ---
export async function generateRoadmap(resumeId: string, jobDescriptionId: string) {
  const res = await apiClient.post<LearningRoadmap>('/learning-roadmap', {
    resume_id: resumeId,
    job_description_id: jobDescriptionId,
  })
  return res.data
}

// --- Reports ---
export function getReportDownloadUrl(resumeId: string, jobDescriptionId: string) {
  return `/reports/${resumeId}/${jobDescriptionId}`
}

export async function downloadReport(resumeId: string, jobDescriptionId: string) {
  const res = await apiClient.get(getReportDownloadUrl(resumeId, jobDescriptionId), {
    responseType: 'blob',
  })
  return res.data as Blob
}

// --- Dashboard ---
export async function getDashboard() {
  const res = await apiClient.get<DashboardSummary>('/dashboard')
  return res.data
}
