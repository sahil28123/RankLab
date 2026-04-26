import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const
export type Subject = typeof SUBJECTS[number]

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Physics: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300',
    glow: 'shadow-orange-200',
  },
  Chemistry: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    glow: 'shadow-emerald-200',
  },
  Mathematics: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
    glow: 'shadow-purple-200',
  },
}

export const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Easy:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Medium: { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  Hard:   { bg: 'bg-pink-100',    text: 'text-pink-700',    dot: 'bg-pink-500'    },
}
