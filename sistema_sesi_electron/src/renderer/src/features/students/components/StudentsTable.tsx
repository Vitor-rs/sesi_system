import React from 'react'
import { Clock, Edit2, Archive, RefreshCw, AlertCircle, Trash2, Info } from 'lucide-react'
import type { Student } from '../../../stores/useStudentStore'
import type { Class } from '../../../stores/useClassStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface StudentsTableProps {
  students: Student[]
  classes: Class[]
  sortBy: 'alphabetical' | 'admission'
  showArchived: boolean
  onEdit: (student: Student) => void
  onViewHistory: (student: Student) => void
  onArchive: (id: string, name: string) => void
  onReactivate: (id: string) => void
  onDeleteRequest: (student: Student) => void
}

export const StudentsTable = ({
  students,
  classes,
  sortBy,
  showArchived,
  onEdit,
  onViewHistory,
  onArchive,
  onReactivate,
  onDeleteRequest
}: StudentsTableProps): React.ReactElement => {
  if (students.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <AlertCircle className="text-gray-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum estudante encontrado</h3>
        <p className="text-gray-500 text-sm">
          Tente buscar com outro termo ou adicione novos estudantes.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-0 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-gray-100 sticky top-0 z-30">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-14 text-center border-b border-gray-200 first:rounded-tl-lg">
                #
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3 border-b border-gray-200">
                Nome
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Turma
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                Status
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right w-48 border-b border-gray-200 last:rounded-tr-lg">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {students.map((student, index) => {
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
                <tr
                  key={student.id}
                  className={`group transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                  } hover:bg-yellow-50`}
                >
                  <td className="px-3 py-2 text-xs w-14 text-center border-b border-gray-100 group-hover:border-transparent">
                    {displayIndex}
                  </td>
                  <td className="px-3 py-2 text-xs border-b border-gray-100 group-hover:border-transparent">
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-3 py-2 text-xs border-b border-gray-100 group-hover:border-transparent">
                    {studentClass ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal bg-blue-50 text-blue-700 border-blue-100"
                      >
                        {studentClass.grade} {studentClass.letter}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Sem turma</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs border-b border-gray-100 group-hover:border-transparent">
                    {student.status === 'active' ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 text-[10px] shadow-none"
                      >
                        Ativo
                      </Badge>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 text-[10px] shadow-none cursor-help"
                            >
                              Inativo / Arquivado
                              {student.inactiveReason && (
                                <Info size={10} className="ml-1 opacity-50" />
                              )}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {student.inactiveReason || 'Sem motivo especificado'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-right border-b border-gray-100 group-hover:border-transparent">
                    <div className="flex items-center justify-end gap-1 opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-blue-600"
                        onClick={() => onViewHistory(student)}
                        title="Ver Histórico"
                      >
                        <Clock size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => onEdit(student)}
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </Button>

                      {student.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                          onClick={() => onArchive(student.id, student.name)}
                          title="Arquivar"
                        >
                          <Archive size={14} />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={() => onReactivate(student.id)}
                          title="Reativar"
                        >
                          <RefreshCw size={14} />
                        </Button>
                      )}

                      {showArchived && (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={hasDependencies}
                          className={`h-7 w-7 ${
                            hasDependencies
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          onClick={() => onDeleteRequest(student)}
                          title={hasDependencies ? 'Possui histórico' : 'Excluir'}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
