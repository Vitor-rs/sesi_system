import { useState, useMemo } from 'react'
import { Search, Filter, Archive, UserX, UserCheck, Trash2, Pencil } from 'lucide-react'
import { useStudentStore, type Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'

interface StudentsDashboardProps {
    onEdit: (student: Student) => void
}

export function StudentsDashboard({ onEdit }: StudentsDashboardProps) {
    const { students, removeStudent, toggleStatus } = useStudentStore()
    const { classes } = useClassStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedClassId, setSelectedClassId] = useState<string>('all')
    const [showArchived, setShowArchived] = useState(false)

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesClass = selectedClassId === 'all' || student.classId === selectedClassId

            // Status filter logic
            const isArchivedOrTransferred = student.status === 'inactive' || student.status === 'transferred'
            const matchesStatus = showArchived ? true : !isArchivedOrTransferred

            return matchesSearch && matchesClass && matchesStatus
        })
    }, [students, searchTerm, selectedClassId, showArchived])

    const getClassName = (classId?: string) => {
        if (!classId) return 'Sem Turma'
        const cls = classes.find(c => c.id === classId)
        return cls ? cls.name : 'Turma Desconhecida'
    }

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Ativo</span>
            case 'inactive':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Arquivado</span>
            case 'transferred':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Transferido</span>
        }
    }

    // Statistics
    const totalActive = students.filter(s => s.status === 'active').length
    const totalArchived = students.filter(s => s.status === 'inactive').length
    const totalTransferred = students.filter(s => s.status === 'transferred').length

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Estudantes Ativos</p>
                        <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-full text-green-600">
                        <UserCheck size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Arquivados</p>
                        <p className="text-2xl font-bold text-gray-900">{totalArchived}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-full text-gray-600">
                        <Archive size={24} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Transferidos</p>
                        <p className="text-2xl font-bold text-gray-900">{totalTransferred}</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded-full text-red-600">
                        <UserX size={24} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar estudante..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white min-w-[150px]"
                    >
                        <option value="all">Todas as Turmas</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${showArchived
                                ? 'bg-gray-100 text-gray-700 border-gray-300'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <Filter size={16} />
                        {showArchived ? 'Ocultar Arquivados' : 'Mostrar Arquivados'}
                    </button>
                </div>
            </div>

            {/* Student List Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredStudents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Nenhum estudante encontrado com os filtros atuais.
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 w-16">Nº</th>
                                    <th className="px-6 py-4">Nome</th>
                                    <th className="px-6 py-4">Turma</th>
                                    <th className="px-6 py-4 w-32">Status</th>
                                    <th className="px-6 py-4 w-32 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map((student, index) => (
                                    <tr
                                        key={student.id}
                                        className={`hover:bg-gray-50/50 transition-colors ${student.status !== 'active' ? 'opacity-60 bg-gray-50/30' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {getClassName(student.classId)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(student.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(student)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <div className="h-4 w-px bg-gray-200 my-auto mx-1"></div>

                                            {/* Quick Actions based on status */}
                                            {student.status === 'active' ? (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Arquivar ${student.name}? Ele não aparecerá nas listas principais.`)) {
                                                            toggleStatus(student.id, 'inactive')
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                                    title="Arquivar"
                                                >
                                                    <Archive size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleStatus(student.id, 'active')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                    title="Reativar"
                                                >
                                                    <UserCheck size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Tem certeza que deseja EXCLUIR DEFINITIVAMENTE ${student.name}? Essa ação não pode ser desfeita.`)) {
                                                        removeStudent(student.id)
                                                    }
                                                }}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Excluir Definitivamente"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
