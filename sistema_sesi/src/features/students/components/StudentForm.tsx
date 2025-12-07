import React, { useState } from 'react'
import { X, Check, AlertCircle, Calendar } from 'lucide-react'
import type { Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { formatStudentName } from '../../../utils/formatters'

export interface StudentFormData {
    name: string
    classId?: string
    status?: Student['status']
    enrollmentType?: 'regular' | 'transfer'
    transferDate?: string
    transferOrigin?: string
    transferCity?: string
    transferState?: string
    transferObservation?: string
}

interface StudentFormProps {
    initialData?: Student | null
    onSubmit: (data: StudentFormData) => void
    onCancel: () => void
}

export function StudentForm({ initialData, onSubmit, onCancel }: StudentFormProps) {
    const { classes } = useClassStore()
    const { schoolYearStart } = useSettingsStore()

    // Core State
    const [name, setName] = useState(initialData?.name ?? '')
    const [classId, setClassId] = useState(initialData?.classId ?? '')
    const [status, setStatus] = useState<Student['status']>(initialData?.status ?? 'active')

    // Enrollment Logic State - Initialized purely to avoid useEffect
    const [enrollmentType, setEnrollmentType] = useState<'regular' | 'transfer'>(() => {
        if (initialData?.enrollmentType) return initialData.enrollmentType
        if (initialData) return 'regular' // Fallback for edits without type

        // Auto-detection logic for new students
        const start = new Date(schoolYearStart)
        const today = new Date()
        const diffDays = Math.ceil(Math.abs(today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

        return (today > start && diffDays > 30) ? 'transfer' : 'regular'
    })

    // Transfer Fields
    const [transferDate, setTransferDate] = useState(initialData?.transferDate ?? new Date().toISOString().split('T')[0])
    const [transferOrigin, setTransferOrigin] = useState(initialData?.transferOrigin ?? '')
    const [transferCity, setTransferCity] = useState(initialData?.transferCity ?? '')
    const [transferState, setTransferState] = useState(initialData?.transferState ?? '')
    const [transferObservation, setTransferObservation] = useState(initialData?.transferObservation ?? '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onSubmit({
                name: formatStudentName(name.trim()),
                classId: classId || undefined,
                status,
                enrollmentType,
                transferDate: enrollmentType === 'transfer' ? transferDate : undefined,
                transferOrigin: enrollmentType === 'transfer' ? transferOrigin : undefined,
                transferCity: enrollmentType === 'transfer' && transferOrigin !== 'Outros' ? transferCity : undefined,
                transferState: enrollmentType === 'transfer' && transferOrigin !== 'Outros' ? transferState : undefined,
                transferObservation: enrollmentType === 'transfer' && transferOrigin === 'Outros' ? transferObservation : undefined
            })
        }
    }

    const handleBlur = () => {
        if (name.trim()) {
            setName(formatStudentName(name.trim()))
        }
    }

    const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase().slice(0, 2).replace(/[^A-Z]/g, '')
        setTransferState(val)
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
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

                <div className="overflow-y-auto p-4 space-y-6 flex-1">
                    <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Basic Info */}
                        <div className="space-y-4">
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
                                    Turma <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white invalid:border-red-300 invalid:text-red-600"
                                    required
                                >
                                    <option value="">Selecione uma turma...</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} ({cls.period})
                                        </option>
                                    ))}
                                </select>
                                {classes.length === 0 ? (
                                    <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        É necessário criar uma turma antes de cadastrar estudantes.
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">
                                        O estudante deve ser vinculado a uma turma.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 2. Enrollment Details (Only for New Students or Editing Admission Info) */}
                        {!initialData && (
                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                    <Calendar size={16} className="text-blue-600" />
                                    Tipo de Ingresso
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all h-full ${enrollmentType === 'regular' ? 'bg-white border-blue-200 ring-1 ring-blue-500/20 shadow-sm' : 'bg-transparent border-gray-200 hover:bg-white hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="enrollmentType"
                                            value="regular"
                                            checked={enrollmentType === 'regular'}
                                            onChange={() => setEnrollmentType('regular')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-gray-900">Matrícula Regular</span>
                                            <span className="block text-xs text-gray-500 mt-0.5">Início do ano letivo</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all h-full ${enrollmentType === 'transfer' ? 'bg-white border-blue-200 ring-1 ring-blue-500/20 shadow-sm' : 'bg-transparent border-gray-200 hover:bg-white hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="enrollmentType"
                                            value="transfer"
                                            checked={enrollmentType === 'transfer'}
                                            onChange={() => setEnrollmentType('transfer')}
                                            className="mt-1"
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-gray-900">Transferência</span>
                                            <span className="block text-xs text-gray-500 mt-0.5">Admissão tardia / pós-início</span>
                                        </div>
                                    </label>
                                </div>

                                {/* Conditional Fields for Transfer */}
                                {enrollmentType === 'transfer' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 pt-2 space-y-3 border-t border-gray-100 mt-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Data de Admissão <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={transferDate}
                                                onChange={(e) => setTransferDate(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Origem / Observação <span className="text-red-500">*</span></label>
                                            <select
                                                value={transferOrigin}
                                                onChange={(e) => setTransferOrigin(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                                                required
                                            >
                                                <option value="">Selecione a origem...</option>
                                                <option value="Unidade SESI (Transferência Interna)">Unidade SESI (Transferência Interna)</option>
                                                <option value="Escola Pública (Transferência Externa) - Não Bolsista">Escola Pública (Transf. Externa) - Não Bolsista</option>
                                                <option value="Escola Particular (Transferência Externa) - Não Bolsista">Escola Particular (Transf. Externa) - Não Bolsista</option>
                                                <option value="Escola Pública (Transferência Externa) - Bolsista">Escola Pública (Transf. Externa) - Bolsista</option>
                                                <option value="Escola Particular (Transferência Externa) - Bolsista">Escola Particular (Transf. Externa) - Bolsista</option>
                                                <option value="Outros">Outros</option>
                                            </select>
                                        </div>

                                        {/* Optional Fields: City/State (If NOT Outros and Origin Selected) */}
                                        {transferOrigin && transferOrigin !== 'Outros' && (
                                            <div className="flex gap-3 animate-in fade-in slide-in-from-top-1">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Cidade (Opcional)</label>
                                                    <input
                                                        type="text"
                                                        value={transferCity}
                                                        onChange={(e) => setTransferCity(e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-300"
                                                        placeholder="Ex: Dourados"
                                                    />
                                                </div>
                                                <div className="w-24">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Estado (UF)</label>
                                                    <input
                                                        type="text"
                                                        value={transferState}
                                                        onChange={handleStateChange}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-300 uppercase text-center"
                                                        placeholder="MS"
                                                        maxLength={2}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Optional Field: Observation (If Outros) */}
                                        {transferOrigin === 'Outros' && (
                                            <div className="animate-in fade-in slide-in-from-top-1">
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Descrição / Observação (Opcional)</label>
                                                <textarea
                                                    value={transferObservation}
                                                    onChange={(e) => setTransferObservation(e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-300 resize-none"
                                                    rows={3}
                                                    placeholder="Descreva a origem ou motivo..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Status (Only for Editing) */}
                        {initialData && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Atual
                                </label>
                                <div className="flex flex-col gap-2">
                                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${status === 'active' ? 'bg-green-50 border-green-200 ring-1 ring-green-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="active"
                                            checked={status === 'active'}
                                            onChange={() => setStatus('active')}
                                            className="sr-only"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className={`font-medium ${status === 'active' ? 'text-green-900' : 'text-gray-700'}`}>Ativo</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Estudante frequentando aulas normalmente.</p>
                                        </div>
                                        {status === 'active' && <Check size={16} className="text-green-600" />}
                                    </label>

                                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${status === 'inactive' ? 'bg-gray-50 border-gray-300 ring-1 ring-gray-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="inactive"
                                            checked={status === 'inactive'}
                                            onChange={() => setStatus('inactive')}
                                            className="sr-only"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status === 'inactive' ? 'bg-gray-500' : 'bg-gray-300'}`} />
                                                <span className={`font-medium ${status === 'inactive' ? 'text-gray-900' : 'text-gray-700'}`}>Arquivado / Inativo</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Matrícula trancada ou desistente.</p>
                                        </div>
                                        {status === 'inactive' && <Check size={16} className="text-gray-600" />}
                                    </label>

                                    <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${status === 'transferred' ? 'bg-red-50 border-red-200 ring-1 ring-red-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value="transferred"
                                            checked={status === 'transferred'}
                                            onChange={() => setStatus('transferred')}
                                            className="sr-only"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status === 'transferred' ? 'bg-red-500' : 'bg-gray-300'}`} />
                                                <span className={`font-medium ${status === 'transferred' ? 'text-red-900' : 'text-gray-700'}`}>Transferido</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Transferido para outra escola.</p>
                                        </div>
                                        {status === 'transferred' && <Check size={16} className="text-red-600" />}
                                    </label>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="student-form"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                    >
                        {initialData ? 'Salvar Alterações' : 'Adicionar Estudante'}
                    </button>
                </div>
            </div>
        </div>
    )
}
