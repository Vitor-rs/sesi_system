import { School } from 'lucide-react'
import { PageLayout } from '../components/layouts/PageLayout'
import { ClassesList } from '../features/classes/components/ClassesList'

export function ClassesPage(): React.ReactElement {
  return (
    <PageLayout title="Turmas" description="Gerencie as turmas e períodos letivos." icon={School}>
      <div className="flex-1 overflow-y-auto pr-2 pb-6">
        <ClassesList />
      </div>
    </PageLayout>
  )
}
