import { useEffect, useRef, useState } from 'react'
import { X, BookOpen, User } from 'lucide-react'
import { useClassDisciplinesStore } from '../stores/useClassDisciplinesStore'
import { useDisciplinesStore } from '../../disciplines/stores/useDisciplinesStore'
import { FloatingLabelInput } from '../../../components/ui/FloatingLabelInput'

interface AddDisciplineToClassModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly classId: string
}

export function AddDisciplineToClassModal({
  isOpen,
  onClose,
  classId
}: AddDisciplineToClassModalProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const { classDisciplines, addClassDiscipline, isLoading } = useClassDisciplinesStore()
  const { disciplines, fetchDisciplines } = useDisciplinesStore()

  const [selectedDisciplineId, setSelectedDisciplineId] = useState('')
  const [teacherName, setTeacherName] = useState('')

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
      if (disciplines.length === 0) {
        fetchDisciplines()
      }
    } else {
      dialogRef.current?.close()
      // Reset form
      setSelectedDisciplineId('')
      setTeacherName('')
    }
  }, [isOpen, disciplines.length, fetchDisciplines])

  // Filter disciplines not yet added
  const availableDisciplines = disciplines.filter(
    (d) => !classDisciplines.some((cd) => cd.disciplineId === d.id)
  )

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!selectedDisciplineId) return

    try {
      await addClassDiscipline({
        classId,
        disciplineId: selectedDisciplineId,
        teacherName: teacherName || undefined
      })
      onClose()
    } catch (error) {
      console.error(error)
      alert('Erro ao adicionar disciplina.')
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
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Adicionar Disciplina</h3>
                <p className="text-sm text-gray-500">Vincular nova disciplina à turma.</p>
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
                htmlFor="discipline-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Disciplina
              </label>
              <select
                id="discipline-select"
                value={selectedDisciplineId}
                onChange={(e) => setSelectedDisciplineId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Selecione uma disciplina...</option>
                {availableDisciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {availableDisciplines.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Todas as disciplinas cadastradas já foram adicionadas.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="teacher-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Professor (Responsável)
              </label>
              <div className="relative">
                <FloatingLabelInput
                  id="teacher-name"
                  label="Nome do Professor"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  icon={<User size={18} />}
                />
              </div>
            </div>

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
                disabled={isLoading || !selectedDisciplineId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}
