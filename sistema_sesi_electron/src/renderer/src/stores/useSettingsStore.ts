import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SecurityStatus {
  isEnabled: boolean
  hasRecoveryKit: boolean
  autoLockTimeout: number
}

interface SettingsState {
  schoolYearStart: string // ISO Date String
  schoolYearEnd: string // ISO Date String
  setSchoolYear: (start: string, end: string) => void

  // Security State
  securityStatus: SecurityStatus
  setSecurityStatus: (status: SecurityStatus) => void

  // UI State for Security Tab
  isSudoUnlocked: boolean
  setIsSudoUnlocked: (unlocked: boolean) => void

  activeSecurityAccordion: string | null
  setActiveSecurityAccordion: (accordion: string | null) => void

  isSettingPassword: boolean
  setIsSettingPassword: (isSetting: boolean) => void

  securityMessage: { type: 'success' | 'error'; text: string } | null
  setSecurityMessage: (message: { type: 'success' | 'error'; text: string } | null) => void

  lastSudoInteraction: number
  setLastSudoInteraction: (timestamp: number) => void

  // Sudo Error
  sudoError: string | null
  setSudoError: (error: string | null) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Defaults
      schoolYearStart: '2025-02-03T00:00:00.000Z',
      schoolYearEnd: '2025-12-19T00:00:00.000Z',
      setSchoolYear: (start, end): void => {
        set({ schoolYearStart: start, schoolYearEnd: end })
      },

      securityStatus: {
        isEnabled: false,
        hasRecoveryKit: false,
        autoLockTimeout: 0
      },
      setSecurityStatus: (status): void => {
        set({ securityStatus: status })
      },

      isSudoUnlocked: false,
      setIsSudoUnlocked: (unlocked): void => {
        set({ isSudoUnlocked: unlocked })
      },

      activeSecurityAccordion: null,
      setActiveSecurityAccordion: (accordion): void => {
        set({ activeSecurityAccordion: accordion })
      },

      isSettingPassword: false,
      setIsSettingPassword: (isSetting): void => {
        set({ isSettingPassword: isSetting })
      },

      securityMessage: null,
      setSecurityMessage: (message): void => {
        set({ securityMessage: message })
      },

      lastSudoInteraction: 0,
      setLastSudoInteraction: (timestamp): void => {
        set({ lastSudoInteraction: timestamp })
      },

      sudoError: null,
      setSudoError: (error): void => {
        set({ sudoError: error })
      }
    }),
    {
      name: 'sesi-settings-storage',
      partialize: (state) => ({
        schoolYearStart: state.schoolYearStart,
        schoolYearEnd: state.schoolYearEnd
        // Do NOT persist isSudoUnlocked or transient UI states
      })
    }
  )
)
