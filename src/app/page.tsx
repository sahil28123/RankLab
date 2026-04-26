export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import StatCard from '@/components/StatCard'
import SubjectBadge from '@/components/SubjectBadge'
import DifficultyBadge from '@/components/DifficultyBadge'
import Link from 'next/link'
import {
  FileQuestion, Brain, TrendingUp, BookOpen, Flame,
  ArrowRight, Zap, Target, ChevronRight, BarChart2, Sparkles, Rocket
} from 'lucide-react'

async function getDashboardData() {
  const [
    { count: totalQ },
    { count: physics },
    { count: chemistry },
    { count: maths },
    { data: topConcepts },
    { data: recentQ },
    { data: topNcert },
    { data: yearData },
  ] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'Physics'),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'Chemistry'),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'Mathematics'),
    supabase.from('concept_nodes').select('name,subject,jee_count,difficulty,chapter').order('jee_count', { ascending: false }).limit(5),
    supabase.from('questions').select('id,question_text,subject,chapter,difficulty,year,topic').order('year', { ascending: false }).limit(5),
    supabase.from('ncert_importance').select('subject,chapter,section_title,question_count,hard_question_count').order('question_count', { ascending: false }).limit(4),
    supabase.from('questions').select('year').order('year'),
  ])

  // Build year histogram on the server
  const yearCounts: Record<number, number> = {}
  for (const row of yearData ?? []) {
    yearCounts[row.year] = (yearCounts[row.year] ?? 0) + 1
  }
  const yearTrend = Object.entries(yearCounts)
    .map(([y, c]) => ({ year: Number(y), count: c }))
    .sort((a, b) => a.year - b.year)

  return { totalQ, physics, chemistry, maths, topConcepts, recentQ, topNcert, yearTrend }
}

export default async function Dashboard() {
  const { totalQ, physics, chemistry, maths, topConcepts, recentQ, topNcert, yearTrend } = await getDashboardData()

  const maxYear = Math.max(...(yearTrend.map(y => y.count) || [1]))

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in font-nunito max-w-7xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-400 p-8 md:p-12 shadow-xl shadow-blue-400/20 text-center md:text-left group">
        {/* Background playful elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute right-10 top-10 transform rotate-12 animate-wiggle hidden md:block opacity-80">
          <Rocket className="w-32 h-32 text-white/40" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce-subtle" />
            <span className="text-sm font-black text-white tracking-wide uppercase">Your Learning Adventure</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight drop-shadow-md">
            Ready to Explore <br className="md:hidden" /> New Concepts?
          </h1>
          <p className="text-blue-50 text-base md:text-lg max-w-xl leading-relaxed font-bold mb-8 drop-shadow-sm">
            Jump into thousands of fun questions, discover cool concepts, and master your subjects like a pro! 🚀
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
            <Link href="/questions" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-yellow-900 px-8 py-4 rounded-full text-lg font-black transition-transform hover:-translate-y-1 hover:scale-105 shadow-[0_6px_0_0_rgba(202,138,4,1)] active:shadow-none active:translate-y-[6px]">
              <FileQuestion className="w-6 h-6" /> Start a Quiz!
            </Link>
            <Link href="/concepts" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/50 px-8 py-4 rounded-full text-lg font-black transition-transform hover:-translate-y-1 hover:scale-105 shadow-[0_6px_0_0_rgba(255,255,255,0.2)] active:shadow-none active:translate-y-[6px]">
              <Brain className="w-6 h-6" /> Explore Map
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Stars" value={totalQ?.toLocaleString() ?? '—'} sub="Collected Questions" icon={Sparkles} color="blue" />
        <StatCard label="Physics" value={physics?.toLocaleString() ?? '—'} sub="Zap Energy" icon={Zap} color="orange" />
        <StatCard label="Chemistry" value={chemistry?.toLocaleString() ?? '—'} sub="Potions Mixed" icon={Target} color="emerald" />
        <StatCard label="Mathematics" value={maths?.toLocaleString() ?? '—'} sub="Brain Puzzles" icon={Brain} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Top Concepts */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border-2 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                 <Flame className="w-6 h-6 text-orange-500" /> Hot Topics!
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">Most popular concepts to learn</p>
            </div>
            <Link href="/concepts" className="text-sm font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors bg-sky-50 px-3 py-1.5 rounded-full">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topConcepts?.map((c, i) => (
              <Link
                key={c.name}
                href="/concepts"
                className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors group border-2 border-transparent hover:border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                   <span className="text-sm font-black text-slate-500">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-800 truncate group-hover:text-sky-600 transition-colors">{c.name}</p>
                  <p className="text-sm font-semibold text-slate-500 truncate">{c.chapter}</p>
                </div>
                <SubjectBadge subject={c.subject} />
                <div className="flex items-center gap-1.5 text-sm shrink-0 bg-orange-100 px-2.5 py-1 rounded-xl">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-black text-orange-600">{c.jee_count}</span>
                </div>
                <DifficultyBadge difficulty={c.difficulty} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6 md:space-y-8">
          {/* Difficulty split */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border-2 border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-500" />
              Challenge Level
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Easy Peasy', count: 2887, color: 'bg-emerald-400', bar: 'bg-emerald-100', pct: 19, text: 'text-emerald-600' },
                { label: 'Getting Tricky', count: 10171, color: 'bg-orange-400', bar: 'bg-orange-100', pct: 69, text: 'text-orange-600' },
                { label: 'Brain Bender', count: 1770, color: 'bg-pink-400', bar: 'bg-pink-100', pct: 12, text: 'text-pink-600' },
              ].map(({ label, count, color, pct, text, bar }) => (
                <div key={label} className="group">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className={`font-black ${text}`}>{label}</span>
                    <span className="text-slate-500 font-bold">{count.toLocaleString()} <span className="text-slate-400">({pct}%)</span></span>
                  </div>
                  <div className={`h-4 ${bar} rounded-full overflow-hidden border-2 border-transparent group-hover:border-slate-200 transition-colors`}>
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top NCERT */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border-2 border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                Magic Books
              </h3>
              <Link href="/ncert" className="text-sm font-bold text-sky-500 hover:text-sky-600 bg-sky-50 px-2 py-1 rounded-lg transition-colors">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {topNcert?.map((n) => (
                <div key={n.section_title} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 font-bold truncate">{n.section_title}</p>
                    <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">{n.subject} · {n.chapter}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-black shrink-0">
                    <TrendingUp className="w-4 h-4" />
                    {n.question_count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent questions */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border-2 border-slate-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 border-b-2 border-slate-100 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Fresh New Puzzles!</h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">Try answering these recent additions</p>
          </div>
          <Link href="/questions" className="text-sm font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors bg-sky-50 px-4 py-2 rounded-full self-start sm:self-auto">
            See all puzzles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y-2 divide-slate-100">
          {recentQ?.map((q) => (
            <Link
              key={q.id}
              href={`/questions/${q.id}`}
              className="flex flex-col md:flex-row md:items-center gap-4 p-6 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-700 line-clamp-2 group-hover:text-slate-900 transition-colors leading-relaxed">
                  {q.question_text}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">{q.year}</span>
                  <span className="text-xs font-bold text-slate-500 truncate max-w-[200px] bg-slate-50 px-2 py-1 rounded-lg">{q.chapter}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
                <SubjectBadge subject={q.subject} />
                <DifficultyBadge difficulty={q.difficulty} />
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
