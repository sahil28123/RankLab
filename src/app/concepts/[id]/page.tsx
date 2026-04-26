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
      <Link href="/concepts" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-6 bg-white px-4 py-2 rounded-full border-2 border-slate-200 hover:border-slate-300 shadow-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Concepts
      </Link>

      {/* Header card */}
      <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl p-6 md:p-8 mb-6 text-white border-4 border-white shadow-xl shadow-purple-400/20">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <SubjectBadge subject={concept.subject} />
              <DifficultyBadge difficulty={concept.difficulty} />
              <span className="text-sm font-black bg-white/20 border-2 border-white/40 text-white px-3 py-1 rounded-full">Class {concept.class}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2 leading-tight drop-shadow-sm">{concept.name}</h1>
            <p className="text-purple-200 font-semibold text-base mt-2">{concept.chapter}</p>
          </div>
          <div className="flex sm:flex-col gap-3 sm:gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-white/15 border-2 border-white/30 rounded-2xl px-4 py-3">
              <Flame className="w-5 h-5 text-orange-300" />
              <div>
                <p className="text-xl font-black text-white leading-none">{concept.jee_count}</p>
                <p className="text-xs font-semibold text-purple-200">JEE Qs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border-2 border-white/30 rounded-2xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-300" />
              <div>
                <p className="text-xl font-black text-white leading-none">{concept.pct_hard}%</p>
                <p className="text-xs font-semibold text-purple-200">Hard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border-2 border-white/30 rounded-2xl px-4 py-3">
              <Clock className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-xl font-black text-white leading-none">{concept.estimated_time_min}</p>
                <p className="text-xs font-semibold text-purple-200">min</p>
              </div>
            </div>
          </div>
        </div>

        {concept.jee_tip && (
          <div className="mt-5 p-4 rounded-2xl bg-white/15 border-2 border-white/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-white leading-relaxed">{concept.jee_tip}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Formulas */}
          {formulas.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-md shadow-slate-200/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <Calculator className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-base font-black text-slate-800">🧮 Key Formulas</h2>
              </div>
              <div className="space-y-2.5">
                {formulas.map((f, i) => (
                  <div key={i} className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 border-2 border-emerald-200 px-4 py-3 rounded-2xl leading-relaxed">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md shadow-slate-200/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-sky-100 p-2 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-sky-700" />
                </div>
                <h2 className="text-base font-black text-slate-800">✅ Key Points for JEE</h2>
              </div>
              <ul className="space-y-3">
                {keyPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-black flex items-center justify-center shrink-0 mt-0.5 text-xs">{i + 1}</span>
                    <span className="font-semibold text-slate-800 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {mistakes.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-md shadow-slate-200/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-pink-100 p-2 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-pink-700" />
                </div>
                <h2 className="text-base font-black text-slate-800">⚠️ Common Mistakes</h2>
              </div>
              <ul className="space-y-3">
                {mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-black flex items-center justify-center shrink-0 mt-0.5 text-xs">✕</span>
                    <span className="font-semibold text-slate-800 leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Questions */}
          {relatedQ && relatedQ.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md shadow-slate-200/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-slate-800">📝 Practice Questions</h2>
                <Link href={`/questions?subject=${concept.subject}`}
                  className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-full transition-colors">
                  See all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-2.5">
                {relatedQ.map(q => (
                  <Link key={q.id} href={`/questions/${q.id}`}
                    className="block p-4 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 hover:border-sky-200 transition-all group"
                  >
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-sky-700 transition-colors leading-relaxed">{q.question_text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">{q.year}</span>
                      <span className="text-sm font-bold text-slate-400">·</span>
                      <span className="text-xs font-bold text-slate-500">{q.question_type}</span>
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
            <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-md shadow-slate-200/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 p-1.5 rounded-xl">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">NCERT Chapters</h3>
              </div>
              <ul className="space-y-2">
                {ncertChapters.map((ch, i) => (
                  <li key={i} className="text-sm font-bold text-slate-700 bg-emerald-50 px-3 py-2.5 rounded-2xl border-2 border-emerald-100">
                    {ch}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prerequisites && prerequisites.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md shadow-slate-200/40">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">📚 Learn First</h3>
              <div className="space-y-2.5">
                {prerequisites.map((edge: any) => {
                  const node = edge.concept_nodes
                  if (!node) return null
                  return (
                    <Link key={node.id} href={`/concepts/${node.id}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 border-2 border-orange-100 hover:border-orange-300 hover:bg-orange-100 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-orange-700 truncate">{node.name}</p>
                        {edge.description && <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{edge.description}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 shrink-0 ml-2" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {enables && enables.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md shadow-slate-200/40">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">🚀 This Unlocks</h3>
              <div className="space-y-2.5">
                {enables.map((edge: any) => {
                  const node = edge.concept_nodes
                  if (!node) return null
                  return (
                    <Link key={node.id} href={`/concepts/${node.id}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-100 hover:border-sky-300 hover:bg-sky-100 transition-colors group"
                    >
                      <p className="text-sm font-bold text-slate-800 group-hover:text-sky-700 truncate">{node.name}</p>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 shrink-0 ml-2" />
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
