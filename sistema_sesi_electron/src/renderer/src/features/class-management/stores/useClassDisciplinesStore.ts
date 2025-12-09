import { create } from 'zustand'
import { ClassDiscipline } from '../../../../../shared/types'

interface ClassDisciplinesState {
  classDisciplines: ClassDiscipline[]
  isLoading: boolean
  error: string | null

  fetchClassDisciplines: (classId: string) => Promise<void>
  addClassDiscipline: (data: {
    classId: string
    disciplineId: string
    teacherName?: string
  }) => Promise<void>
  deleteClassDiscipline: (id: string, classId: string) => Promise<void>
}

export const useClassDisciplinesStore = create<ClassDisciplinesState>((set, get) => ({
  classDisciplines: [],
  isLoading: false,
  error: null,

  fetchClassDisciplines: async (classId: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getClassDisciplines(classId)
      set({ classDisciplines: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch class disciplines', isLoading: false })
      console.error(error)
    }
  },

  addClassDiscipline: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await api.createClassDiscipline(data)
      await get().fetchClassDisciplines(data.classId)
    } catch (error) {
      set({ error: 'Failed to add discipline to class', isLoading: false })
      throw error
    }
  },

  deleteClassDiscipline: async (id, classId) => {
    set({ isLoading: true, error: null })
    try {
      await api.deleteClassDiscipline(id)
      await get().fetchClassDisciplines(classId)
    } catch (error) {
      set({ error: 'Failed to delete class discipline', isLoading: false })
      throw error
    }
  }
}))
