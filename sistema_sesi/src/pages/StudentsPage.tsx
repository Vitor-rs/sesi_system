import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { StudentList } from '../features/students/components/StudentList'
import { StudentForm } from '../features/students/components/StudentForm'
import { useStudentStore, type Student } from '../stores/useStudentStore'

export function StudentsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const { addStudent, updateStudent } = useStudentStore()

    const handleAddClick = () => {
        setEditingStudent(null)
        setIsFormOpen(true)
    }

    const handleEditClick = (student: Student) => {
        setEditingStudent(student)
        setIsFormOpen(true)
    }

    const handleFormSubmit = (name: string) => {
        if (editingStudent) {
            updateStudent(editingStudent.id, name)
        } else {
            addStudent(name)
        }
        setIsFormOpen(false)
        setEditingStudent(null)
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Alunos
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gerencie o cadastro de alunos da turma.
                    </p>
                </div>

                <button
                    onClick={handleAddClick}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Novo Aluno
                </button>
            </header>

            <main>
                <StudentList onEdit={handleEditClick} />
            </main>

            {isFormOpen && (
                <StudentForm
                    initialData={editingStudent}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setIsFormOpen(false)
                        setEditingStudent(null)
                    }}
                />
            )}
        </div>
    )
}
