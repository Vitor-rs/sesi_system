import { create } from 'zustand'
import { Student, StudentHistoryEvent } from '../../../shared/types'

export type { Student, StudentHistoryEvent }

interface StudentState {
  students: Student[]
  isLoading: boolean
  error: string | null

  fetchStudents: () => Promise<void>
  fetchStudentDetails: (id: string) => Promise<void>
  addStudent: (data: Omit<Student, 'id' | 'createdAt' | 'status' | 'history'>) => Promise<void>
  updateStudent: (id: string, data: Partial<Omit<Student, 'id' | 'history'>>) => Promise<void>
  removeStudent: (id: string) => Promise<void>
  addHistoryEvent: (
    studentId: string,
    type: StudentHistoryEvent['type'],
    description: string
  ) => Promise<void>
  toggleStatus: (id: string, status: Student['status'], reason?: string) => Promise<void>
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    set({ isLoading: true, error: null })
    try {
      const students = await window.api.getStudents()
      set({ students, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch students:', error)
      set({ error: 'Failed to fetch students', isLoading: false })
    }
  },

  fetchStudentDetails: async (id) => {
    try {
      // @ts-ignore - api typing is loose
      const student = await window.api.getStudentById(id)
      if (student) {
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? student : s))
        }))
      }
    } catch (error) {
      console.error('Failed to fetch student details:', error)
    }
  },

  addStudent: async (data) => {
    set({ isLoading: true, error: null })
    try {
      // We pass the raw data, the Main process handles ID and defaults
      await window.api.createStudent(data)
      await get().fetchStudents() // Refresh list
    } catch (error) {
      console.error('Failed to create student:', error)
      set({ error: 'Failed to create student', isLoading: false })
    }
  },

  updateStudent: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      await window.api.updateStudent(id, data)
      await get().fetchStudents()
    } catch (error) {
      console.error('Failed to update student:', error)
      set({ error: 'Failed to update student', isLoading: false })
    }
  },

  removeStudent: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await window.api.deleteStudent(id)
      await get().fetchStudents()
    } catch (error) {
      console.error('Failed to delete student:', error)
      set({ error: 'Failed to delete student', isLoading: false })
    }
  },

  addHistoryEvent: async (studentId, type, description) => {
    try {
      await window.api.addStudentHistory({
        id: crypto.randomUUID(),
        studentId,
        type,
        description,
        date: new Date().toISOString()
      })
      await get().fetchStudents()
    } catch (error) {
      console.error('Failed to add history:', error)
    }
  },

  toggleStatus: async (id, status, reason) => {
    try {
      // 1. Update status
      await window.api.updateStudent(id, { status })

      // 2. Add history event
      let eventType: StudentHistoryEvent['type'] = 'info_update'
      let description = `Status alterado para ${status}`

      if (status === 'inactive') {
        eventType = 'archived'
        description = reason || 'Estudante arquivado.'
      } else if (status === 'active') {
        eventType = 'reactivated'
        description = reason || 'Estudante reativado.'
      } else if (status === 'transferred') {
        eventType = 'transfer_out'
        description = reason || 'Estudante transferido.'
      }

      await window.api.addStudentHistory({
        id: crypto.randomUUID(), // Generator on client or server? Client is fine for UUID
        studentId: id,
        type: eventType,
        description,
        date: new Date().toISOString()
      })

      await get().fetchStudents()
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }
}))
