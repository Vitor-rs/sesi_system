import { create } from 'zustand'
import { Discipline } from '../../../../../shared/types'

interface DisciplinesState {
  disciplines: Discipline[]
  isLoading: boolean
  error: string | null

  fetchDisciplines: () => Promise<void>
  addDiscipline: (data: Omit<Discipline, 'id'>) => Promise<void>
  updateDiscipline: (id: string, data: Partial<Discipline>) => Promise<void>
  deleteDiscipline: (id: string) => Promise<void>
}

export const useDisciplinesStore = create<DisciplinesState>((set) => ({
  disciplines: [],
  isLoading: false,
  error: null,

  fetchDisciplines: async () => {
    set({ isLoading: true, error: null })
    try {
      const result = await api.getDisciplines()
      set({ disciplines: result, isLoading: false })
    } catch (error) {
      console.error(error)
      set({ error: 'Erro ao carregar disciplinas', isLoading: false })
    }
  },

  addDiscipline: async (discipline) => {
    set({ isLoading: true, error: null })
    try {
      const newDiscipline = await api.createDiscipline(discipline)
      set((state) => ({
        disciplines: [...state.disciplines, newDiscipline],
        isLoading: false
      }))
    } catch (error) {
      console.error(error)
      set({ error: 'Erro ao criar disciplina', isLoading: false })
    }
  },

  updateDiscipline: async (id, discipline) => {
    set({ isLoading: true, error: null })
    try {
      await api.updateDiscipline(id, discipline)
      const updated = await api.getDisciplines()
      set({ disciplines: updated, isLoading: false })
    } catch (error) {
      console.error(error)
      set({ error: 'Erro ao atualizar disciplina', isLoading: false })
    }
  },

  deleteDiscipline: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await api.deleteDiscipline(id)
      set((state) => ({
        disciplines: state.disciplines.filter((d) => d.id !== id),
        isLoading: false
      }))
    } catch (error) {
      console.error(error)
      set({ error: 'Erro ao excluir disciplina', isLoading: false })
    }
  }
}))
