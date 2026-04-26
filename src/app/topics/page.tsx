import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import DifficultyBadge from '@/components/DifficultyBadge'
import Link from 'next/link'
import { TrendingUp, Flame, ChevronRight } from 'lucide-react'

async function getTopicData(subject?: string) {
  let query = supabase
    .from('concept_nodes')
    .select('id,name,subject,chapter,class,jee_count,pct_hard,difficulty,estimated_time_min,jee_tip')
    .order('jee_count', { ascending: false })
    .limit(100)

  if (subject) query = query.eq('subject', subject)

  const { data } = await query
  return data ?? []
}

const subjectAccent: Record<string, { bar: string; headerBg: string }> = {
  Physics: { bar: 'bg-orange-400', headerBg: 'bg-orange-50 border-orange-200' },
  Chemistry: { bar: 'bg-emerald-400', headerBg: 'bg-emerald-50 border-emerald-200' },
  Mathematics: { bar: 'bg-purple-400', headerBg: 'bg-purple-50 border-purple-200' },
}

export default async function TopicsPage({ searchParams }: { searchParams: { subject?: string } }) {
  const topics = await getTopicData(searchParams.subject)

  const buildUrl = (subject?: string) => subject ? `/topics?subject=${subject}` : '/topics'

  const grouped = topics.reduce((acc, t) => {
    const key = t.chapter
    if (!acc[key]) acc[key] = { chapter: key, subject: t.subject, items: [] }
    acc[key].items.push(t)
    return acc
  }, {} as Record<string, { chapter: string; subject: string; items: typeof topics }>)

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    const aMax = Math.max(...a.items.map(i => i.jee_count))
    const bMax = Math.max(...b.items.map(i => i.jee_count))
    return bMax - aMax
  })

  const top10 = topics.slice(0, 10)
  const maxCount = top10[0]?.jee_count ?? 1

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-400/20 border-4 border-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-2xl">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Topic Trends</h1>
        </div>
        <p className="text-orange-100 font-semibold text-base">See which topics appear most — focus on the hot ones! 🔥</p>
      </div>

      {/* Subject filter */}
      <div className="flex gap-2 flex-wrap">
        {[undefined, 'Physics', 'Chemistry', 'Mathematics'].map(s => (
          <Link key={s ?? 'all'} href={buildUrl(s)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
              searchParams.subject === s || (!searchParams.subject && !s)
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {s ? (s === 'Mathematics' ? 'Maths' : s) : 'All Subjects'}
          </Link>
        ))}
      </div>

      {/* Top 10 visual */}
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border-2 border-slate-100">
        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          🏆 Top 10 Most Tested Topics
        </h2>
        <div className="space-y-4">
          {top10.map((t, i) => {
            const pct = Math.round((t.jee_count / maxCount) * 100)
            const accent = subjectAccent[t.subject] ?? subjectAccent.Physics
            return (
              <Link key={t.id} href={`/concepts/${t.id}`} className="block group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-slate-600 tabular-nums">{i + 1}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">{t.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <SubjectBadge subject={t.subject} />
                      <span className="text-sm font-black text-orange-600 flex items-center gap-1 min-w-[52px] justify-end tabular-nums bg-orange-100 px-2.5 py-1 rounded-xl">
                        <Flame className="w-4 h-4" />{t.jee_count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-11">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full ${accent.bar} rounded-full transition-all group-hover:opacity-80`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* By chapter */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-700 uppercase tracking-wider px-1">📚 By Chapter</h2>
        {sortedGroups.map(({ chapter, subject, items }) => {
          const totalQ = items.reduce((s, i) => s + i.jee_count, 0)
          const accent = subjectAccent[subject] ?? subjectAccent.Physics
          return (
            <div key={chapter} className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border-2 border-slate-100 overflow-hidden">
              <div className={`flex items-center justify-between px-5 py-4 border-b-2 border-slate-100 ${accent.headerBg}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <SubjectBadge subject={subject} />
                  <h3 className="text-sm font-black text-slate-800 truncate">{chapter}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-slate-500">{items.length} topics</span>
                  <span className="text-sm font-black text-orange-600 flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-xl">
                    <Flame className="w-4 h-4" />{totalQ}
                  </span>
                </div>
              </div>
              <div className="divide-y-2 divide-slate-100">
                {items.map(t => (
                  <Link key={t.id} href={`/concepts/${t.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">{t.name}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-1">Class {t.class} · {t.estimated_time_min} min</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <DifficultyBadge difficulty={t.difficulty} />
                      <span className="text-sm font-black text-orange-600 flex items-center gap-1 min-w-[40px] justify-end tabular-nums">
                        <Flame className="w-4 h-4" />{t.jee_count}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
