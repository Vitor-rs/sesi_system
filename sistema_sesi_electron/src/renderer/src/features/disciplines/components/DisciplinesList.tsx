import { useEffect, useState } from 'react'
import { Plus, Trash2, BookOpen } from 'lucide-react'
import { useDisciplinesStore } from '../stores/useDisciplinesStore'
import { CreateDisciplineModal } from './CreateDisciplineModal'

export function DisciplinesList(): React.ReactElement {
  const { disciplines, fetchDisciplines, deleteDiscipline, isLoading } = useDisciplinesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchDisciplines()
  }, [fetchDisciplines])

  const handleDelete = async (id: string): Promise<void> => {
    if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
      await deleteDiscipline(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Disciplinas Cadastradas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Nova Disciplina
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplines.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => handleDelete(d.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{d.name}</h3>
              </div>
            </div>
          </div>
        ))}
        {disciplines.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            <p className="text-gray-500">Nenhuma disciplina cadastrada.</p>
          </div>
        )}
      </div>

      <CreateDisciplineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
