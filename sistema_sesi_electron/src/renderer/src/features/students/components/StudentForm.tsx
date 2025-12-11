import React, { useState } from 'react'
import { X, Calendar, AlertCircle } from 'lucide-react'
import type { Student } from '../../../stores/useStudentStore'
import { useClassStore } from '../../../stores/useClassStore'
import { formatStudentName } from '../../../utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

export interface StudentFormData {
  name: string
  classId?: string
  status?: Student['status']
  enrollmentType: 'regular' | 'transfer_in' | 'late_admission'
  admissionDate?: string
  originType?: 'sesi_internal' | 'public' | 'private_scholarship' | 'private_paying' | 'other'
  originDescription?: string
}

interface StudentFormProps {
  readonly initialData?: Student | null
  readonly onSubmit: (data: StudentFormData) => void
  readonly onCancel: () => void
}

export function StudentForm({
  initialData,
  onSubmit,
  onCancel
}: StudentFormProps): React.ReactElement {
  const { classes } = useClassStore()

  // Core State
  const [name, setName] = useState(initialData?.name ?? '')
  const [classId, setClassId] = useState(initialData?.classId ?? '')
  const [status] = useState<Student['status']>(initialData?.status ?? 'active')

  // Enrollment State
  const [enrollmentType, setEnrollmentType] = useState<StudentFormData['enrollmentType']>(
    initialData?.enrollmentType ?? 'regular'
  )
  const [admissionDate, setAdmissionDate] = useState(
    initialData?.admissionDate ?? new Date().toISOString().split('T')[0]
  )
  const [originType, setOriginType] = useState(initialData?.originType ?? undefined)

  const [originDescription, setOriginDescription] = useState(initialData?.originDescription ?? '')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({
        name: formatStudentName(name.trim()),
        classId: classId || undefined,
        status,
        enrollmentType,
        admissionDate: enrollmentType === 'regular' ? undefined : admissionDate,
        originType: enrollmentType === 'regular' ? undefined : originType,
        originDescription: enrollmentType === 'regular' ? undefined : originDescription
      })
    }
  }

  const handleBlur = (): void => {
    if (name.trim()) {
      setName(formatStudentName(name.trim()))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Estudante' : 'Novo Estudante'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X size={20} />
          </Button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Basic Info */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Ex: Ana da Silva"
                  autoFocus
                  required
                />
                <p className="text-[10px] text-muted-foreground">
                  O nome será formatado automaticamente e capitalizado.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="class">
                  Turma <span className="text-red-500">*</span>
                </Label>
                <Select value={classId} onValueChange={setClassId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.grade} {cls.letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {classes.length === 0 && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> É necessário criar uma turma antes.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Enrollment Details */}
            {!initialData && (
              <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar size={16} className="text-primary" />
                  Tipo de Ingresso
                </div>

                <RadioGroup
                  value={enrollmentType}
                  onValueChange={(v) => setEnrollmentType(v as StudentFormData['enrollmentType'])}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md bg-background hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="regular" id="r1" />
                    <Label htmlFor="r1" className="cursor-pointer font-normal">
                      <span className="font-medium block">Matrícula Regular</span>
                      <span className="text-xs text-muted-foreground">Início do ano letivo</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md bg-background hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="transfer_in" id="r2" />
                    <Label htmlFor="r2" className="cursor-pointer font-normal">
                      <span className="font-medium block">Transferência</span>
                      <span className="text-xs text-muted-foreground">Vindo de outra escola</span>
                    </Label>
                  </div>
                </RadioGroup>

                {enrollmentType !== 'regular' && (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2">
                      <Label htmlFor="admissionDate">Data de Admissão</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value={admissionDate}
                        onChange={(e) => setAdmissionDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Origem</Label>
                      <Select
                        value={originType}
                        onValueChange={(v) => setOriginType(v as StudentFormData['originType'])}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sesi_internal">Unidade SESI (Interna)</SelectItem>
                          <SelectItem value="public">Escola Pública</SelectItem>
                          <SelectItem value="private_scholarship">Particular (Bolsista)</SelectItem>
                          <SelectItem value="private_paying">Particular (Pagante)</SelectItem>
                          <SelectItem value="other">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Observação / Detalhes</Label>
                      <Textarea
                        id="description"
                        value={originDescription}
                        onChange={(e) => setOriginDescription(e.target.value)}
                        placeholder="Nome da escola anterior ou detalhes..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" form="student-form">
            {initialData ? 'Salvar Alterações' : 'Cadastrar Estudante'}
          </Button>
        </div>
      </div>
    </div>
  )
}
