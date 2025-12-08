import { BarChart3 } from 'lucide-react'
import { PageLayout } from '../components/layouts/PageLayout'

export function ReportsPage(): React.ReactElement {
  return (
    <PageLayout
      title="Relatórios Gerais"
      icon={BarChart3}
      description="Visualize métricas e exporte dados do sistema."
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Cards */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 opacity-50"
            >
              <div className="p-3 bg-gray-50 w-fit rounded-lg">
                <BarChart3 className="text-gray-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Relatório Exemplo {i}</h3>
                <p className="text-sm text-gray-400">Em desenvolvimento...</p>
              </div>
              <button
                disabled
                className="mt-auto w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed"
              >
                Gerar PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
