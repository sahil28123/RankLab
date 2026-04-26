import { supabase } from '@/lib/supabase'
import SubjectBadge from '@/components/SubjectBadge'
import DifficultyBadge from '@/components/DifficultyBadge'
import YearSelect from '@/components/YearSelect'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { ChevronRight, FileQuestion, SlidersHorizontal, Search } from 'lucide-react'
import { Suspense } from 'react'

interface SearchParams {
  subject?: string
  difficulty?: string
  year?: string
  type?: string
  q?: string
  page?: string
}

async function getQuestions(params: SearchParams) {
  const page = parseInt(params.page ?? '1')
  const pageSize = 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('questions')
    .select('id,question_text,subject,chapter,topic,difficulty,question_type,year,shift', { count: 'exact' })
    .order('year', { ascending: false })
    .order('q_num', { ascending: true })
    .range(from, to)

  if (params.subject) query = query.eq('subject', params.subject)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.year) query = query.eq('year', parseInt(params.year))
  if (params.type) query = query.eq('question_type', params.type)
  if (params.q) query = query.ilike('question_text', `%${params.q}%`)

  const { data, count } = await query
  return { questions: data ?? [], total: count ?? 0, page, pageSize }
}

async function getYears() {
  const { data } = await supabase.from('questions').select('year').order('year', { ascending: false })
  return [...new Set((data ?? []).map(y => y.year))]
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

export default async function QuestionsPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ questions, total, page, pageSize }, years] = await Promise.all([
    getQuestions(searchParams),
    getYears(),
  ])

  const totalPages = Math.ceil(total / pageSize)
  const hasFilters = !!(searchParams.subject || searchParams.difficulty || searchParams.year || searchParams.type || searchParams.q)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { ...searchParams, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/questions?${p.toString()}`
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-pink-400/20 border-4 border-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-2xl">
            <FileQuestion className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Practice Questions</h1>
        </div>
        <p className="text-pink-100 font-semibold text-base">
          {total.toLocaleString()} questions across 23 years of JEE Main — find and practise any topic!
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border-2 border-slate-100 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-600">Search & Filter</span>
        </div>
        {/* Search row */}
        <Suspense fallback={
          <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
        }>
          <SearchBar
            placeholder="Search questions by text…"
            defaultValue={searchParams.q ?? ''}
          />
        </Suspense>

        {/* Filter chips */}
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</p>
          <div className="flex items-center gap-2 flex-wrap">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map(s => (
              <FilterChip
                key={s}
                active={searchParams.subject === s}
                href={buildUrl({ subject: searchParams.subject === s ? undefined : s, page: '1' })}
                label={s === 'Mathematics' ? 'Maths' : s}
                activeClass="bg-sky-500 text-white border-sky-500"
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Difficulty</p>
          <div className="flex items-center gap-2 flex-wrap">
            {(['Easy', 'Medium', 'Hard'] as const).map(d => (
              <FilterChip
                key={d}
                active={searchParams.difficulty === d}
                href={buildUrl({ difficulty: searchParams.difficulty === d ? undefined : d, page: '1' })}
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

        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Type</p>
            <div className="flex items-center gap-2 flex-wrap">
              {(['MCQ', 'Numerical'] as const).map(t => (
                <FilterChip
                  key={t}
                  active={searchParams.type === t}
                  href={buildUrl({ type: searchParams.type === t ? undefined : t, page: '1' })}
                  label={t}
                  activeClass="bg-purple-500 text-white border-purple-500"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Year</p>
            <YearSelect
              years={years}
              currentYear={searchParams.year}
              searchParams={searchParams as Record<string, string | undefined>}
            />
          </div>
        </div>

        {hasFilters && (
          <Link
            href="/questions"
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-rose-500 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 transition-all"
          >
            ✕ Clear all filters
          </Link>
        )}
      </div>

      {/* Results count */}
      {hasFilters && (
        <p className="text-sm text-slate-600 font-semibold px-1">
          Found <span className="text-slate-900 font-black">{total.toLocaleString()}</span> result{total !== 1 ? 's' : ''}
          {searchParams.q && <> for &ldquo;<span className="text-pink-600">{searchParams.q}</span>&rdquo;</>}
        </p>
      )}

      {/* Questions list */}
      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border-2 border-slate-100 overflow-hidden">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-800 font-black text-lg">No questions found</p>
            <p className="text-slate-500 font-semibold text-sm mt-2">Try adjusting your filters or search query</p>
            <Link href="/questions" className="mt-4 px-6 py-2.5 bg-sky-500 text-white rounded-full font-bold text-sm hover:bg-sky-600 transition-colors">
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-100">
            {questions.map((q, i) => (
              <Link
                key={q.id}
                href={`/questions/${q.id}`}
                className="flex items-start gap-3 md:gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                <span className="text-sm font-black text-slate-400 mt-1 shrink-0 w-7 text-right hidden sm:block">
                  {((page - 1) * pageSize) + i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-sky-700 transition-colors leading-relaxed">
                    {q.question_text}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 tabular-nums">{q.year}</span>
                    {q.shift && (
                      <span className="text-xs font-semibold text-slate-500">{q.shift.replace(/_/g, ' ')}</span>
                    )}
                    <span className="text-xs font-semibold text-slate-500 truncate max-w-[180px]">{q.chapter}</span>
                    {q.question_type && (
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg ml-auto hidden sm:block">{q.question_type}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0 pt-0.5">
                  <SubjectBadge subject={q.subject} />
                  <DifficultyBadge difficulty={q.difficulty} />
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center transition-colors hidden sm:flex">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 px-1">
          <p className="text-sm text-slate-500 font-semibold shrink-0">
            Showing <span className="text-slate-800 font-black">{((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)}</span>
            {' '}of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link href={buildUrl({ page: String(page - 1) })} className="px-4 py-2 text-sm font-bold bg-white border-2 border-slate-200 hover:border-slate-300 rounded-full text-slate-600 transition-colors">
                ← Prev
              </Link>
            )}
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <Link key={p} href={buildUrl({ page: String(p) })}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded-full border-2 font-bold transition-colors ${
                    p === page
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p}
                </Link>
              )
            })}
            {page < totalPages && (
              <Link href={buildUrl({ page: String(page + 1) })} className="px-4 py-2 text-sm font-bold bg-white border-2 border-slate-200 hover:border-slate-300 rounded-full text-slate-600 transition-colors">
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
