import { Users } from 'lucide-react'
import { PageLayout } from '../components/layouts/PageLayout'
import { StudentsDashboard } from '../features/students/components/StudentsDashboard'

export function StudentsPage(): React.ReactElement {
  return (
    <PageLayout
      title="Estudantes"
      description="Gerencie o cadastro de estudantes, turmas e enturmação."
      icon={Users}
    >
      <StudentsDashboard />
    </PageLayout>
  )
}
