import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'
import { formatStudentName } from '../../../utils/formatters'

interface StudentFormData {
    name: string
    classId?: string
    status?: Student['status']
}

interface StudentFormProps {
    initialData?: Student | null
    onSubmit: (data: StudentFormData) => void
    onCancel: () => void
}

export function StudentForm({ initialData, onSubmit, onCancel }: StudentFormProps) {
    const { classes } = useClassStore()
    const [name, setName] = useState(initialData?.name ?? '')
    const [classId, setClassId] = useState(initialData?.classId ?? '')
    const [status, setStatus] = useState<Student['status']>(initialData?.status ?? 'active')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onSubmit({
                name: formatStudentName(name.trim()),
                classId: classId || undefined,
                status
            })
        }
    }

    const handleBlur = () => {
        if (name.trim()) {
            setName(formatStudentName(name.trim()))
        }
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {initialData ? 'Editar Estudante' : 'Novo Estudante'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleBlur}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                            placeholder="Ex: Ana da Silva"
                            autoFocus
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            O nome será formatado automaticamente.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Turma
                        </label>
                        <select
                            value={classId}
                            onChange={(e) => setClassId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                        >
                            <option value="">Selecione uma turma...</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} ({cls.shift})
                                </option>
                            ))}
                        </select>
                        {classes.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                Nenhuma turma cadastrada. Crie turmas em "Disciplinas" ou "Configurações".
                            </p>
                        )}
                    </div>

                    {initialData && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={status === 'active'}
                                        onChange={() => setStatus('active')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Ativo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={status === 'inactive'}
                                        onChange={() => setStatus('inactive')}
                                        className="text-gray-600 focus:ring-gray-500"
                                    />
                                    <span className="text-sm text-gray-700">Arquivado</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="transferred"
                                        checked={status === 'transferred'}
                                        onChange={() => setStatus('transferred')}
                                        className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">Transferido</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                        >
                            {initialData ? 'Salvar Alterações' : 'Adicionar Estudante'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
