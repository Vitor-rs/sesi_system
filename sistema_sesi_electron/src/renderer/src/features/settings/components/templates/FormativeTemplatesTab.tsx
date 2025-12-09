import { useEffect, useState } from 'react'
import { Plus, Trash2, Library, BookOpen } from 'lucide-react'
import { useFormativeTemplatesStore } from '../../stores/useFormativeTemplatesStore'
import { CreateFormativeTemplateModal } from './CreateFormativeTemplateModal'

export function FormativeTemplatesTab(): React.ReactElement {
  const { templates, fetchTemplates, deleteTemplate, isLoading } = useFormativeTemplatesStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleDelete = async (id: string): Promise<void> => {
    if (confirm('Tem certeza que deseja excluir este modelo de avaliação?')) {
      await deleteTemplate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Modelos de Avaliação Formativa</h2>
          <p className="text-sm text-gray-500">
            Configure os tipos de avaliação que podem ser usados nas disciplinas.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Novo Modelo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${template.isGeneric ? 'bg-purple-50' : 'bg-orange-50'}`}
              >
                {template.isGeneric ? (
                  <Library
                    className={`h-5 w-5 ${template.isGeneric ? 'text-purple-600' : 'text-orange-600'}`}
                  />
                ) : (
                  <BookOpen className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {template.type === 'simple' ? 'Simples (Nota Direta)' : 'Composta (Tarefas)'}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    Max: {template.defaultMaxPoints} pts
                  </span>
                  {!template.isGeneric && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      Exclusiva
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(template.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir modelo"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {templates.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            <p className="text-gray-500">Nenhum modelo cadastrado.</p>
          </div>
        )}
      </div>

      <CreateFormativeTemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
