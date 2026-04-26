import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  color?: 'blue' | 'purple' | 'emerald' | 'orange' | 'rose'
  trend?: { value: number; label: string }
}

const colorMap = {
  blue: {
    icon: 'text-sky-500',
    bg: 'bg-sky-100',
    border: 'border-sky-300',
    cardBorder: 'border-sky-200',
    cardBg: 'bg-white',
    glow: 'shadow-[0_4px_0_0_rgba(186,230,253,1)]',
    value: 'text-sky-600',
  },
  purple: {
    icon: 'text-purple-500',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    cardBorder: 'border-purple-200',
    cardBg: 'bg-white',
    glow: 'shadow-[0_4px_0_0_rgba(233,213,255,1)]',
    value: 'text-purple-600',
  },
  emerald: {
    icon: 'text-emerald-500',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    cardBorder: 'border-emerald-200',
    cardBg: 'bg-white',
    glow: 'shadow-[0_4px_0_0_rgba(167,243,208,1)]',
    value: 'text-emerald-600',
  },
  orange: {
    icon: 'text-orange-500',
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    cardBorder: 'border-orange-200',
    cardBg: 'bg-white',
    glow: 'shadow-[0_4px_0_0_rgba(254,215,170,1)]',
    value: 'text-orange-600',
  },
  rose: {
    icon: 'text-pink-500',
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    cardBorder: 'border-pink-200',
    cardBg: 'bg-white',
    glow: 'shadow-[0_4px_0_0_rgba(252,165,165,1)]',
    value: 'text-pink-600',
  },
}

export default function StatCard({ label, value, sub, icon: Icon, color = 'blue', trend }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className={cn('rounded-3xl p-4 md:p-6 flex flex-col gap-3 transition-transform hover:-translate-y-1 border-2', c.cardBg, c.cardBorder, c.glow)}>
      <div className="flex items-start justify-between">
        <div className={cn('p-3 rounded-2xl border-2', c.bg, c.border)}>
          <Icon className={cn('w-6 h-6', c.icon)} />
        </div>
        {trend && (
          <span className={cn(
            'text-[10px] font-extrabold px-2 py-1 rounded-xl uppercase tracking-wider',
            trend.value > 0
              ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-200'
              : 'bg-pink-100 text-pink-600 border-2 border-pink-200'
          )}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className={cn("text-3xl md:text-4xl font-black tabular-nums leading-none tracking-tight", c.value)}>{value}</p>
        <p className="text-sm md:text-base font-bold text-slate-500 mt-2">{label}</p>
        {sub && <p className="text-xs font-semibold text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}
