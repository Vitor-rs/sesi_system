import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, School, Users, AlertCircle } from 'lucide-react'
import { useClassStore, type Class } from '../../../stores/useClassStore'
import { useStudentStore, type Student } from '../../../stores/useStudentStore'
import { ConfirmModal } from '../../../components/ui/ConfirmModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function ClassManager(): React.ReactElement {
  const { classes, addClass, updateClass, removeClass } = useClassStore()
  const { students } = useStudentStore()

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Selection States
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [classToDelete, setClassToDelete] = useState<Class | null>(null)

  const [formData, setFormData] = useState({
    grade: '',
    letter: ''
  })

  // State for Blocked Deletion Popover

  const handleOpenForm = (cls?: Class): void => {
    if (cls) {
      setEditingClass(cls)
      setFormData({
        grade: cls.grade,
        letter: cls.letter
      })
    } else {
      setEditingClass(null)
      setFormData({
        grade: '',
        letter: ''
      })
    }
    setIsFormOpen(true)
  }

  const handleGradeBlur = (): void => {
    // Auto-format "4" -> "4º Ano"
    const numberMatch = /^(\d+)$/.exec(formData.grade)
    if (numberMatch) {
      setFormData((prev) => ({ ...prev, grade: `${numberMatch[1]}º Ano` }))
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    // Uniqueness Check
    const isDuplicate = classes.some(
      (c) => c.grade === formData.grade && c.letter === formData.letter && c.id !== editingClass?.id
    )

    if (isDuplicate) {
      alert(`A turma ${formData.grade} ${formData.letter} já existe!`)
      return
    }

    if (editingClass) {
      await updateClass(editingClass.id, formData)
    } else {
      await addClass(formData)
    }
    setIsFormOpen(false)
  }

  const getLinkedStudents = (classId: string): Student[] => {
    return students.filter((s) => s.classId === classId && s.status === 'active')
  }

  const handleDeleteClick = (cls: Class): void => {
    const linked = getLinkedStudents(cls.id)
    if (linked.length > 0) {
      // Logic handled by opening Popover via state or simple alert fallback if Popover logic fails,
      // but UI requires sticky Popover or similar.
      // Actually, distinct UX: The Trash button should distinctively show it's disabled or show popover when clicked.
      return
    }
    setClassToDelete(cls)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = (): void => {
    if (classToDelete) {
      removeClass(classToDelete.id)
      setIsDeleteModalOpen(false)
      setClassToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Gerenciamento de Turmas</h2>
          <p className="text-sm text-gray-500">Cadastre e organize as turmas da escola.</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Turma
        </Button>
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
            const linkedStudents = getLinkedStudents(cls.id)
            const isBlocked = linkedStudents.length > 0

            return (
              <Card key={cls.id} className="relative group hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                        <School size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {cls.grade} <span className="text-blue-600">{cls.letter}</span>
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-0.5">
                          <Users size={14} className="mr-1.5" />
                          {linkedStudents.length} alunos
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-auto flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-blue-600"
                      onClick={() => handleOpenForm(cls)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </Button>

                    {isBlocked ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-300 hover:text-red-400 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <div className="flex items-start gap-2 text-red-600">
                              <AlertCircle size={18} className="mt-0.5 shrink-0" />
                              <div className="space-y-1">
                                <h4 className="font-medium text-sm">Não é possível excluir</h4>
                                <p className="text-xs text-muted-foreground">
                                  Esta turma possui {linkedStudents.length} alunos ativos. Remova-os
                                  primeiro.
                                </p>
                              </div>
                            </div>

                            <div className="max-h-[200px] overflow-y-auto rounded-md border text-xs">
                              {linkedStudents.map((s) => (
                                <div
                                  key={s.id}
                                  className="p-2 border-b last:border-0 bg-gray-50/50 flex justify-between"
                                >
                                  <span>{s.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(cls)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="grade-input">Série / Ano</Label>
                  <Input
                    id="grade-input"
                    type="text"
                    required
                    placeholder="Ex: 4"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    onBlur={handleGradeBlur}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Ex: &quot;4&quot; vira &quot;4º Ano&quot;
                  </p>
                </div>
                <div className="col-span-1">
                  <Label htmlFor="letter-input">Letra</Label>
                  <Input
                    id="letter-input"
                    type="text"
                    required
                    placeholder="Ex: A"
                    className="uppercase"
                    maxLength={2}
                    value={formData.letter}
                    onChange={(e) =>
                      setFormData({ ...formData, letter: e.target.value.toUpperCase() })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit">Salvar</Button>
              </div>
            </form>
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
