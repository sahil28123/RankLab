'use client'

import { useState, useTransition } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  paramKey?: string
  defaultValue?: string
}

export default function SearchBar({
  placeholder = 'Search questions…',
  paramKey = 'q',
  defaultValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function navigate(val: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (val.trim()) {
      params.set(paramKey, val.trim())
    } else {
      params.delete(paramKey)
    }
    params.delete('page')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(value)
  }

  function handleClear() {
    setValue('')
    navigate('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      {pending ? (
        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500 animate-spin pointer-events-none" />
      ) : (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border-2 border-slate-200 text-slate-800 text-base font-semibold rounded-2xl pl-12 pr-10 py-3 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 placeholder:text-slate-400 transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  )
}
