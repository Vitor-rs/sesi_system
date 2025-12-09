import { BookOpen } from 'lucide-react'
import { PageLayout } from '../components/layouts/PageLayout'
import { DisciplinesList } from '../features/disciplines/components/DisciplinesList'

export function DisciplinesPage(): React.ReactElement {
  return (
    <PageLayout
      title="Disciplinas"
      description="Gerencie as matérias disponíveis no sistema."
      icon={BookOpen}
    >
      <div className="flex-1 overflow-y-auto pr-2 pb-6">
        <DisciplinesList />
      </div>
    </PageLayout>
  )
}
