import { useState, useRef, useEffect } from 'react'
import { X, Library } from 'lucide-react'
import { FloatingLabelInput } from '../../../../components/ui/FloatingLabelInput'
import { useFormativeTemplatesStore } from '../../stores/useFormativeTemplatesStore'
import { useDisciplinesStore } from '../../../disciplines/stores/useDisciplinesStore'

interface CreateFormativeTemplateModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function CreateFormativeTemplateModal({
  isOpen,
  onClose
}: CreateFormativeTemplateModalProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Form State
  const [name, setName] = useState('')
  const [type, setType] = useState<'simple' | 'composite'>('simple')
  const [defaultMaxPoints, setDefaultMaxPoints] = useState('2.0')
  const [isGeneric, setIsGeneric] = useState(true)
  const [disciplineId, setDisciplineId] = useState('')

  const { createTemplate, isLoading } = useFormativeTemplatesStore()
  const { disciplines, fetchDisciplines } = useDisciplinesStore()

  useEffect(() => {
    fetchDisciplines()
  }, [fetchDisciplines])

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      await createTemplate({
        name,
        type,
        defaultMaxPoints: Number.parseFloat(defaultMaxPoints),
        isGeneric,
        disciplineId: isGeneric ? null : disciplineId || null
      })
      onClose()
      // Reset form
      setName('')
      setType('simple')
      setDefaultMaxPoints('2.0')
      setIsGeneric(true)
      setDisciplineId('')
    } catch (error) {
      console.error(error)
    }
  }

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-transparent border-none m-0 w-full h-full max-w-none max-h-none backdrop:bg-transparent"
      onClose={onClose}
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity w-full h-full border-none cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100 mx-auto z-10 w-full">
        <div className="bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Library className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Novo Modelo de Avaliação</h3>
                <p className="text-sm text-gray-500">Crie um template reutilizável.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-md hover:bg-gray-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="template-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome do Modelo
              </label>
              <FloatingLabelInput
                id="template-name"
                label="Nome do Modelo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="template-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de Avaliação
              </label>
              <select
                id="template-type"
                value={type}
                onChange={(e) => setType(e.target.value as 'simple' | 'composite')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                <option value="simple">Simples (Nota Direta)</option>
                <option value="composite">Composta (Tarefas/Ativ.)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="max-points"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pontuação Padrão
                </label>
                <FloatingLabelInput
                  id="max-points"
                  label="Pontos"
                  type="number"
                  value={defaultMaxPoints}
                  onChange={(e) => setDefaultMaxPoints(e.target.value)}
                  step="0.1"
                  min="0"
                  max="10"
                  required
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGeneric}
                    onChange={(e) => setIsGeneric(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Modelo Genérico</span>
                </label>
              </div>
            </div>

            {!isGeneric && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label
                  htmlFor="discipline-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Disciplina (Opcional)
                </label>
                <select
                  id="discipline-select"
                  value={disciplineId}
                  onChange={(e) => setDisciplineId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Todas as disciplinas</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando...' : 'Criar Modelo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
