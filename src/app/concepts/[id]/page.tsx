import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import DifficultyBadge from '@/components/DifficultyBadge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Flame, Clock, Calculator, BookOpen,
  AlertTriangle, CheckCircle, Lightbulb, ArrowRight, ChevronRight,
} from 'lucide-react'

async function getConcept(id: string) {
  const { data } = await supabase.from('concept_nodes').select('*').eq('id', id).single()
  return data
}

async function getPrerequisites(id: string) {
  const { data } = await supabase
    .from('concept_edges')
    .select('edge_type, strength, description, concept_nodes!concept_edges_from_id_fkey(id,name,subject,difficulty,jee_count)')
    .eq('to_id', id)
    .in('edge_type', ['prerequisite'])
    .limit(5)
  return data
}

async function getEnables(id: string) {
  const { data } = await supabase
    .from('concept_edges')
    .select('edge_type, strength, description, concept_nodes!concept_edges_to_id_fkey(id,name,subject,difficulty,jee_count)')
    .eq('from_id', id)
    .in('edge_type', ['enables'])
    .limit(5)
  return data
}

async function getRelatedQuestions(subject: string, chapter: string) {
  const { data } = await supabase
    .from('questions')
    .select('id,question_text,difficulty,year,topic,question_type')
    .eq('subject', subject)
    .eq('chapter', chapter)
    .order('year', { ascending: false })
    .limit(6)
  return data
}

function parseArray(val: string | string[] | null): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val.replace(/'/g, '"')) } catch { return [val] }
}

export default async function ConceptDetailPage({ params }: { params: { id: string } }) {
  const concept = await getConcept(params.id)
  if (!concept) notFound()

  const [prerequisites, enables, relatedQ] = await Promise.all([
    getPrerequisites(params.id),
    getEnables(params.id),
    getRelatedQuestions(concept.subject, concept.chapter),
  ])

  const formulas = parseArray(concept.formulas)
  const keyPoints = parseArray(concept.key_points)
  const mistakes = parseArray(concept.common_mistakes)
  const ncertChapters = parseArray(concept.ncert_chapters)

  return (
    <div className="p-4 md:p-8 max-w-5xl animate-fade-in">
      <Link href="/concepts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-5">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Concepts
      </Link>

      {/* Header card */}
      <div className="glass rounded-xl p-5 md:p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <SubjectBadge subject={concept.subject} />
              <DifficultyBadge difficulty={concept.difficulty} />
              <span className="text-xs bg-white/5 border border-white/10 text-slate-500 px-2.5 py-1 rounded-full">Class {concept.class}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-2 leading-tight">{concept.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{concept.chapter}</p>
          </div>
          <div className="flex sm:flex-col gap-3 sm:gap-2 shrink-0">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-base font-bold text-white leading-none">{concept.jee_count}</p>
                <p className="text-[10px] text-slate-500">JEE Qs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <div>
                <p className="text-base font-bold text-white leading-none">{concept.pct_hard}%</p>
                <p className="text-[10px] text-slate-500">Hard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-base font-bold text-white leading-none">{concept.estimated_time_min}</p>
                <p className="text-[10px] text-slate-500">min</p>
              </div>
            </div>
          </div>
        </div>

        {concept.jee_tip && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/80 leading-relaxed">{concept.jee_tip}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {formulas.length > 0 && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">Key Formulas</h2>
              </div>
              <div className="space-y-2">
                {formulas.map((f, i) => (
                  <div key={i} className="font-mono text-sm text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 px-3 py-2.5 rounded-xl leading-relaxed">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {keyPoints.length > 0 && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white">Key Points for JEE</h2>
              </div>
              <ul className="space-y-2.5">
                {keyPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <span className="text-blue-400 font-bold shrink-0 mt-0.5 text-xs">→</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mistakes.length > 0 && (
            <div className="glass rounded-xl p-5 border border-red-500/10">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold text-white">Common Mistakes</h2>
              </div>
              <ul className="space-y-2.5">
                {mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5 text-xs">✕</span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedQ && relatedQ.length > 0 && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Practice Questions</h2>
                <Link href={`/questions?subject=${concept.subject}`}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  See all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {relatedQ.map(q => (
                  <Link key={q.id} href={`/questions/${q.id}`}
                    className="block p-3 rounded-xl border border-white/5 hover:bg-white/3 hover:border-white/10 transition-all group"
                  >
                    <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-200 transition-colors leading-relaxed">{q.question_text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-600">{q.year}</span>
                      <span className="text-slate-700">·</span>
                      <span className="text-xs text-slate-600">{q.question_type}</span>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {ncertChapters.length > 0 && (
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">NCERT Chapters</h3>
              </div>
              <ul className="space-y-1.5">
                {ncertChapters.map((ch, i) => (
                  <li key={i} className="text-xs text-slate-400 bg-white/3 px-3 py-2 rounded-lg border border-white/5">
                    {ch}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prerequisites && prerequisites.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Learn First</h3>
              <div className="space-y-2">
                {prerequisites.map((edge: any) => {
                  const node = edge.concept_nodes
                  if (!node) return null
                  return (
                    <Link key={node.id} href={`/concepts/${node.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-300 group-hover:text-white truncate">{node.name}</p>
                        {edge.description && <p className="text-[10px] text-slate-600 mt-0.5 truncate">{edge.description}</p>}
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0 ml-2" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {enables && enables.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">This Unlocks</h3>
              <div className="space-y-2">
                {enables.map((edge: any) => {
                  const node = edge.concept_nodes
                  if (!node) return null
                  return (
                    <Link key={node.id} href={`/concepts/${node.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <p className="text-xs font-medium text-slate-300 group-hover:text-white truncate">{node.name}</p>
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0 ml-2" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
