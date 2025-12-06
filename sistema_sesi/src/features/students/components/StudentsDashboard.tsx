import { useState } from 'react'
import { Plus, Search, Archive, UserX, AlertCircle, RefreshCw, Filter, Users, GraduationCap, Clock, X } from 'lucide-react'
import { useStudentStore, type Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'
import { StudentForm } from './StudentForm'
import { ClassManager } from './ClassManager'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'
import { StudentHistory } from './StudentHistory'

export function StudentsDashboard() {
    const { students, removeStudent, toggleStatus } = useStudentStore()
    const { classes } = useClassStore()

    // Dashboard State
    const [activeTab, setActiveTab] = useState<'students' | 'classes'>('students')

    // Students List State
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedClassId, setSelectedClassId] = useState<string>('all')
    const [showArchived, setShowArchived] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState<Student | null>(null)
    const [viewingHistoryStudent, setViewingHistoryStudent] = useState<Student | null>(null)

    // Modal State
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        variant: 'danger' | 'warning';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        variant: 'warning',
        onConfirm: () => { }
    })

    // Derived State
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.number && student.number.toString().includes(searchTerm))
        const matchesClass = selectedClassId === 'all' || student.classId === selectedClassId

        // Status Filtering Logic
        const matchesStatus = showArchived ? true : student.status === 'active'

        return matchesSearch && matchesClass && matchesStatus
    })

    const activeCount = students.filter(s => s.status === 'active').length
    const archivedCount = students.filter(s => s.status === 'inactive').length
    const transferredCount = students.filter(s => s.status === 'transferred').length

    // Handlers
    const handleAddStudent = () => {
        setEditingStudent(null)
        setIsFormOpen(true)
    }

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student)
        setIsFormOpen(true)
    }

    const handleViewHistory = (student: Student) => {
        setViewingHistoryStudent(student)
        setIsHistoryOpen(true)
    }

    const handleDeleteStudent = (id: string, name: string) => {
        setConfirmModalState({
            isOpen: true,
            title: 'Excluir Estudante',
            description: `Tem certeza que deseja excluir definitivamente o estudante "${name}"? Essa ação não pode ser desfeita e apagará todas as notas e histórico.`,
            variant: 'danger',
            onConfirm: () => {
                removeStudent(id)
                setConfirmModalState(prev => ({ ...prev, isOpen: false }))
            }
        })
    }

    const handleArchiveStudent = (id: string, name: string) => {
        setConfirmModalState({
            isOpen: true,
            title: 'Arquivar Estudante',
            description: `Deseja arquivar o estudante "${name}"? Ele ficará oculto da lista principal, mas o histórico será preservado.`,
            variant: 'warning',
            onConfirm: () => {
                toggleStatus(id, 'inactive', 'Arquivado pelo painel principal')
                setConfirmModalState(prev => ({ ...prev, isOpen: false }))
            }
        })
    }

    const handleReactivateStudent = (id: string) => {
        toggleStatus(id, 'active', 'Reativado pelo painel principal')
    }

    const handleFormSubmit = (data: { name: string, classId?: string, status?: Student['status'] }) => {
        const { addStudent, updateStudent } = useStudentStore.getState()

        if (editingStudent) {
            updateStudent(editingStudent.id, data)
        } else {
            addStudent(data.name, data.classId)
        }
        setIsFormOpen(false)
    }

    return (
        <div className="space-y-6">
            {/* Tabs Header */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'students'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users size={16} />
                    <span>Estudantes</span>
                </button>
                <button
                    onClick={() => setActiveTab('classes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'classes'
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
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar estudante..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400" />
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="all">Todas as Turmas</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                            >
                                <Plus size={18} />
                                <span>Novo Estudante</span>
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {filteredStudents.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Turma</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.map((student, index) => {
                                        const studentClass = classes.find(c => c.id === student.classId)
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                                                    {student.number || index + 1}
                                                </td>
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
                                                <td className="px-6 py-4 text-right space-x-2">
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
                                                        <button
                                                            onClick={() => handleDeleteStudent(student.id, student.name)}
                                                            className="text-red-400 hover:text-red-600 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Excluir permanentemente"
                                                        >
                                                            Excluir
                                                        </button>
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
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum estudante encontrado</h3>
                                <p className="text-gray-500 text-sm">
                                    {searchTerm ? 'Tente buscar com outro termo.' : 'Comece adicionando novos estudantes à lista.'}
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
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Histórico do Estudante
                                </h3>
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
                variant={confirmModalState.variant}
                onConfirm={confirmModalState.onConfirm}
                onCancel={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    )
}
