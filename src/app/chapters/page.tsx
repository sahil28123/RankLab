import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import Link from 'next/link'
import { Layers, ChevronRight } from 'lucide-react'

async function getChapterData() {
  const { data } = await supabase
    .from('questions')
    .select('subject,chapter,difficulty')
    .limit(20000)

  if (!data) return []

  const map: Record<string, { subject: string; chapter: string; easy: number; medium: number; hard: number; total: number }> = {}

  for (const q of data) {
    const key = `${q.subject}::${q.chapter}`
    if (!map[key]) map[key] = { subject: q.subject, chapter: q.chapter, easy: 0, medium: 0, hard: 0, total: 0 }
    map[key].total++
    if (q.difficulty === 'Easy') map[key].easy++
    else if (q.difficulty === 'Medium') map[key].medium++
    else if (q.difficulty === 'Hard') map[key].hard++
  }

  return Object.values(map).sort((a, b) => b.total - a.total)
}

export default async function ChaptersPage() {
  const chapters = await getChapterData()

  const bySubject = chapters.reduce((acc, c) => {
    if (!acc[c.subject]) acc[c.subject] = []
    acc[c.subject].push(c)
    return acc
  }, {} as Record<string, typeof chapters>)

  const subjectOrder = ['Physics', 'Chemistry', 'Mathematics']
  const subjectEmoji: Record<string, string> = { Physics: '⚡', Chemistry: '🧪', Mathematics: '📐' }
  const subjectColor: Record<string, { header: string; bar: string; btn: string }> = {
    Physics:     { header: 'from-orange-400 to-amber-400', bar: 'shadow-orange-400/20', btn: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100' },
    Chemistry:   { header: 'from-emerald-400 to-teal-400', bar: 'shadow-emerald-400/20', btn: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
    Mathematics: { header: 'from-purple-400 to-indigo-400', bar: 'shadow-purple-400/20', btn: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-yellow-400/20 border-4 border-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-2xl">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Chapter Journey</h1>
        </div>
        <p className="text-yellow-100 font-semibold text-base">
          See how many questions come from each chapter — and how hard they are! 📊
        </p>
      </div>

      {subjectOrder.map(subject => {
        const items = bySubject[subject] ?? []
        const maxTotal = items[0]?.total ?? 1
        const sc = subjectColor[subject] ?? subjectColor.Physics
        const emoji = subjectEmoji[subject] ?? '📚'

        return (
          <div key={subject} className="space-y-4">
            {/* Subject header */}
            <div className={`bg-gradient-to-r ${sc.header} rounded-3xl p-4 md:p-5 shadow-lg ${sc.bar} border-4 border-white flex items-center gap-3`}>
              <span className="text-3xl">{emoji}</span>
              <div>
                <SubjectBadge subject={subject} />
                <p className="text-white font-black text-lg mt-1">{items.length} chapters</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border-2 border-slate-100 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_64px_64px_64px_100px] border-b-2 border-slate-100 bg-slate-50 px-5 py-3 gap-3">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Chapter Name</span>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider text-right hidden md:block">😊 Easy</span>
                <span className="text-xs font-black text-orange-500 uppercase tracking-wider text-right hidden md:block">🤔 Med</span>
                <span className="text-xs font-black text-pink-600 uppercase tracking-wider text-right hidden md:block">🔥 Hard</span>
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-right">Total</span>
              </div>

              <div className="divide-y-2 divide-slate-100">
                {items.map(ch => {
                  const pctHard = ch.total > 0 ? Math.round((ch.hard / ch.total) * 100) : 0
                  const barPct = Math.round((ch.total / maxTotal) * 100)
                  const easyW = ch.total > 0 ? (ch.easy / ch.total) * barPct : 0
                  const medW = ch.total > 0 ? (ch.medium / ch.total) * barPct : 0
                  const hardW = ch.total > 0 ? (ch.hard / ch.total) * barPct : 0

                  return (
                    <div key={ch.chapter} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_64px_64px_64px_100px] items-center gap-3 mb-3">
                        <span className="text-sm font-bold text-slate-800 truncate">{ch.chapter}</span>
                        <span className="text-sm text-emerald-600 font-black text-right hidden md:block tabular-nums">{ch.easy}</span>
                        <span className="text-sm text-orange-500 font-black text-right hidden md:block tabular-nums">{ch.medium}</span>
                        <span className="text-sm text-pink-600 font-black text-right hidden md:block tabular-nums">{ch.hard}</span>
                        <div className="flex items-center justify-end gap-2 tabular-nums">
                          <span className="text-sm font-black text-slate-800">{ch.total}</span>
                          {pctHard >= 25 && (
                            <span className="text-xs font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded-lg hidden sm:block border border-pink-200">
                              {pctHard}% hard
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile breakdown */}
                      <div className="flex items-center gap-3 mb-3 md:hidden">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg tabular-nums">{ch.easy} Easy</span>
                        <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-lg tabular-nums">{ch.medium} Med</span>
                        <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-lg tabular-nums">{ch.hard} Hard</span>
                        {pctHard >= 25 && (
                          <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-lg">
                            {pctHard}% hard!
                          </span>
                        )}
                      </div>

                      {/* Stacked bar */}
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                        <div className="h-full bg-emerald-400 transition-all rounded-l-full" style={{ width: `${easyW}%` }} />
                        <div className="h-full bg-orange-400 transition-all" style={{ width: `${medW}%` }} />
                        <div className="h-full bg-pink-500 transition-all rounded-r-full" style={{ width: `${hardW}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick link */}
            <Link
              href={`/questions?subject=${subject}`}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${sc.btn}`}
            >
              {emoji} Browse {subject === 'Mathematics' ? 'Maths' : subject} questions
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
