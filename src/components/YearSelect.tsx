'use client'

interface YearSelectProps {
  years: number[]
  currentYear?: string
  searchParams: Record<string, string | undefined>
}

export default function YearSelect({ years, currentYear, searchParams }: YearSelectProps) {
  function buildUrl(year: string) {
    const p = new URLSearchParams()
    const merged = { ...searchParams, year: year || undefined, page: '1' }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/questions?${p.toString()}`
  }

  return (
    <select
      className="bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-2xl px-4 py-2.5 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition-all shadow-sm cursor-pointer"
      value={currentYear ?? ''}
      onChange={(e) => {
        window.location.href = buildUrl(e.target.value)
      }}
    >
      <option value="">📅 All Years</option>
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  )
}
