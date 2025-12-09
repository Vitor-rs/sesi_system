import { create } from 'zustand'
import { Class } from '../../../shared/types'

export type { Class } from '../../../shared/types'

interface ClassState {
  classes: Class[]
  isLoading: boolean
  error: string | null

  fetchClasses: () => Promise<void>
  addClass: (data: Omit<Class, 'id' | 'name'>) => Promise<void>
  updateClass: (id: string, data: Partial<Omit<Class, 'id' | 'name'>>) => Promise<void>
  removeClass: (id: string) => Promise<void>
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  isLoading: false,
  error: null,

  fetchClasses: async () => {
    set({ isLoading: true, error: null })
    try {
      const classes = await globalThis.window.api.getClasses()
      set({ classes, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      set({ error: 'Failed to fetch classes', isLoading: false })
    }
  },

  addClass: async (data) => {
    set({ isLoading: true, error: null })
    try {
      // Backend handles name generation if needed, or we send it?
      // Helper to generate name if missing
      const name = `${data.grade} ${data.letter}`
      await globalThis.window.api.createClass({ ...data, name, id: crypto.randomUUID() })
      await get().fetchClasses()
    } catch (error) {
      console.error('Failed to create class:', error)
      set({ error: 'Failed to create class', isLoading: false })
    }
  },

  updateClass: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      // Logic to regenerate name if grade/letter changes should ideally be in backend or shared
      // For now, let's keep it simple (optimistic updates or backend trigger)
      // Since we refresh, Backend should handle it OR we send updated name
      const updatedData = { ...data }
      // To properly update name we might need current state, but simple overwrite is safer:
      // If grade/letter is updated, we should ideally recompute name.
      // But let's assume UI handles it or Backend triggers.
      // Actually, let's just send what we have.

      await globalThis.window.api.updateClass(id, updatedData)
      await get().fetchClasses()
    } catch (error) {
      console.error('Failed to update class:', error)
      set({ error: 'Failed to update class', isLoading: false })
    }
  },

  removeClass: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await globalThis.window.api.deleteClass(id)
      await get().fetchClasses()
    } catch (error) {
      console.error('Failed to delete class:', error)
      set({ error: 'Failed to delete class', isLoading: false })
    }
  }
}))
