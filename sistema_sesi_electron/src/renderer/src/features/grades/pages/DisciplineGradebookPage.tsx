import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, Settings2, Plus } from 'lucide-react'
import { PageLayout } from '../../../components/layouts/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useGradesStore } from '../stores/useGradesStore'

export function DisciplineGradebookPage(): React.ReactElement {
  const { classId, classDisciplineId } = useParams()
  const navigate = useNavigate()
  const [bimester, setBimester] = useState(1)

  const {
    students,
    grades,
    formativeInstances,
    isLoading,
    fetchGradebookData,
    updateGrade,
    updateFormativeEntry,
    calculateAv3,
    calculateAverage
  } = useGradesStore()

  useEffect(() => {
    if (classId && classDisciplineId) {
      fetchGradebookData(classId, classDisciplineId, bimester)
    }
  }, [classId, classDisciplineId, bimester, fetchGradebookData])

  // Handlers
  const handleGradeChange = (
    studentId: string,
    field: 'av1' | 'av2' | 'recovery',
    value: string
  ): void => {
    const numValue = value === '' ? null : Number.parseFloat(value)
    // Basic validation 0-10
    if (numValue !== null && (numValue < 0 || numValue > 10)) return

    updateGrade(studentId, field, numValue)
  }

  // Formatters
  const formatGrade = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return '-'
    return val.toFixed(1)
  }

  const getStatusColor = (avg: number | null): string => {
    if (avg === null) return 'text-gray-400'
    if (avg >= 6) return 'text-green-600 font-bold' // Configurable cut-off
    return 'text-red-600 font-bold'
  }

  return (
    <PageLayout
      title="Diário de Classe"
      description="Gerenciamento de notas, formativas e faltas."
      icon={BookOpen}
      action={
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ciências</h2>
            <p className="text-sm text-gray-500">4º Ano A • Matutino</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings2 size={16} />
              Configurar Pesos
            </Button>
          </div>
        </div>

        <Tabs
          value={`b${bimester}`}
          onValueChange={(v) => setBimester(Number.parseInt(v.replace('b', '')))}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="b1">1º Bimestre</TabsTrigger>
            <TabsTrigger value="b2">2º Bimestre</TabsTrigger>
            <TabsTrigger value="b3">3º Bimestre</TabsTrigger>
            <TabsTrigger value="b4">4º Bimestre</TabsTrigger>
          </TabsList>

          <TabsContent value={`b${bimester}`} className="mt-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-gray-500">Carregando dados...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow>
                        <TableHead className="w-[50px]">Nº</TableHead>
                        <TableHead className="min-w-[200px]">Nome do Aluno</TableHead>
                        <TableHead className="w-[80px] text-center">AV.1</TableHead>
                        <TableHead className="w-[80px] text-center">AV.2</TableHead>

                        {formativeInstances.map((f) => (
                          <TableHead key={f.id} className="w-[100px] text-center text-xs">
                            <div className="flex flex-col items-center">
                              <span>{f.name}</span>
                              <span className="text-gray-400 font-normal">({f.maxPoints} pts)</span>
                            </div>
                          </TableHead>
                        ))}

                        <TableHead className="w-[50px] text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-full hover:bg-blue-100 text-blue-600"
                          >
                            <Plus size={14} />
                          </Button>
                        </TableHead>

                        <TableHead className="w-[80px] text-center bg-blue-50/30 font-bold text-blue-800">
                          AV.3
                        </TableHead>
                        <TableHead className="w-[80px] text-center bg-gray-100 font-bold text-gray-900">
                          Média
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, index) => {
                        // Find Assessment IDs for AV1/AV2
                        const av1Id = useGradesStore
                          .getState()
                          .fixedAssessments.find((a) => a.type === 'av1')?.id
                        const av2Id = useGradesStore
                          .getState()
                          .fixedAssessments.find((a) => a.type === 'av2')?.id

                        // Helper to get value
                        const getGradeVal = (assessmentId?: string): string => {
                          if (!assessmentId) return ''
                          const g = grades.find(
                            (g) => g.studentId === student.id && g.assessmentId === assessmentId
                          )
                          return g?.value?.toString() || ''
                        }

                        const av3 = calculateAv3(student.id)
                        const average = calculateAverage(student.id)

                        return (
                          <TableRow key={student.id}>
                            <TableCell className="text-center text-gray-400 font-mono text-xs">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-gray-700">
                              {student.name}
                            </TableCell>

                            {/* AV1 */}
                            <TableCell>
                              <Input
                                className="h-8 text-center"
                                value={getGradeVal(av1Id)}
                                onChange={(e) =>
                                  handleGradeChange(student.id, 'av1', e.target.value)
                                }
                                placeholder={av1Id ? '-' : 'N/A'}
                                disabled={!av1Id}
                              />
                            </TableCell>

                            {/* AV2 */}
                            <TableCell>
                              <Input
                                className="h-8 text-center"
                                value={getGradeVal(av2Id)}
                                onChange={(e) =>
                                  handleGradeChange(student.id, 'av2', e.target.value)
                                }
                                placeholder={av2Id ? '-' : 'N/A'}
                                disabled={!av2Id}
                              />
                            </TableCell>

                            {/* Formatives */}
                            {formativeInstances.map((f) => {
                              const entry = useGradesStore
                                .getState()
                                .formativeEntries.find(
                                  (e) => e.assessmentId === f.id && e.studentId === student.id
                                )
                              // We need an updateFormativeEntry handler in the Page or expose it from store
                              // The store has updateFormativeEntry(studentId, instanceId, value)

                              return (
                                <TableCell key={f.id} className="text-center">
                                  <Input
                                    className="h-8 text-center w-full px-1"
                                    value={entry?.value?.toString() || ''}
                                    onChange={(e) => {
                                      const val =
                                        e.target.value === '' ? null : Number(e.target.value)
                                      // Validation?
                                      if (val !== null && (val < 0 || val > f.maxPoints)) return
                                      // Call store method directly or wrap in handler?
                                      // Let's call store method. We need to export it or use it from hook.
                                      // 'updateFormativeEntry' is exposed from useGradesStore() hook.
                                      updateFormativeEntry(student.id, f.id, val)
                                    }}
                                    placeholder="-"
                                  />
                                </TableCell>
                              )
                            })}
                            <TableCell />

                            {/* AV3 (Calculated) */}
                            <TableCell
                              className={`text-center font-bold bg-blue-50/10 ${
                                av3 === null ? 'text-gray-300' : 'text-blue-600'
                              }`}
                            >
                              {formatGrade(av3)}
                            </TableCell>

                            {/* Média Final */}
                            <TableCell
                              className={`text-center bg-gray-50/50 text-lg ${getStatusColor(average)}`}
                            >
                              {formatGrade(average)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
