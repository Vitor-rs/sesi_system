import { useState, useEffect } from 'react'
import { Users, GraduationCap, X } from 'lucide-react'
import { useStudentStore, type Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'
import { StudentForm, type StudentFormData } from './StudentForm'
import { ClassManager } from './ClassManager'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'
import { StudentHistory } from './StudentHistory'

// Sub-components
import { StudentsStats } from './StudentsStats'
import { StudentsToolbar } from './StudentsToolbar'
import { StudentsTable } from './StudentsTable'

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
        student.number?.toString().includes(searchTerm)
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
      description: `Deseja arquivar o estudante "${name}"? Ele não aparecerá na lista de ativos, mas o histórico será preservado.`,
      confirmLabel: 'Arquivar',
      variant: 'warning',
      onConfirm: () => {
        toggleStatus(id, 'inactive')
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }))
      }
    })
  }

  const handleReactivateStudent = (id: string): void => {
    toggleStatus(id, 'active')
  }

  const handleFormSubmit = async (data: StudentFormData): Promise<void> => {
    const { addStudent, updateStudent } = useStudentStore.getState()

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          name: data.name,
          classId: data.classId
        })
      } else {
        await addStudent({
          name: data.name,
          classId: data.classId,
          enrollmentType: data.enrollmentType,
          transferDate: data.transferDate,
          transferOrigin: data.transferOrigin,
          transferCity: data.transferCity,
          transferState: data.transferState,
          transferObservation: data.transferObservation
        })
      }
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to save student:', error)
      alert('Erro ao salvar estudante. Verifique os dados e tente novamente.')
    }
  }

  // Delete Request Handler (from Table)
  const handleDeleteRequest = (student: Student): void => {
    const hasDependencies = student.history && student.history.length > 1
    if (hasDependencies) {
      alert('Este aluno possui histórico e não pode ser excluído.')
    } else {
      handleDeleteStudent(student.id, student.name)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50/50 p-6">
      {/* Tabs */}
      <div className="mb-6">
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
      </div>

      {/* TAB CONTENT: STUDENTS */}
      {activeTab === 'students' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Stats Cards */}
          <StudentsStats
            activeCount={activeCount}
            archivedCount={archivedCount}
            transferredCount={transferredCount}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Toolbar */}
            <StudentsToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedClassId={selectedClassId}
              setSelectedClassId={setSelectedClassId}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showArchived={showArchived}
              setShowArchived={setShowArchived}
              classes={classes}
              onAddStudent={handleAddStudent}
            />

            {/* Scrollable List */}
            <StudentsTable
              students={filteredStudents}
              classes={classes}
              sortBy={sortBy}
              showArchived={showArchived}
              onViewHistory={handleViewHistory}
              onEdit={handleEditStudent}
              onArchive={handleArchiveStudent}
              onReactivate={handleReactivateStudent}
              onDeleteRequest={handleDeleteRequest}
            />
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
