import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type IconData = {
  name: string
  path: string
  preview: string
}

export type BackupLocation = {
  provider: 'onedrive' | 'googledrive' | 'local'
  path: string
  isAvailable: boolean
}

export type SecurityStatus = {
  isEnabled: boolean
  hasRecoveryKit: boolean
  autoLockTimeout: number
}

interface SettingsState {
  // Global Settings
  teacherProfile: 'pedagogue' | 'specialist'
  setTeacherProfile: (profile: 'pedagogue' | 'specialist') => void
  schoolYearStart: string // ISO Date String
  schoolYearEnd: string // ISO Date String
  setSchoolYear: (start: string, end: string) => void

  // UI State
  activeTab: 'personalization' | 'profile' | 'backup' | 'security' | 'templates' | 'registers'
  setActiveTab: (
    tab: 'personalization' | 'profile' | 'backup' | 'security' | 'templates' | 'registers'
  ) => void
  resetMessages: () => void

  // Archiving Reasons
  archivingReasons: string[]
  addArchivingReason: (reason: string) => void
  removeArchivingReason: (reason: string) => void
  setArchivingReasons: (reasons: string[]) => void

  // Icon State
  icons: IconData[]
  currentIconPath: string | null
  selectedIconPath: string | null
  isUploading: boolean
  uploadMessage: { type: 'success' | 'error'; text: string } | null
  setIcons: (icons: IconData[]) => void
  setCurrentIconPath: (path: string | null) => void
  setSelectedIconPath: (path: string | null) => void
  setIsUploading: (isUploading: boolean) => void
  setUploadMessage: (message: { type: 'success' | 'error'; text: string } | null) => void

  // Splash Screen State
  welcomeImage: string | null
  setWelcomeImage: (path: string | null) => void

  // Backup State
  backupLocations: BackupLocation[]
  selectedDrivePath: string | null // For Google Drive selection
  isBackingUp: boolean
  isScanning: boolean
  backupMessage: string | null
  customBackupPath: string | null
  setBackupLocations: (locations: BackupLocation[]) => void
  setSelectedDrivePath: (path: string | null) => void
  setIsBackingUp: (isBackingUp: boolean) => void
  setIsScanning: (isScanning: boolean) => void
  setBackupMessage: (message: string | null) => void
  setCustomBackupPath: (path: string | null) => void

  // Security State
  securityStatus: SecurityStatus
  activeSecurityAccordion: string | null
  isSettingPassword: boolean
  securityMessage: { type: 'success' | 'error'; text: string } | null
  setSecurityStatus: (status: SecurityStatus) => void
  setActiveSecurityAccordion: (id: string | null) => void
  setIsSettingPassword: (isSetting: boolean) => void
  setSecurityMessage: (message: { type: 'success' | 'error'; text: string } | null) => void

  // Sudo Mode State
  isSudoUnlocked: boolean
  sudoPassword: string
  sudoError: string | null
  lastSudoInteraction: number
  setIsSudoUnlocked: (isUnlocked: boolean) => void
  setSudoPassword: (password: string) => void
  setSudoError: (error: string | null) => void
  setLastSudoInteraction: (timestamp: number) => void
  refreshSudoTimer: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Defaults
      teacherProfile: 'pedagogue',
      setTeacherProfile: (profile) => set({ teacherProfile: profile }),
      schoolYearStart: '2025-02-03T00:00:00.000Z',
      schoolYearEnd: '2025-12-19T00:00:00.000Z',
      setSchoolYear: (start, end) => set({ schoolYearStart: start, schoolYearEnd: end }),

      // UI State
      activeTab: 'personalization',
      setActiveTab: (tab) => set({ activeTab: tab }),
      resetMessages: () =>
        set({
          uploadMessage: null,
          backupMessage: null,
          securityMessage: null,
          sudoError: null
        }),

      // Archiving Reasons
      archivingReasons: ['Transferência para outra escola', 'Mudança de cidade'],
      addArchivingReason: (reason) =>
        set((state) => ({ archivingReasons: [...state.archivingReasons, reason] })),
      removeArchivingReason: (reason) =>
        set((state) => ({
          archivingReasons: state.archivingReasons.filter((r) => r !== reason)
        })),
      setArchivingReasons: (reasons) => set({ archivingReasons: reasons }),

      // Icon State
      icons: [],
      currentIconPath: null,
      selectedIconPath: null,
      isUploading: false,
      uploadMessage: null,
      setIcons: (icons) => set({ icons }),
      setCurrentIconPath: (path) => set({ currentIconPath: path }),
      setSelectedIconPath: (path) => set({ selectedIconPath: path }),
      setIsUploading: (isUploading) => set({ isUploading }),
      setUploadMessage: (message) => set({ uploadMessage: message }),

      // Splash Screen State
      welcomeImage: null,
      setWelcomeImage: (path) => set({ welcomeImage: path }),

      // Backup State
      backupLocations: [],
      selectedDrivePath: null,
      isBackingUp: false,
      isScanning: false,
      backupMessage: null,
      customBackupPath: null,
      setBackupLocations: (locations) => set({ backupLocations: locations }),
      setSelectedDrivePath: (path) => set({ selectedDrivePath: path }),
      setIsBackingUp: (isBackingUp) => set({ isBackingUp: isBackingUp }),
      setIsScanning: (isScanning) => set({ isScanning }),
      setBackupMessage: (message) => set({ backupMessage: message }),
      setCustomBackupPath: (path) => set({ customBackupPath: path }),

      // Security State
      securityStatus: {
        isEnabled: false,
        hasRecoveryKit: false,
        autoLockTimeout: 0
      },
      activeSecurityAccordion: null,
      isSettingPassword: false,
      securityMessage: null,
      setSecurityStatus: (status) => set({ securityStatus: status }),
      setActiveSecurityAccordion: (id) => set({ activeSecurityAccordion: id }),
      setIsSettingPassword: (isSetting) => set({ isSettingPassword: isSetting }),
      setSecurityMessage: (message) => set({ securityMessage: message }),

      // Sudo Mode State
      isSudoUnlocked: false, // Default locked
      sudoPassword: '',
      sudoError: null,
      lastSudoInteraction: 0,
      setIsSudoUnlocked: (isUnlocked) => set({ isSudoUnlocked: isUnlocked }),
      setSudoPassword: (password) => set({ sudoPassword: password }),
      setSudoError: (error) => set({ sudoError: error }),
      setLastSudoInteraction: (timestamp) => set({ lastSudoInteraction: timestamp }),
      refreshSudoTimer: () => set({ lastSudoInteraction: Date.now() })
    }),
    {
      name: 'sesi-settings-storage',
      partialize: (state) => ({
        teacherProfile: state.teacherProfile,
        schoolYearStart: state.schoolYearStart,
        schoolYearEnd: state.schoolYearEnd,
        archivingReasons: state.archivingReasons,
        activeTab: state.activeTab,
        currentIconPath: state.currentIconPath,
        selectedIconPath: state.selectedIconPath,
        welcomeImage: state.welcomeImage,
        backupLocations: state.backupLocations,
        customBackupPath: state.customBackupPath
        // securityStatus is NOT persisted to avoid stale locking state.
        // It is always fetched fresh from the backend on mount.
        // Exclude transient states:
        // isSudoUnlocked, sudoPassword, sudoError, etc.
      })
    }
  )
)
