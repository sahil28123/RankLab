import { cn } from '@/lib/utils'

// Hardcoding light theme colors here since they were previously in utils
const LIGHT_DIFFICULTY_COLORS: Record<string, { bg: string, text: string, dot: string, border: string }> = {
  Easy: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-300' },
  Medium: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', border: 'border-orange-300' },
  Hard: { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500', border: 'border-pink-300' },
}

export default function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const c = LIGHT_DIFFICULTY_COLORS[difficulty] ?? LIGHT_DIFFICULTY_COLORS.Medium
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
      c.bg, c.text, c.border
    )}>
      <span className={cn('w-2 h-2 rounded-full shrink-0', c.dot)} />
      {difficulty}
    </span>
  )
}
