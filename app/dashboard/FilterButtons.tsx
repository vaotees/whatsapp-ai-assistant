'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const FILTERS = [
  { key: 'todos', label: 'Total' },
  { key: 'novo', label: 'Novos' },
  { key: 'qualificado', label: 'Qualificados' },
  { key: 'convertido', label: 'Convertidos' },
]

const COLORS: Record<string, string> = {
  todos: 'bg-gray-900 text-white',
  novo: 'bg-blue-600 text-white',
  qualificado: 'bg-green-600 text-white',
  convertido: 'bg-purple-600 text-white',
}

export function FilterButtons({ counts, total }: { counts: Record<string, number>; total: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('status') ?? 'todos'

  function setFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'todos') {
      params.delete('status')
    } else {
      params.set('status', key)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  const countFor = (key: string) => (key === 'todos' ? total : (counts[key] ?? 0))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`rounded-xl p-4 text-left transition-opacity ${COLORS[f.key]} ${
            current === f.key ? 'opacity-100 ring-2 ring-offset-2 ring-gray-400' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <div className="text-3xl font-bold">{countFor(f.key)}</div>
          <div className="text-sm mt-1 opacity-90">{f.label}</div>
        </button>
      ))}
    </div>
  )
}
