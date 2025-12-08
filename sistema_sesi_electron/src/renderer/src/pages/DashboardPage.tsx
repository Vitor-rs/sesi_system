import { Home } from 'lucide-react'
import { PageLayout } from '../components/layouts/PageLayout'
import { Dashboard } from '../features/dashboard'

export function DashboardPage(): React.ReactElement {
  return (
    <PageLayout title="Dashboard" icon={Home} description="Visão geral do sistema.">
      <div className="flex-1 overflow-y-auto">
        <Dashboard />
      </div>
    </PageLayout>
  )
}
