import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  isLocked: boolean
  isAuthenticated: boolean
  securityEnabled: boolean
  autoLockTimeout: number
  setLocked: (locked: boolean) => void
  setAuthenticated: (auth: boolean) => void
  setSecurityEnabled: (enabled: boolean) => void
  setAutoLockTimeout: (timeout: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLocked: true,
      isAuthenticated: false,
      securityEnabled: false,
      autoLockTimeout: 0,
      setLocked: (locked): void => {
        set({ isLocked: locked })
      },
      setAuthenticated: (auth): void => {
        set({ isAuthenticated: auth })
      },
      setSecurityEnabled: (enabled): void => {
        set({ securityEnabled: enabled })
      },
      setAutoLockTimeout: (timeout): void => {
        set({ autoLockTimeout: timeout })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
