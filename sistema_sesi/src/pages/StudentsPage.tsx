import { Users } from 'lucide-react'
import { StudentsDashboard } from '../features/students/components/StudentsDashboard'

export function StudentsPage() {
    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Estudantes
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gerencie o cadastro de estudantes, turmas e enturmação.
                    </p>
                </div>
            </header>

            <main>
                <StudentsDashboard />
            </main>
        </div>
    )
}
