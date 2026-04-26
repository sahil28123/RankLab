import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import DifficultyBadge from '@/components/DifficultyBadge'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, ArrowLeft, Lightbulb, Tag, Calculator, Clock, ChevronRight } from 'lucide-react'

async function getQuestion(id: string) {
  const { data } = await supabase.from('questions').select('*').eq('id', id).single()
  return data
}

async function getLinkedNcert(id: string) {
  const { data } = await supabase
    .from('question_ncert_links')
    .select('similarity, ncert_chunks(subject, class, chapter, section_num, section_title, paragraph)')
    .eq('question_id', id)
    .order('similarity', { ascending: false })
    .limit(4)
  return data
}

async function getSimilarQuestions(subject: string, chapter: string, excludeId: string) {
  const { data } = await supabase
    .from('questions')
    .select('id,question_text,difficulty,year,topic')
    .eq('subject', subject)
    .eq('chapter', chapter)
    .neq('id', excludeId)
    .limit(4)
  return data
}

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = await getQuestion(params.id)
  if (!question) notFound()

  const [linkedNcert, similarQ] = await Promise.all([
    getLinkedNcert(params.id),
    getSimilarQuestions(question.subject, question.chapter, params.id),
  ])

  const concepts = typeof question.concepts === 'string'
    ? JSON.parse(question.concepts.replace(/'/g, '"'))
    : question.concepts ?? []

  const formulas = typeof question.formulas_used === 'string'
    ? JSON.parse(question.formulas_used.replace(/'/g, '"'))
    : question.formulas_used ?? []

  return (
    <div className="p-4 md:p-8 max-w-5xl animate-fade-in">
      <Link href="/questions" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-6 bg-white px-4 py-2 rounded-full border-2 border-slate-200 hover:border-slate-300 shadow-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Questions
      </Link>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
        {/* Main question */}
        <div className="lg:col-span-2 space-y-4">

          {/* Question card */}
          <div className="bg-white rounded-3xl p-5 md:p-7 shadow-lg shadow-slate-200/50 border-2 border-slate-100">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <SubjectBadge subject={question.subject} />
              <DifficultyBadge difficulty={question.difficulty} />
              <span className="text-sm font-bold text-slate-600 bg-slate-100 border-2 border-slate-200 px-3 py-1 rounded-full">{question.question_type}</span>
              <span className="text-sm font-bold text-slate-500 bg-slate-100 border-2 border-slate-200 px-3 py-1 rounded-full ml-auto">
                {question.year}{question.shift ? ` · ${question.shift.replace(/_/g, ' ')}` : ''}
              </span>
            </div>
            <p className="text-slate-900 font-semibold leading-relaxed text-base md:text-lg whitespace-pre-wrap">
              {question.question_text}
            </p>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-amber-50 rounded-3xl p-5 border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-200 p-1.5 rounded-xl">
                  <Lightbulb className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="text-base font-black text-amber-900">What This Question Tests</h3>
              </div>
              <p className="text-sm font-semibold text-amber-800 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Concepts & Formulas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {concepts.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-purple-100 p-1.5 rounded-xl">
                    <Tag className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Concepts Tested</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((c: string) => (
                    <span key={c} className="text-sm font-bold bg-purple-100 text-purple-800 border-2 border-purple-200 px-3 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formulas.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-emerald-100 p-1.5 rounded-xl">
                    <Calculator className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Formulas Used</h3>
                </div>
                <div className="space-y-2">
                  {formulas.map((f: string) => (
                    <p key={f} className="text-sm font-bold font-mono text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border-2 border-emerald-200">
                      {f}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Linked NCERT */}
          {linkedNcert && linkedNcert.length > 0 && (
            <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-emerald-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 p-1.5 rounded-xl">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="text-base font-black text-slate-800">📚 NCERT Sections This Tests</h3>
              </div>
              <div className="space-y-3">
                {linkedNcert.map((link: any, i) => {
                  const chunk = link.ncert_chunks
                  if (!chunk) return null
                  return (
                    <div key={i} className="border-2 border-slate-100 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:border-emerald-200 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-sm font-black text-emerald-700">{chunk.section_num} — {chunk.section_title}</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{chunk.subject} Class {chunk.class} · {chunk.chapter}</p>
                        </div>
                        <span className="text-xs font-black text-slate-600 bg-white border-2 border-slate-200 px-2.5 py-1 rounded-xl shrink-0">
                          {Math.round(link.similarity * 100)}% match
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 line-clamp-3 leading-relaxed">{chunk.paragraph}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Question details */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md shadow-slate-200/50">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">📋 Question Details</h3>
            <dl className="space-y-3">
              {[
                { label: 'Chapter', value: question.chapter },
                { label: 'Topic', value: question.topic },
                { label: 'Year', value: question.year },
                { label: 'Shift', value: question.shift?.replace(/_/g, ' ') },
                { label: 'Q Number', value: `Q${question.q_num}` },
                { label: 'Type', value: question.question_type },
                { label: 'NCERT Ref', value: question.ncert_reference },
              ].filter(item => item.value).map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <dt className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0">{label}</dt>
                  <dd className="text-sm font-bold text-slate-800 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Similar questions */}
          {similarQ && similarQ.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-md shadow-slate-200/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-sky-100 p-1.5 rounded-xl">
                  <Clock className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="text-sm font-black text-slate-800">More from this Chapter</h3>
              </div>
              <div className="space-y-2.5">
                {similarQ.map(q => (
                  <Link key={q.id} href={`/questions/${q.id}`} className="block p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group border-2 border-slate-100 hover:border-sky-200">
                    <p className="text-sm font-semibold text-slate-700 line-clamp-2 group-hover:text-slate-900 leading-relaxed">{q.question_text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{q.year}</span>
                      <div className="flex items-center gap-1.5">
                        <DifficultyBadge difficulty={q.difficulty} />
                        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/questions?subject=${question.subject}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-black text-sky-700 bg-sky-100 border-2 border-sky-200 hover:bg-sky-200 transition-all"
          >
            More {question.subject} questions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
