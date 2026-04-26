import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import Link from 'next/link'
import { BookOpen, TrendingUp, Info, SlidersHorizontal } from 'lucide-react'

interface SearchParams {
  subject?: string
  class?: string
}

async function getNcertData(params: SearchParams) {
  let query = supabase
    .from('ncert_importance')
    .select('*')
    .order('question_count', { ascending: false })
    .limit(80)

  if (params.subject) query = query.eq('subject', params.subject)
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

export default async function NcertPage({ searchParams }: { searchParams: SearchParams }) {
  const sections = await getNcertData(searchParams)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { ...searchParams, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/ncert?${p.toString()}`
  }

  const grouped = sections.reduce((acc, s) => {
    const key = `${s.subject}-${s.class}-${s.chapter}`
    if (!acc[key]) acc[key] = { subject: s.subject, class: s.class, chapter: s.chapter, items: [] }
    acc[key].items.push(s)
    return acc
  }, {} as Record<string, { subject: string; class: number; chapter: string; items: typeof sections }>)

  type GroupedType = { subject: string; class: number; chapter: string; items: typeof sections }
  const sortedGroups = (Object.values(grouped) as GroupedType[]).sort((a, b) => {
    const aTotal = a.items.reduce((sum, i) => sum + i.question_count, 0)
    const bTotal = b.items.reduce((sum, i) => sum + i.question_count, 0)
    return bTotal - aTotal
  })

  const maxCount = sections[0]?.question_count ?? 1
  const hasFilters = !!(searchParams.subject || searchParams.class)

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-400/20 border-4 border-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-2xl">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Book Insights</h1>
        </div>
        <p className="text-emerald-100 font-semibold text-base">
          Which NCERT sections matter most for JEE — study smart, not hard! 📚
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-4 p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-emerald-800 leading-relaxed">
          Sections are ranked by how many JEE questions they directly test.
          Connected using <span className="text-emerald-600 font-black">44,494</span> JEE↔NCERT links!
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border-2 border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-600">Filter Sections</span>
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</p>
          <div className="flex flex-wrap gap-2">
            {(['Physics', 'Chemistry'] as const).map(s => (
              <FilterChip
                key={s}
                active={searchParams.subject === s}
                href={buildUrl({ subject: searchParams.subject === s ? undefined : s })}
                label={s}
                activeClass="bg-emerald-500 text-white border-emerald-500"
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Class</p>
          <div className="flex flex-wrap gap-2">
            {['11', '12'].map(c => (
              <FilterChip
                key={c}
                active={searchParams.class === c}
                href={buildUrl({ class: searchParams.class === c ? undefined : c })}
                label={`📚 Class ${c}`}
                activeClass="bg-teal-500 text-white border-teal-500"
              />
            ))}
          </div>
        </div>
        {hasFilters && (
          <Link href="/ncert" className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-rose-500 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 transition-all">
            ✕ Clear all filters
          </Link>
        )}
      </div>

      {/* Top 6 podium */}
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border-2 border-slate-100">
        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          🏅 Most Tested Sections
        </h2>
        <div className="space-y-4">
          {sections.slice(0, 6).map((s, i) => (
            <div key={s.id} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-black text-slate-600 tabular-nums">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-emerald-600 font-black font-mono shrink-0 bg-emerald-100 px-2 py-0.5 rounded-lg">{s.section_num}</span>
                    <span className="text-sm font-bold text-slate-800 truncate">{s.section_title}</span>
                    <SubjectBadge subject={s.subject} />
                  </div>
                  <span className="text-sm font-black text-amber-600 flex items-center gap-1 shrink-0 tabular-nums bg-amber-100 px-2.5 py-1 rounded-xl">
                    <TrendingUp className="w-4 h-4" />{s.question_count}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all"
                    style={{ width: `${Math.round((s.question_count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By chapter */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-700 uppercase tracking-wider px-1">📖 By Chapter</h2>
        {sortedGroups.map(({ subject, class: cls, chapter, items }) => {
          const totalCount = items.reduce((sum, i) => sum + i.question_count, 0)
          const headerBg = subject === 'Physics' ? 'bg-orange-50 border-orange-200' 
            : subject === 'Chemistry' ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-purple-50 border-purple-200'
          return (
            <div key={`${subject}-${cls}-${chapter}`} className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border-2 border-slate-100 overflow-hidden">
              <div className={`flex items-center justify-between px-5 py-4 border-b-2 border-slate-100 ${headerBg}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <SubjectBadge subject={subject} />
                  <span className="text-xs font-black text-slate-600 bg-slate-200 px-2 py-0.5 rounded-lg shrink-0">Class {cls}</span>
                  <h3 className="text-sm font-black text-slate-800 truncate">{chapter}</h3>
                </div>
                <span className="text-sm font-black text-amber-600 flex items-center gap-1 shrink-0 ml-2 tabular-nums bg-amber-100 px-2.5 py-1 rounded-xl">
                  <TrendingUp className="w-4 h-4" />{totalCount}
                </span>
              </div>
              <div className="divide-y-2 divide-slate-100">
                {items.map(section => (
                  <div key={section.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-black font-mono text-emerald-600 shrink-0 mt-0.5 bg-emerald-100 px-2 py-0.5 rounded-lg tabular-nums">{section.section_num}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-slate-800 leading-snug">{section.section_title}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-black text-amber-600 flex items-center gap-0.5 tabular-nums bg-amber-100 px-2.5 py-1 rounded-xl">
                              <TrendingUp className="w-4 h-4" />{section.question_count}
                            </span>
                            {section.hard_question_count > 0 && (
                              <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-lg hidden sm:block">{section.hard_question_count} hard</span>
                            )}
                          </div>
                        </div>
                        {section.paragraph && (
                          <p className="text-xs font-semibold text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{section.paragraph}</p>
                        )}
                        <div className="mt-2.5 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.round((section.question_count / maxCount) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
