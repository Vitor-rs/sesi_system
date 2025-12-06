import { Pencil, Trash2 } from 'lucide-react'
import { useStudentStore, type Student } from '../../../stores/useStudentStore'

interface StudentListProps {
    onEdit: (student: Student) => void
}

export function StudentList({ onEdit }: StudentListProps) {
    const { students, removeStudent } = useStudentStore()

    if (students.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                Nenhum estudante cadastrado. Adicione estudantes para começar.
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 w-16">Nº</th>
                            <th className="px-6 py-4">Nome do Estudante</th>
                            <th className="px-6 py-4 w-32 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student, index) => (
                            <tr
                                key={student.id}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-gray-500">
                                    {String(index + 1).padStart(2, '0')}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {student.name}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(student)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Tem certeza que deseja excluir ${student.name}?`)) {
                                                removeStudent(student.id)
                                            }
                                        }}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
