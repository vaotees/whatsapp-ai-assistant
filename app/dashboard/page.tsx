import { getAllLeads } from '@/lib/db'
import { FilterButtons } from './FilterButtons'
import { Suspense } from 'react'

const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  qualificado: 'Qualificado',
  perdido: 'Perdido',
  convertido: 'Convertido',
}

const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-blue-100 text-blue-800',
  qualificado: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800',
  convertido: 'bg-purple-100 text-purple-800',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const allLeads = await getAllLeads()

  const counts = allLeads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const filtered = status ? allLeads.filter((l) => l.status === status) : allLeads

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">WhatsApp Bot — Leads</h1>
            <p className="text-sm text-gray-500">EM Soluções Digitais</p>
          </div>
          <a
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Atualizar
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Suspense>
          <FilterButtons counts={counts} total={allLeads.length} />
        </Suspense>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              Nenhum lead encontrado
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Telefone</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Nome</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">E-mail</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Interesse</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-700">{lead.phone}</td>
                    <td className="px-6 py-4 text-gray-900">{lead.name ?? <span className="text-gray-400">—</span>}</td>
                    <td className="px-6 py-4 text-gray-700">{lead.email ?? <span className="text-gray-400">—</span>}</td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{lead.interest ?? <span className="text-gray-400">—</span>}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
