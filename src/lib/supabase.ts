import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Question = {
  id: string
  question_text: string
  subject: string
  chapter: string
  topic: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question_type: string
  concepts: string[]
  formulas_used: string[]
  ncert_reference: string
  explanation: string
  year: number
  shift: string
  q_num: number
  paper_source: string
  created_at: string
}

export type ConceptNode = {
  id: string
  name: string
  subject: string
  chapter: string
  class: number
  jee_count: number
  pct_hard: number
  video_title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimated_time_min: number
  formulas: string[]
  key_points: string[]
  common_mistakes: string[]
  ncert_chapters: string[]
  jee_tip: string
  created_at: string
}

export type NcertChunk = {
  id: string
  subject: string
  class: number
  chapter: string
  chapter_num: number
  section_num: string
  section_title: string
  paragraph: string
  chunk_index: number
  page_num: number
}

export type NcertImportance = {
  id: string
  subject: string
  class: number
  chapter: string
  chapter_num: number
  section_num: string
  section_title: string
  paragraph: string
  question_count: number
  avg_similarity: number
  hard_question_count: number
}
