import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Archive,
  UserX,
  AlertCircle,
  RefreshCw,
  Users,
  GraduationCap,
  Clock,
  X,
  Trash2,
  ArrowUpDown
} from 'lucide-react'
import { useStudentStore, type Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'
import { StudentForm, type StudentFormData } from './StudentForm'
import { ClassManager } from './ClassManager'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'
import { StudentHistory } from './StudentHistory'

export function StudentsDashboard(): React.ReactElement {
  const { students, removeStudent, toggleStatus, fetchStudents } = useStudentStore()
  const { classes, fetchClasses } = useClassStore()

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [fetchStudents, fetchClasses])

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'students' | 'classes'>('students')

  // Students List State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'alphabetical' | 'admission'>('alphabetical')
  const [showArchived, setShowArchived] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingHistoryStudent, setViewingHistoryStudent] = useState<Student | null>(null)

  // Modal State
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean
    title: string
    description: string
    confirmLabel?: string
    variant: 'danger' | 'warning'
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'warning',
    onConfirm: () => {}
  })

  // Derived State
  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.number && student.number.toString().includes(searchTerm))
      const matchesClass = selectedClassId === 'all' || student.classId === selectedClassId
      const matchesStatus = showArchived
        ? student.status === 'inactive' || student.status === 'transferred'
        : student.status === 'active'

      return matchesSearch && matchesClass && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'admission') {
        // Sort by createdAt (Admission Date) - Oldest first
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
      }
      // Default: Alphabetical
      return a.name.localeCompare(b.name)
    })

  const activeCount = students.filter((s) => s.status === 'active').length
  const archivedCount = students.filter((s) => s.status === 'inactive').length
  const transferredCount = students.filter((s) => s.status === 'transferred').length

  // Handlers
  const handleAddStudent = (): void => {
    setEditingStudent(null)
    setIsFormOpen(true)
  }

  const handleEditStudent = (student: Student): void => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  const handleViewHistory = async (student: Student): Promise<void> => {
    setViewingHistoryStudent(student)
    setIsHistoryOpen(true)

    if (!student.history) {
      const { fetchStudentDetails } = useStudentStore.getState()
      await fetchStudentDetails(student.id)
      const updatedStudent = useStudentStore.getState().students.find((s) => s.id === student.id)
      if (updatedStudent) {
        setViewingHistoryStudent(updatedStudent)
      }
    }
  }

  const handleDeleteStudent = (id: string, name: string): void => {
    setConfirmModalState({
      isOpen: true,
      title: 'Excluir Estudante',
      description: `Tem certeza que deseja excluir definitivamente o estudante "${name}"? Essa ação não pode ser desfeita e apagará todo o histórico.`,
      confirmLabel: 'Excluir Definitivamente',
      variant: 'danger',
      onConfirm: () => {
        removeStudent(id)
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleArchiveStudent = (id: string, name: string): void => {
    setConfirmModalState({
      isOpen: true,
      title: 'Arquivar Estudante',
      description: `Deseja arquivar o estudante "${name}"? Ele ficará oculto da lista principal, mas o histórico será preservado.`,
      confirmLabel: 'Arquivar',
      variant: 'warning',
      onConfirm: () => {
        toggleStatus(id, 'inactive', 'Arquivado pelo painel principal')
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleReactivateStudent = (id: string): void => {
    toggleStatus(id, 'active', 'Reativado pelo painel principal')
  }

  const handleFormSubmit = (data: StudentFormData): void => {
    const { addStudent, updateStudent } = useStudentStore.getState()

    if (editingStudent) {
      updateStudent(editingStudent.id, data)
    } else {
      addStudent(data)
    }
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'students'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} />
          <span>Estudantes</span>
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'classes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <GraduationCap size={16} />
          <span>Turmas</span>
        </button>
      </div>

      {/* TAB CONTENT: STUDENTS */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Estudantes Ativos</p>
                <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Users size={24} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Arquivados</p>
                <p className="text-2xl font-bold text-gray-800">{archivedCount}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Archive size={24} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Transferidos</p>
                <p className="text-2xl font-bold text-gray-800">{transferredCount}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg text-red-500">
                <UserX size={24} />
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar estudante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Filtros Container */}
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <ArrowUpDown size={16} className="text-gray-400" />
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">
                      FILTROS
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'admission')}
                      className="text-sm text-gray-700 font-medium bg-transparent border-none focus:ring-0 p-0 cursor-pointer w-32"
                    >
                      <option value="alphabetical">Ordem Alfabética</option>
                      <option value="admission">Data de Admissão</option>
                    </select>
                  </div>
                </div>
              </div>

              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 bg-white h-[42px]"
              >
                <option value="all">Todas as Turmas</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Mostrar Arquivados</span>
              </label>

              <button
                onClick={handleAddStudent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium whitespace-nowrap"
                title="Novo Estudante"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Estudante</span>
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {filteredStudents.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100/80 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Turma
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right w-48">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map((student, index) => {
                    const studentClass = classes.find((c) => c.id === student.classId)
                    const hasDependencies = student.history && student.history.length > 1

                    // Index Display Logic
                    const displayIndex =
                      sortBy === 'admission' ? (
                        <span className="font-mono text-gray-500">{index + 1}º</span>
                      ) : (
                        <span className="font-mono text-gray-400">{index + 1}</span>
                      )

                    return (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 text-sm">{displayIndex}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          {studentClass ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {studentClass.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm italic">Sem turma</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {student.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Ativo
                            </span>
                          )}
                          {student.status === 'inactive' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              Arquivado
                            </span>
                          )}
                          {student.status === 'transferred' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                              Transferido
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewHistory(student)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                            title="Ver Histórico"
                          >
                            <Clock size={16} />
                          </button>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            Editar
                          </button>

                          {student.status === 'active' ? (
                            <button
                              onClick={() => handleArchiveStudent(student.id, student.name)}
                              className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                              title="Arquivar estudante"
                            >
                              Arquivar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivateStudent(student.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors inline-flex items-center gap-1"
                              title="Reativar estudante"
                            >
                              <RefreshCw size={14} /> Reativar
                            </button>
                          )}

                          {showArchived && (
                            <div className="relative group/delete">
                              <button
                                onClick={() => {
                                  if (hasDependencies) {
                                    alert(
                                      'Este aluno possui histórico/notas e não pode ser excluído diretamente.'
                                    )
                                  } else {
                                    handleDeleteStudent(student.id, student.name)
                                  }
                                }}
                                disabled={hasDependencies}
                                className={`p-1.5 rounded transition-colors ${
                                  hasDependencies
                                    ? 'text-yellow-400 cursor-not-allowed opacity-100' // Always visible if warning
                                    : 'text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100' // Ghost if simple delete
                                }`}
                                title={
                                  hasDependencies
                                    ? 'Não pode ser excluído (Possui histórico)'
                                    : 'Excluir permanentemente'
                                }
                              >
                                {hasDependencies ? <AlertCircle size={16} /> : <Trash2 size={16} />}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <AlertCircle className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Nenhum estudante encontrado
                </h3>
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? 'Tente buscar com outro termo.'
                    : 'Comece adicionando novos estudantes à lista.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CLASSES */}
      {activeTab === 'classes' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ClassManager />
        </div>
      )}

      {/* Modals */}
      {isFormOpen && (
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isHistoryOpen && viewingHistoryStudent && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-100 animate-in fade-in zoom-in-95 h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Histórico do Estudante</h3>
                <p className="text-sm text-gray-500">{viewingHistoryStudent.name}</p>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 relative">
              <StudentHistory events={viewingHistoryStudent.history || []} />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        description={confirmModalState.description}
        confirmLabel={confirmModalState.confirmLabel}
        variant={confirmModalState.variant}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
