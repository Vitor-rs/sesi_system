import { create } from 'zustand'
import { Class } from '../../../../../shared/types'

interface ClassesState {
  classes: Class[]
  isLoading: boolean
  error: string | null

  fetchClasses: () => Promise<void>
  createClass: (data: Omit<Class, 'id'>) => Promise<void>
  updateClass: (id: string, data: Partial<Class>) => Promise<void>
  deleteClass: (id: string) => Promise<void>
}

export const useClassesStore = create<ClassesState>((set, get) => ({
  classes: [],
  isLoading: false,
  error: null,

  fetchClasses: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getClasses()
      set({ classes: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch classes', isLoading: false })
      console.error(error)
    }
  },

  createClass: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await api.createClass(data)
      await get().fetchClasses()
    } catch (error) {
      set({ error: 'Failed to create class', isLoading: false })
      throw error
    }
  },

  updateClass: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      await api.updateClass(id, data)
      await get().fetchClasses()
    } catch (error) {
      set({ error: 'Failed to update class', isLoading: false })
      throw error
    }
  },

  deleteClass: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await api.deleteClass(id)
      await get().fetchClasses()
    } catch (error) {
      set({ error: 'Failed to delete class', isLoading: false })
      throw error
    }
  }
}))
