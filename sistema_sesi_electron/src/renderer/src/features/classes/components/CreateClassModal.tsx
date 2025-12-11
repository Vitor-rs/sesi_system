import { useState, useRef, useEffect } from 'react'
import { X, School, Loader2 } from 'lucide-react'
import { FloatingLabelInput } from '../../../components/ui/FloatingLabelInput'
import { useClassStore } from '@/stores/useClassStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useDisciplinesStore } from '@/features/disciplines/stores/useDisciplinesStore'
import { useClassDisciplinesStore } from '@/features/class-management/stores/useClassDisciplinesStore'
import { Discipline } from '../../../../../shared/types'

interface CreateClassModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

const DEFAULT_DISCIPLINES = [
  'Língua Portuguesa',
  'Matemática',
  'História',
  'Geografia',
  'Ciências',
  'Arte',
  'Ensino Religioso'
]

export function CreateClassModal({
  isOpen,
  onClose
}: CreateClassModalProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [grade, setGrade] = useState('')
  const [letter, setLetter] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const { addClass } = useClassStore()
  const { teacherProfile } = useSettingsStore()
  const { disciplines, fetchDisciplines } = useDisciplinesStore()
  const { addClassDiscipline } = useClassDisciplinesStore()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleBackdrop = (e: MouseEvent): void => {
      // standard backdrop click check for <dialog>
      if (e.target === dialog && !isProcessing) {
        onClose()
      }
    }

    const handleCancel = (e: Event): void => {
      e.preventDefault()
      if (!isProcessing) onClose()
    }

    if (isOpen) {
      if (!dialog.open) dialog.showModal()
      fetchDisciplines()

      dialog.addEventListener('click', handleBackdrop)
      dialog.addEventListener('cancel', handleCancel)
    } else {
      dialog.close()
    }

    return () => {
      dialog.removeEventListener('click', handleBackdrop)
      dialog.removeEventListener('cancel', handleCancel)
      // We don't necessarily close here because the Effect cleanup might run on re-render while open
      // but the `else` block handles the logic when `isOpen` becomes false.
      if (dialog.open && !isOpen) dialog.close()
    }
  }, [isOpen, fetchDisciplines, isProcessing, onClose])

  // Helper function to handle auto-assignment logic
  const autoAssignDisciplines = async (classId: string): Promise<void> => {
    setStatusMessage('Configurando disciplinas padrão...')

    // Create promises array for parallel execution where possible
    const assignments: Promise<void>[] = []

    for (const disciplineName of DEFAULT_DISCIPLINES) {
      const discipline: Discipline | undefined = disciplines.find(
        (d) => d.name.toLowerCase() === disciplineName.toLowerCase()
      )

      if (discipline) {
        assignments.push(
          addClassDiscipline({
            classId: classId,
            disciplineId: discipline.id
          }).catch((err) => {
            console.warn(`Failed to auto-assign ${disciplineName}`, err)
          })
        )
      }
    }

    await Promise.all(assignments)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsProcessing(true)
    setStatusMessage('Criando turma...')

    try {
      const newClassId = await addClass({
        grade,
        letter: letter.toUpperCase()
      })

      if (teacherProfile === 'pedagogue') {
        await autoAssignDisciplines(newClassId)
      }

      setStatusMessage(null)
      onClose()
      setGrade('')
      setLetter('')
    } catch (error) {
      console.error(error)
      setStatusMessage('Erro ao criar turma.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-0 open:animate-fade-in outline-none"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden ring-1 ring-black/5">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-sesi-blue">
            <School className="w-5 h-5" />
            <h2 className="font-semibold text-gray-900">Nova Turma</h2>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FloatingLabelInput
                label="Série/Ano"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                disabled={isProcessing}
                helperText='Ex: "4", "5", "Maternal"'
              />

              <FloatingLabelInput
                label="Turma/Letra"
                value={letter}
                onChange={(e) => setLetter(e.target.value.toUpperCase())}
                required
                maxLength={2}
                disabled={isProcessing}
                helperText='Ex: "A", "B"'
              />
            </div>

            {teacherProfile === 'pedagogue' && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                <strong>Modo Pedagogo:</strong> As disciplinas padrão (Português, Matemática, etc.)
                serão adicionadas automaticamente a esta turma se já estiverem cadastradas no
                sistema.
              </div>
            )}

            {statusMessage && (
              <div className="flex items-center gap-2 justify-center text-sm text-gray-500 animate-pulse">
                <Loader2 className="size-4 animate-spin" />
                {statusMessage}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-sesi-blue rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? 'Processando...' : 'Criar Turma'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
