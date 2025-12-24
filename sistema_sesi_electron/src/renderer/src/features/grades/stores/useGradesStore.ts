import { create } from 'zustand'
import { Student, GradeEntry, FormativeInstance, FormativeEntry } from '../../../../../shared/types'

interface GradesState {
  students: Student[]
  grades: GradeEntry[]
  fixedAssessments: { id: string; type: string }[]
  formativeInstances: FormativeInstance[]
  formativeEntries: FormativeEntry[]
  isLoading: boolean
  error: string | null

  fetchGradebookData: (
    classId: string,
    classDisciplineId: string,
    bimester: number
  ) => Promise<void>

  // Actions
  updateGrade: (
    studentId: string,
    field: 'av1' | 'av2' | 'recovery',
    value: number | null
  ) => Promise<void>

  updateFormativeEntry: (
    studentId: string,
    assessmentId: string,
    value: number | null
  ) => Promise<void>

  // Formative Management
  addFormativeInstance: (data: Omit<FormativeInstance, 'id'>) => Promise<void>
  deleteFormativeInstance: (id: string) => Promise<void>

  // Helpers
  calculateAv3: (studentId: string) => number | null
  calculateAverage: (studentId: string) => number | null
}

export const useGradesStore = create<GradesState>((set, get) => ({
  students: [],
  grades: [],
  fixedAssessments: [],
  formativeInstances: [],
  formativeEntries: [],
  isLoading: false,
  error: null,

  fetchGradebookData: async (classId, classDisciplineId, bimester) => {
    set({ isLoading: true, error: null })
    try {
      // 1. Fetch Students
      // Fetch data in parallel
      const [classStudents, grades, fixedAssessments, formativeInstances] = await Promise.all([
        window.api.getStudentsByClass(classId),
        window.api.getGrades(classDisciplineId, bimester),
        window.api.getFixedAssessments(classDisciplineId, bimester),
        window.api.getFormativeInstances(classDisciplineId, bimester)
      ])

      // Filter active students (if backend doesn't filter status)
      const activeStudents = classStudents.filter((s) => s.status === 'active')
      activeStudents.sort((a: any, b: any) => a.name.localeCompare(b.name))

      // For each formative instance, fetch entries
      const entriesPromises = formativeInstances.map((inst) =>
        window.api.getFormativeEntries(inst.id)
      )
      const entriesArrays = await Promise.all(entriesPromises)
      // Flatten entries
      const formativeEntries = entriesArrays.flat()

      // Filter students by class (client-side for now until api.getStudentsByClass exists)
      set({
        students: activeStudents,
        grades,
        fixedAssessments,
        formativeInstances,
        formativeEntries,
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to fetch gradebook data:', error)
      set({ error: 'Falha ao carregar dados do diário', isLoading: false })
    }
  },

  updateGrade: async (studentId, field, value) => {
    const { fixedAssessments, grades } = get()

    // Find the assessmentId for the given field (av1, av2)
    const assessment = fixedAssessments.find((a) => a.type === field)

    if (!assessment) {
      console.error(
        `Assessment definition for ${field} not found. Ensure fixed assessments are loaded.`
      )
      return
    }

    const assessmentId = assessment.id
    const previousGrades = grades

    // Optimistic Update
    set((state) => ({
      grades: state.grades.map((g) => {
        // If we already have a grade entry for this student and assessment, update it
        if (g.studentId === studentId && g.assessmentId === assessmentId) {
          return { ...g, value }
        }
        return g
      })
    }))

    const gradeExists = grades.some(
      (g) => g.studentId === studentId && g.assessmentId === assessmentId
    )

    if (!gradeExists && value !== null) {
      set((state) => ({
        grades: [
          ...state.grades,
          {
            id: 'temp-' + Date.now(), // Temp ID
            studentId,
            assessmentId,
            value,
            updatedAt: new Date().toISOString()
          } // We cast/fit into GradeEntry
        ]
      }))
    }

    try {
      await window.api.updateGrade(studentId, assessmentId, value)
    } catch (error) {
      console.error('Failed to update grade:', error)
      set({ grades: previousGrades }) // Rollback
    }
  },

  updateFormativeEntry: async (studentId, assessmentId, value) => {
    const { formativeEntries } = get()
    const previousEntries = formativeEntries

    // Optimistic Update
    set((state) => ({
      formativeEntries: state.formativeEntries.map((e) => {
        if (e.studentId === studentId && e.assessmentId === assessmentId) {
          return { ...e, value }
        }
        return e
      })
    }))

    // Handle new entry
    const exists = formativeEntries.some(
      (e) => e.studentId === studentId && e.assessmentId === assessmentId
    )
    if (!exists && value !== null) {
      set((state) => ({
        formativeEntries: [
          ...state.formativeEntries,
          {
            id: 'temp-' + Date.now(),
            studentId,
            assessmentId,
            value,
            updatedAt: new Date().toISOString()
          }
        ]
      }))
    }

    try {
      await window.api.updateGrade(studentId, assessmentId, value)
    } catch (error) {
      console.error('Falha ao atualizar formativa:', error)
      set({ formativeEntries: previousEntries })
    }
  },

  // Formative Management Placeholders
  addFormativeInstance: async () => {
    // TODO: Implement
    console.warn('addFormativeInstance not implemented yet')
    return
  },
  deleteFormativeInstance: async () => {
    // TODO: Implement
    console.warn('deleteFormativeInstance not implemented yet')
    return
  },

  calculateAv3: (studentId) => {
    const { formativeEntries, formativeInstances } = get()
    const studentEntries = formativeEntries.filter(
      (e) => e.studentId === studentId && formativeInstances.some((i) => i.id === e.assessmentId)
    )

    if (studentEntries.length === 0) return null

    // P2 Logic: "AV.3 é a média aritmética"
    const sum = studentEntries.reduce((acc, curr) => acc + (curr.value || 0), 0)
    // Avoid division by zero, though length check handles it.
    return Number.parseFloat((sum / studentEntries.length).toFixed(1))
  },

  calculateAverage: (studentId) => {
    const { grades, fixedAssessments } = get()

    // Need to find AV1 and AV2 grades
    const av1Id = fixedAssessments.find((a) => a.type === 'av1')?.id
    const av2Id = fixedAssessments.find((a) => a.type === 'av2')?.id

    const av1Entry = grades.find((g) => g.studentId === studentId && g.assessmentId === av1Id)
    const av2Entry = grades.find((g) => g.studentId === studentId && g.assessmentId === av2Id)

    const av3 = get().calculateAv3(studentId)

    const av1 = av1Entry?.value ?? null
    const av2 = av2Entry?.value ?? null

    if (av1 === null || av2 === null || av3 === null) return null

    // Specific logic from P2: (AV1 + AV2 + AV3) / 3
    const rawMean = (av1 + av2 + av3) / 3
    // SESI Rounding: Round(Value + 0.2) to nearest 0.5
    // Logic: Math.round((Value + 0.2) * 2) / 2
    const rounded = Math.round((rawMean + 0.2) * 2) / 2
    return rounded
  }
}))
