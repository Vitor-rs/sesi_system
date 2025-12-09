import { useState, useRef, useEffect } from 'react'
import { X, BookOpen } from 'lucide-react'
import { FloatingLabelInput } from '../../../components/ui/FloatingLabelInput'
import { useDisciplinesStore } from '../stores/useDisciplinesStore'

interface CreateDisciplineModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function CreateDisciplineModal({
  isOpen,
  onClose
}: CreateDisciplineModalProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const { addDiscipline, isLoading } = useDisciplinesStore()

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
      await addDiscipline({
        name
      })
      onClose()
      setName('')
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

      <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100 mx-auto z-10">
        <div className="bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nova Disciplina</h3>
                <p className="text-sm text-gray-500">Cadastre uma nova matéria.</p>
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
            <FloatingLabelInput
              label="Nome da Disciplina (ex: Matemática)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando...' : 'Criar Disciplina'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
