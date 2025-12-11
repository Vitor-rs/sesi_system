import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  isReadOnly: boolean
  sourceTeacherName: string | null
  originalDataBackup: string | null // JSON string of original state (simple implementation)

  enterReadOnlyMode: (teacherName: string, externalData?: unknown) => void
  exitReadOnlyMode: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isReadOnly: false,
      sourceTeacherName: null,
      originalDataBackup: null,

      enterReadOnlyMode: (teacherName) => {
        // In a real implementation with persisted DB (SQLite/IndexedDB),
        // we would swap the DB connection or namespace.
        // For this store-based prototype, we act as a flag manager.
        // The actual data hydration logic needs to happen in the component or via a global hydration service.
        set({
          isReadOnly: true,
          sourceTeacherName: teacherName
          // We assume the caller handles the actual data replacement in other stores
        })
      },

      exitReadOnlyMode: () => {
        set({
          isReadOnly: false,
          sourceTeacherName: null
          // Caller handles data restoration
        })
      }
    }),
    {
      name: 'sesi-session-storage'
    }
  )
)
