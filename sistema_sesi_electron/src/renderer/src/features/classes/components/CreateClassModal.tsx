import { useState, useRef, useEffect } from 'react'
import { X, School } from 'lucide-react'
import { FloatingLabelInput } from '../../../components/ui/FloatingLabelInput'
import { useClassStore } from '@/stores/useClassStore'

interface CreateClassModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function CreateClassModal({
  isOpen,
  onClose
}: CreateClassModalProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [grade, setGrade] = useState('')
  const [letter, setLetter] = useState('')
  const { addClass, isLoading } = useClassStore()

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
      await addClass({
        grade,
        letter: letter.toUpperCase()
      })
      onClose()
      setGrade('')
      setLetter('')
    } catch (error) {
      console.error(error)
    }
  }

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>): void => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-0 open:animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-600">
            <School className="w-5 h-5" />
            <h2 className="font-semibold text-gray-900">Nova Turma</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FloatingLabelInput
                label="Série/Ano"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                helperText='Ex: "4", "5", "Maternal"'
              />

              <FloatingLabelInput
                label="Turma/Letra"
                value={letter}
                onChange={(e) => setLetter(e.target.value.toUpperCase())}
                required
                maxLength={2}
                helperText='Ex: "A", "B"'
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
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
              {isLoading ? 'Criando...' : 'Criar Turma'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
