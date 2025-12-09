import { create } from 'zustand'
import { FormativeTemplate } from '../../../../../shared/types'

interface FormativeTemplatesState {
  templates: FormativeTemplate[]
  isLoading: boolean
  error: string | null

  fetchTemplates: () => Promise<void>
  createTemplate: (data: Omit<FormativeTemplate, 'id'>) => Promise<void>
  updateTemplate: (id: string, data: Partial<FormativeTemplate>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
}

export const useFormativeTemplatesStore = create<FormativeTemplatesState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getFormativeTemplates()
      set({ templates: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch templates', isLoading: false })
      console.error(error)
    }
  },

  createTemplate: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await api.createFormativeTemplate(data)
      await get().fetchTemplates()
    } catch (error) {
      set({ error: 'Failed to create template', isLoading: false })
      throw error
    }
  },

  updateTemplate: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      await api.updateFormativeTemplate(id, data)
      await get().fetchTemplates()
    } catch (error) {
      set({ error: 'Failed to update template', isLoading: false })
      throw error
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await api.deleteFormativeTemplate(id)
      await get().fetchTemplates()
    } catch (error) {
      set({ error: 'Failed to delete template', isLoading: false })
      throw error
    }
  }
}))
