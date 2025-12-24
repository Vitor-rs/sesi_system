import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Trash2, User } from 'lucide-react'
import { PageLayout } from '../../../components/layouts/PageLayout'
import { useClassesStore } from '../../classes/stores/useClassesStore'
import { useClassDisciplinesStore } from '../stores/useClassDisciplinesStore'
import { AddDisciplineToClassModal } from '../components/AddDisciplineToClassModal'

export function ClassDetailsPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { classes, fetchClasses } = useClassesStore()
  const {
    classDisciplines,
    fetchClassDisciplines,
    deleteClassDiscipline
  } = useClassDisciplinesStore()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const currentClass = classes.find((c) => c.id === id)

  useEffect(() => {
    if (!classes.length) fetchClasses()
    if (id) fetchClassDisciplines(id)
  }, [id, classes.length, fetchClasses, fetchClassDisciplines])

  const handleDelete = async (disciplineId: string): Promise<void> => {
    if (!id) return
    if (
      confirm('Tem certeza? Isso removerá o acesso ao diário desta disciplina para esta turma.')
    ) {
      await deleteClassDiscipline(disciplineId, id)
    }
  }

  if (!currentClass) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Carregando turma...</p>
      </div>
    )
  }

  return (
    <PageLayout
      title={`Turma ${currentClass.name}`}
      icon={BookOpen}
      description={`Visualizar e gerenciar as disciplinas da turma ${currentClass.name} - ${currentClass.grade}`}
      backButton
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Disciplinas da Turma</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Adicionar Disciplina
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classDisciplines.map((cd) => (
              <button
                key={cd.id}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative text-left w-full"
                onClick={() => navigate(`/classes/${id}/disciplines/${cd.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(cd.id)
                    }}
                    className="p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cd.discipline.name}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <User size={14} />
                  <span>{cd.teacherName || 'Sem professor definido'}</span>
                </div>
              </button>
            ))}

            {classDisciplines.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500">Nenhuma disciplina vinculada a esta turma.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 font-medium hover:underline mt-2"
                >
                  Adicionar agora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {id && (
        <AddDisciplineToClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classId={id}
        />
      )}
    </PageLayout>
  )
}
