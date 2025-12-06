import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { Student } from '../../../stores/useStudentStore'
import { formatStudentName } from '../../../utils/formatters'

interface StudentFormProps {
    initialData?: Student | null
    onSubmit: (name: string) => void
    onCancel: () => void
}

export function StudentForm({ initialData, onSubmit, onCancel }: StudentFormProps) {
    const [name, setName] = useState(initialData?.name ?? '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onSubmit(formatStudentName(name.trim()))
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
                            O nome será formatado automaticamente (Ex: ana da silva {'>'} Ana da Silva).
                        </p>
                    </div>

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
