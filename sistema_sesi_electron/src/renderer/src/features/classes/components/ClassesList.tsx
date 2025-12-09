import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Users } from 'lucide-react'
import { useClassesStore } from '../stores/useClassesStore'
import { CreateClassModal } from './CreateClassModal'

export function ClassesList(): React.ReactElement {
  const { classes, fetchClasses, deleteClass, isLoading } = useClassesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  const handleDelete = async (id: string): Promise<void> => {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      await deleteClass(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Turmas Cadastradas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => navigate(`/classes/${cls.id}`)}
            className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(cls.id)
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir turma"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{cls.name}</h3>
                <p className="text-sm text-gray-500">
                  {cls.grade} • {cls.period}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm text-gray-500">
              <span>Ano: {cls.period}</span>
              {/* Note: sharedTypes says 'grade' e 'letter', but schema has 'year'.
                     ClassService maps 'name' to grade/letter.
                     The UI relies on properties returned by ClassService. */}
            </div>
          </button>
        ))}
        {classes.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            <p className="text-gray-500">Nenhuma turma cadastrada.</p>
          </div>
        )}
      </div>

      <CreateClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
