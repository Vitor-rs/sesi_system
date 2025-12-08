import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, School, TrendingUp, Calendar } from 'lucide-react'
import { useClassStore, type Class } from '../../../stores/useClassStore'
import { useStudentStore } from '../../../stores/useStudentStore'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'

export function ClassManager(): React.ReactElement {
  const { classes, addClass, updateClass, removeClass } = useClassStore()
  const { students } = useStudentStore()

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Selection States
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [classToDelete, setClassToDelete] = useState<Class | null>(null)
  const [viewingHistoryClass, setViewingHistoryClass] = useState<Class | null>(null)

  const [formData, setFormData] = useState({
    grade: '',
    letter: '',
    period: 'Matutino' as Class['period']
  })

  // derived state for history modal
  const historyYear = 2024 // Mock year for the requested feature

  const handleOpenForm = (cls?: Class): void => {
    if (cls) {
      setEditingClass(cls)
      setFormData({
        grade: cls.grade,
        letter: cls.letter,
        period: cls.period
      })
    } else {
      setEditingClass(null)
      setFormData({
        grade: '',
        letter: '',
        period: 'Matutino'
      })
    }
    setIsFormOpen(true)
  }

  const handleGradeBlur = (): void => {
    // Auto-format "4" -> "4º Ano"
    // Regex to check if it's just a number
    const numberMatch = formData.grade.match(/^(\d+)$/)
    if (numberMatch) {
      setFormData((prev) => ({ ...prev, grade: `${numberMatch[1]}º Ano` }))
    }
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    // Uniqueness Check
    const isDuplicate = classes.some(
      (c) =>
        c.grade === formData.grade &&
        c.letter === formData.letter &&
        c.period === formData.period &&
        c.id !== editingClass?.id
    )

    if (isDuplicate) {
      alert(`A turma ${formData.grade} ${formData.letter} (${formData.period}) já existe!`)
      return
    }

    if (editingClass) {
      updateClass(editingClass.id, formData)
    } else {
      addClass(formData)
    }
    setIsFormOpen(false)
  }

  const handleDeleteClick = (cls: Class): void => {
    // Referral Integrity Check
    const linkedStudents = students.filter((s) => s.classId === cls.id && s.status === 'active')

    if (linkedStudents.length > 0) {
      alert(
        `Não é possível excluir a turma "${cls.name}".\n\nExistem ${linkedStudents.length} estudantes ativos vinculados a ela.\nRemova ou transfira os estudantes antes de excluir a turma.`
      )
      return
    }

    setClassToDelete(cls)
    setIsDeleteModalOpen(true)
  }

  const handleViewHistory = (cls: Class): void => {
    setViewingHistoryClass(cls)
    setIsHistoryModalOpen(true)
  }

  const confirmDelete = (): void => {
    if (classToDelete) {
      removeClass(classToDelete.id)
      setIsDeleteModalOpen(false)
      setClassToDelete(null)
    }
  }

  const periodColors = {
    Matutino: 'bg-yellow-100 text-yellow-800',
    Vespertino: 'bg-orange-100 text-orange-800',
    Noturno: 'bg-indigo-100 text-indigo-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Gerenciamento de Turmas</h2>
          <p className="text-sm text-gray-500">Cadastre e organize as turmas da escola.</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Turma
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <School className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma turma cadastrada</h3>
          <p className="text-gray-500 mt-2">
            Comece criando a primeira turma para vincular alunos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            // Deterministic mock data based on ID for lint compliance (no impure Math.random)
            const seed = cls.id.charCodeAt(0) + (cls.id.charCodeAt(cls.id.length - 1) || 0)
            const mockHistoryStudents = (seed % 10) + 20

            return (
              <div
                key={cls.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <School size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {cls.grade} {cls.letter}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${periodColors[cls.period]}`}
                      >
                        {cls.period}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenForm(cls)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cls)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewHistory(cls)}
                      className="group/tag flex items-center gap-1.5 px-2 py-1 bg-pink-50 text-pink-700 rounded text-xs hover:bg-pink-100 transition-colors border border-pink-100"
                      title="Ver detalhes de 2024"
                    >
                      <Calendar size={12} />
                      <span className="font-medium">2024</span>
                      <span className="w-px h-3 bg-pink-200 mx-1"></span>
                      <span className="text-pink-600">{mockHistoryStudents} alunos</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">
                {editingClass ? 'Editar Turma' : 'Nova Turma'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Série / Ano</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  onBlur={handleGradeBlur}
                />
                <p className="text-xs text-gray-500 mt-1">
                  O sistema adicionará &quot;º Ano&quot; automaticamente.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Letra</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase text-gray-900"
                    maxLength={3}
                    value={formData.letter}
                    onChange={(e) =>
                      setFormData({ ...formData, letter: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value as Class['period'] })
                    }
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal (Mini Dashboard) */}
      {isHistoryModalOpen && viewingHistoryClass && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-pink-50 rounded-t-lg">
              <div>
                <h3 className="font-semibold text-pink-900">
                  Resumo da Turma: {viewingHistoryClass.grade} {viewingHistoryClass.letter}
                </h3>
                <p className="text-xs text-pink-700 font-medium opacity-80">
                  Ano Letivo {historyYear} • {viewingHistoryClass.period}
                </p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-pink-400 hover:text-pink-600 p-1 hover:bg-white/50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Média Geral da Turma</p>
                <div className="flex items-end justify-center gap-1 mt-1">
                  <span className="text-3xl font-bold text-gray-800">8.4</span>
                  <span className="text-sm text-green-500 font-medium mb-1 flex items-center">
                    <TrendingUp size={14} className="mr-0.5" /> +0.2
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Início</p>
                  <p className="text-xl font-semibold text-gray-800 mt-1">28</p>
                  <p className="text-[10px] text-gray-400">Estudantes</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Fim</p>
                  <p className="text-xl font-semibold text-gray-800 mt-1">26</p>
                  <p className="text-[10px] text-gray-400">Estudantes</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                  Professor Titular: [Nome do Professor]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Turma"
        description={`Tem certeza que deseja excluir a turma "${classToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir Turma"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
