import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const
export type Subject = typeof SUBJECTS[number]

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Physics: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
  },
  Chemistry: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
  Mathematics: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
  },
}

export const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Easy: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  Medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  Hard: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
}
