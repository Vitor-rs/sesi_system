import { create } from 'zustand'

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
  // UI State
  activeTab: 'personalization' | 'profile' | 'backup' | 'security'
  setActiveTab: (tab: 'personalization' | 'profile' | 'backup' | 'security') => void
  resetMessages: () => void

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

export const useSettingsStore = create<SettingsState>((set) => ({
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
  isSudoUnlocked: true, // Default to unlocked
  sudoPassword: '',
  sudoError: null,
  lastSudoInteraction: Date.now(), // Initialize with current time to start 5min timer correctly
  setIsSudoUnlocked: (isUnlocked) => set({ isSudoUnlocked: isUnlocked }),
  setSudoPassword: (password) => set({ sudoPassword: password }),
  setSudoError: (error) => set({ sudoError: error }),
  setLastSudoInteraction: (timestamp) => set({ lastSudoInteraction: timestamp }),
  refreshSudoTimer: () => set({ lastSudoInteraction: Date.now() })
}))
