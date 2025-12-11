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
      // Name is auto-generated from Grade + Letter
      const name = `${data.grade} ${data.letter}`
      // Remove deprecated fields from payload if they exist in UI code momentarily,
      // but here strict typing should guide us.
      // We pass generic ID generation to client for now as per previous pattern.
      await globalThis.window.api.createClass({
        ...data,
        name,
        id: crypto.randomUUID()
      })
      await get().fetchClasses()
    } catch (error) {
      console.error('Failed to create class:', error)
      set({ error: 'Failed to create class', isLoading: false })
    }
  },

  updateClass: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      // If grade/letter changes, we might want to update name.
      // Ideally we check if grade/letter are present in data.
      // For simplicity, we assume backend or UI handles full object or we just send partial.
      // But if grade/letter are in data, we should update name too.
      // However 'data' is Partial<Omit<Class, 'id' | 'name'>>.
      // If we don't have current state here easily, we might miss name update.
      // Let's rely on the fact that for this refactor, we usually send full updates or we can grab current class.

      const currentClass = get().classes.find((c) => c.id === id)
      let updatedName: string | undefined = undefined

      if (currentClass) {
        const newGrade = data.grade || currentClass.grade
        const newLetter = data.letter || currentClass.letter
        updatedName = `${newGrade} ${newLetter}`
      }

      const payload = { ...data, ...(updatedName ? { name: updatedName } : {}) }

      await globalThis.window.api.updateClass(id, payload)
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
