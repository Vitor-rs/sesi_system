import { create } from 'zustand'
import { Grade, FormativeInstance, FormativeEntry, Student } from '../../../../../shared/types'

interface GradesState {
  students: Student[]
  grades: Grade[]
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
  updateFormativeEntry: (studentId: string, instanceId: string, value: number) => Promise<void>

  // Formative Management
  addFormativeInstance: (data: Omit<FormativeInstance, 'id'>) => Promise<void>
  deleteFormativeInstance: (id: string) => Promise<void>

  // Helpers (Selectors logic moved to component for responsiveness, but helper functions here)
  calculateAv3: (studentId: string) => number | null
  calculateAverage: (studentId: string) => number | null
}

export const useGradesStore = create<GradesState>((set, get) => ({
  students: [],
  grades: [],
  formativeInstances: [],
  formativeEntries: [],
  isLoading: false,
  error: null,

  fetchGradebookData: async (classId, classDisciplineId, bimester) => {
    set({ isLoading: true, error: null })
    try {
      // Mock APIs for now or use the assumed ones
      // In a real scenario, we'd probably have a specific endpoint 'getGradebook' to fetch all this at once

      const students = await globalThis.api.getStudents() // Should filter by classId locally or via API
      const filteredStudents = students.filter(
        (s) => s.classId === classId && s.status === 'active'
      )
      // sort alphabetically
      filteredStudents.sort((a, b) => a.name.localeCompare(b.name))

      const grades = await globalThis.api.getGrades(classDisciplineId, bimester)
      const instances = await globalThis.api.getFormativeInstances(classDisciplineId, bimester)

      // We need entries for all instances
      // This might be heavy if done individually. Assume we have a bulk fetch or we fetch per instance.
      // For MVP, let's assume we can fetch all entries for these instances.
      // Since API doesn't have 'getAllEntries', we might loop (inefficient) or mock a 'getGradebook' call.

      const allEntries: FormativeEntry[] = []
      for (const instance of instances) {
        const entries = await globalThis.api.getFormativeEntries(instance.id)
        allEntries.push(...entries)
      }

      set({
        students: filteredStudents,
        grades,
        formativeInstances: instances,
        formativeEntries: allEntries,
        isLoading: false
      })
    } catch (error) {
      console.error(error)
      set({ error: 'Falha ao carregar diário de classe', isLoading: false })
    }
  },

  updateGrade: async (studentId, field, value) => {
    const { grades } = get()
    // Optimistic update
    const gradeIndex = grades.findIndex((g) => g.studentId === studentId)
    const newGrades = [...grades]

    if (gradeIndex >= 0) {
      newGrades[gradeIndex] = { ...newGrades[gradeIndex], [field]: value }
    } else {
      // Create local placeholder if doesn't exist (assuming backend handles creation)
      // This is tricky without other required fields like ID.
      // We'll rely on backend capability to 'upsert'
    }

    set({ grades: newGrades })

    try {
      // Call API
      // await window.api.saveGrade(...)
    } catch (error) {
      // Revert on failure
      console.error('Failed to save grade', error)
      // trigger refetch or revert
    }
  },

  updateFormativeEntry: async (studentId, instanceId, value) => {
    const { formativeEntries } = get()
    const entryIndex = formativeEntries.findIndex(
      (e) => e.studentId === studentId && e.formativeInstanceId === instanceId
    )

    const newEntries = [...formativeEntries]
    if (entryIndex >= 0) {
      newEntries[entryIndex] = { ...newEntries[entryIndex], value }
    } else {
      // Create new entry logic
      // newEntries.push({ id: 'temp', studentId, formativeInstanceId: instanceId, value })
    }
    set({ formativeEntries: newEntries })

    // API call
  },

  addFormativeInstance: async () => {
    // API call then refetch
  },

  deleteFormativeInstance: async () => {
    // API call then refetch
  },

  calculateAv3: (studentId) => {
    const { formativeEntries, formativeInstances } = get()
    // Find all entries for this student that belong to current instances
    const studentEntries = formativeEntries.filter(
      (e) =>
        e.studentId === studentId && formativeInstances.some((i) => i.id === e.formativeInstanceId)
    )

    if (studentEntries.length === 0) return null

    // Logic: Average of formativas? Or sum?
    // P2 says: "AV.3 é a média aritmética de todas as Atividades Formativas cadastradas."
    const sum = studentEntries.reduce((acc, curr) => acc + curr.value, 0)
    return Number.parseFloat((sum / studentEntries.length).toFixed(1))
  },

  calculateAverage: (studentId) => {
    const { grades } = get()
    const grade = grades.find((g) => g.studentId === studentId)
    const av3 = get().calculateAv3(studentId)

    if (!grade) return null

    const av1 = grade.av1
    const av2 = grade.av2

    if (av1 === null || av2 === null || av3 === null) return null

    // Specific logic from P2: (AV1 + AV2 + AV3) / 3
    // With rounding logic ARREDMULTB (Round to nearest 0.5 with 0.2 bias)

    const rawMean = (av1 + av2 + av3) / 3

    // SESI Rounding: Round(Value + 0.2) to nearest 0.5
    // Implementation: Math.floor((Value + 0.2) * 2) / 2 ? No, let's check P2 example.
    // 6.1 + 0.2 = 6.3 => 6.5.
    // 6.0 + 0.2 = 6.2 => 6.0.
    // Logic: Math.round((Value + 0.2) * 2) / 2

    const rounded = Math.round((rawMean + 0.2) * 2) / 2
    return rounded
  }
}))
