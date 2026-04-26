import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import DifficultyBadge from '@/components/DifficultyBadge'
import Link from 'next/link'
import { Brain, Flame, Clock, ChevronRight, SlidersHorizontal } from 'lucide-react'

interface SearchParams {
  subject?: string
  difficulty?: string
  class?: string
}

async function getConcepts(params: SearchParams) {
  let query = supabase
    .from('concept_nodes')
    .select('id,name,subject,chapter,class,jee_count,pct_hard,difficulty,estimated_time_min,jee_tip,key_points')
    .order('jee_count', { ascending: false })
    .limit(80)

  if (params.subject) query = query.eq('subject', params.subject)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.class) query = query.eq('class', parseInt(params.class))

  const { data } = await query
  return data ?? []
}

function FilterChip({ active, href, label, activeClass }: { active: boolean; href: string; label: string; activeClass: string }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${
        active ? activeClass : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {label}
    </Link>
  )
}

export default async function ConceptsPage({ searchParams }: { searchParams: SearchParams }) {
  const concepts = await getConcepts(searchParams)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { ...searchParams, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/concepts?${p.toString()}`
  }

  const grouped = concepts.reduce((acc, c) => {
    if (!acc[c.subject]) acc[c.subject] = []
    acc[c.subject].push(c)
    return acc
  }, {} as Record<string, typeof concepts>)

  const hasFilters = !!(searchParams.subject || searchParams.difficulty || searchParams.class)

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-purple-400/20 border-4 border-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-2xl">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Concept Explorer</h1>
        </div>
        <p className="text-purple-100 font-semibold text-base">
          {concepts.length} topics with formulas, key points, and exam tips — pick any to deep dive!
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border-2 border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-600">Filter Topics</span>
        </div>

        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</p>
          <div className="flex flex-wrap gap-2">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map(s => (
              <FilterChip
                key={s}
                active={searchParams.subject === s}
                href={buildUrl({ subject: searchParams.subject === s ? undefined : s })}
                label={s === 'Mathematics' ? 'Maths' : s}
                activeClass="bg-purple-500 text-white border-purple-500"
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {(['Easy', 'Medium', 'Hard'] as const).map(d => (
              <FilterChip
                key={d}
                active={searchParams.difficulty === d}
                href={buildUrl({ difficulty: searchParams.difficulty === d ? undefined : d })}
                label={d === 'Easy' ? '😊 Easy Peasy' : d === 'Medium' ? '🤔 Tricky' : '🔥 Hard'}
                activeClass={
                  d === 'Easy' ? 'bg-emerald-500 text-white border-emerald-500' :
                  d === 'Medium' ? 'bg-orange-500 text-white border-orange-500' :
                  'bg-pink-500 text-white border-pink-500'
                }
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Class</p>
          <div className="flex flex-wrap gap-2">
            {[{ label: '📚 Class 11', v: '11' }, { label: '📖 Class 12', v: '12' }].map(({ label, v }) => (
              <FilterChip
                key={v}
                active={searchParams.class === v}
                href={buildUrl({ class: searchParams.class === v ? undefined : v })}
                label={label}
                activeClass="bg-indigo-500 text-white border-indigo-500"
              />
            ))}
          </div>
        </div>

        {hasFilters && (
          <Link href="/concepts" className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-rose-500 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 transition-all">
            ✕ Clear all filters
          </Link>
        )}
      </div>

      {/* Concepts by subject */}
      {Object.entries(grouped).map(([subject, items]) => {
        const subjectColor = subject === 'Physics' ? 'border-orange-200 bg-orange-50' 
          : subject === 'Chemistry' ? 'border-emerald-200 bg-emerald-50' 
          : 'border-purple-200 bg-purple-50'
        return (
          <div key={subject}>
            <div className="flex items-center gap-3 mb-4 px-1">
              <SubjectBadge subject={subject} />
              <span className="text-sm font-bold text-slate-500">{items.length} topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map(c => (
                <Link
                  key={c.id}
                  href={`/concepts/${c.id}`}
                  className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/40 border-2 border-slate-100 hover:border-purple-200 hover:-translate-y-1 transition-all group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-black text-slate-800 group-hover:text-purple-700 transition-colors leading-snug">
                      {c.name}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-400 transition-colors shrink-0 mt-0.5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mb-4">{c.chapter} · Class {c.class}</p>

                  <div className="flex items-center gap-2 flex-wrap mt-auto">
                    <DifficultyBadge difficulty={c.difficulty} />
                    <div className="flex items-center gap-1.5 text-sm bg-orange-100 text-orange-700 px-2.5 py-1 rounded-xl font-black">
                      <Flame className="w-4 h-4" />
                      <span>{c.jee_count}</span>
                      <span className="font-semibold text-orange-500 text-xs">Qs</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500 ml-auto font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>{c.estimated_time_min} min</span>
                    </div>
                  </div>

                  {c.jee_tip && (
                    <p className="text-xs font-semibold text-slate-600 mt-3 line-clamp-2 leading-relaxed border-t-2 border-slate-100 pt-3">
                      💡 {c.jee_tip}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {concepts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border-2 border-slate-100">
          <div className="text-5xl mb-4">🧠</div>
          <p className="text-slate-800 font-black text-lg">No concepts found</p>
          <Link href="/concepts" className="mt-4 px-6 py-2.5 bg-purple-500 text-white rounded-full font-bold text-sm hover:bg-purple-600 transition-colors">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  )
}
