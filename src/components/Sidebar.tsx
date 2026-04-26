'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, Brain, TrendingUp,
  FileQuestion, Layers, Zap, Menu, X, Rocket, Star, Trophy
} from 'lucide-react'
import { useState, useEffect } from 'react'

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Home Base', accent: 'text-sky-500', bg: 'bg-sky-100', dot: 'bg-sky-500' },
  { href: '/questions', icon: FileQuestion, label: 'Practice Questions', accent: 'text-pink-500', bg: 'bg-pink-100', dot: 'bg-pink-500' },
  { href: '/concepts', icon: Brain, label: 'Concept Explorer', accent: 'text-purple-500', bg: 'bg-purple-100', dot: 'bg-purple-500' },
  { href: '/topics', icon: TrendingUp, label: 'Topic Trends', accent: 'text-orange-500', bg: 'bg-orange-100', dot: 'bg-orange-500' },
  { href: '/ncert', icon: BookOpen, label: 'Book Insights', accent: 'text-emerald-500', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
  { href: '/chapters', icon: Layers, label: 'Chapter Journey', accent: 'text-yellow-500', bg: 'bg-yellow-100', dot: 'bg-yellow-500' },
]

const stats = [
  { label: 'Stars', value: '14,828', icon: Star, color: 'text-yellow-500' },
  { label: 'Levels', value: '23', icon: Layers, color: 'text-blue-500' },
  { label: 'Concepts', value: '19K+', icon: Brain, color: 'text-purple-500' },
  { label: 'Trophies', value: '44+', icon: Trophy, color: 'text-orange-500' },
]

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 transform transition-transform hover:scale-110 hover:rotate-3">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-xl leading-tight tracking-tight font-nunito">RankLab</p>
            <p className="text-xs font-semibold text-slate-500 leading-tight">Learning Adventure</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto bg-white/50">
        {nav.map(({ href, icon: Icon, label, accent, bg, dot }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-2xl text-[15px] font-bold transition-all duration-200 group',
                active
                  ? 'bg-white shadow-md shadow-slate-200/50 text-slate-800 border-2 border-slate-100 scale-105'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white hover:shadow-sm hover:scale-[1.02] border-2 border-transparent'
              )}
            >
              <div className={cn('p-2 rounded-xl transition-colors', active ? bg : 'bg-slate-100 group-hover:bg-slate-200')}>
                 <Icon className={cn('w-5 h-5 shrink-0', active ? accent : 'text-slate-500')} />
              </div>
              <span className="truncate">{label}</span>
              {active && <span className={cn('ml-auto w-2.5 h-2.5 rounded-full shrink-0 animate-pulse', dot)} />}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-5 border-t border-slate-100 shrink-0 bg-slate-50/80">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 mb-3">My Progress</p>
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 mb-1">
                 <Icon className={cn('w-4 h-4', color)} />
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-lg font-black text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 z-40 shadow-sm">
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all"
          aria-label="Open navigation"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight text-lg">RankLab</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-slate-50/50 border-r border-slate-200 flex-col z-50">
        <NavContent />
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-[80vw] max-w-xs h-full bg-slate-50 flex flex-col shadow-2xl shadow-slate-900/20 overflow-hidden">
            <NavContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
