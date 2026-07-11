export interface User {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  created_at: string
}

export interface Resume {
  id: string
  original_filename: string
  content_type: string | null
  uploaded_at: string
}

export interface JobDescription {
  id: string
  title: string | null
  raw_text: string
  extracted_data: {
    role_title: string | null
    required_skills: string[]
    preferred_skills: string[]
    experience_level: string | null
    responsibilities: string[]
  } | null
  created_at: string
}

export interface MatchResult {
  ats_score: number
  match_percentage: number
  missing_skills: string[]
  weak_areas: string[]
  suggestions: string[]
}

export interface SkillGapItem {
  skill: string
  priority: string
  estimated_days: number
  resources: string[]
}

export interface SkillGapResult {
  skill_gaps: SkillGapItem[]
}

export interface OptimizeResult {
  optimized: string
}

export interface CoverLetter {
  id: string
  resume_id: string
  job_description_id: string
  content: string
  created_at: string
}

export interface InterviewQuestions {
  hr_questions: string[]
  technical_questions: string[]
  coding_questions: string[]
  system_design_questions: string[]
}

export interface InterviewQuestionSet {
  id: string
  resume_id: string
  job_description_id: string
  questions: InterviewQuestions
  created_at: string
}

export interface RoadmapWeek {
  week_number: number
  focus: string
  topics: string[]
}

export interface Roadmap {
  weeks: RoadmapWeek[]
}

export interface LearningRoadmap {
  id: string
  resume_id: string
  job_description_id: string
  roadmap: Roadmap
  created_at: string
}

export interface DashboardSummary {
  resumes: Resume[]
  job_descriptions: JobDescription[]
  cover_letters: CoverLetter[]
  interview_question_sets: InterviewQuestionSet[]
  learning_roadmaps: LearningRoadmap[]
}
