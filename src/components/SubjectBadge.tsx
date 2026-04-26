import { cn } from '@/lib/utils'

const LIGHT_SUBJECT_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  Physics: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  Chemistry: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  Mathematics: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
}

export default function SubjectBadge({ subject }: { subject: string }) {
  const c = LIGHT_SUBJECT_COLORS[subject] ?? LIGHT_SUBJECT_COLORS.Physics
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-black border-2 tracking-wide uppercase',
      c.bg, c.text, c.border
    )}>
      {subject === 'Mathematics' ? 'Maths' : subject}
    </span>
  )
}
