/// <reference types="vite/client" />

import { Student, Class, BackupProvider } from '../../shared/types'

interface Api {
  // Students
  getStudents: () => Promise<Student[]>
  getStudentById: (id: string) => Promise<Student | undefined>
  createStudent: (data: unknown) => Promise<Student>
  updateStudent: (id: string, data: unknown) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
  addStudentHistory: (data: unknown) => Promise<void>

  // Classes
  getClasses: () => Promise<Class[]>
  createClass: (data: unknown) => Promise<Class>
  updateClass: (id: string, data: unknown) => Promise<void>
  deleteClass: (id: string) => Promise<void>

  // Settings
  getSettings: (key: string) => Promise<string | null>
  uploadIcon: (buffer: ArrayBuffer, fileName: string) => Promise<{ success: boolean; path: string }>
  getIcons: () => Promise<Array<{ name: string; path: string; preview: string }>>
  applyIcon: (path: string) => Promise<{ success: boolean }>
  saveWelcomeImage: (path: string) => Promise<{ success: boolean }>

  // Backup
  detectBackups: () => Promise<BackupProvider[]>
  createBackup: (customPath?: string) => Promise<{ success: boolean; paths: string[] }>
  selectBackupFolder: () => Promise<string | null>
  openPath: (path: string) => Promise<{ success: boolean; error?: string; code?: string }>
  // Security
  setPassword: (password: string) => Promise<{ success: boolean }>
  verifyPassword: (password: string) => Promise<boolean>
  getSecurityStatus: () => Promise<{
    isEnabled: boolean
    hasRecoveryKit: boolean
    autoLockTimeout: number
  }>
  generateRecoveryKit: () => Promise<string>
  verifyRecoveryCode: (code: string) => Promise<boolean>
  setAutoLock: (minutes: number) => Promise<{ success: boolean }>
  disableSecurity: () => Promise<boolean>
  appReady: () => void
}

declare global {
  interface Window {
    electron: import('@electron-toolkit/preload').ElectronAPI
    api: Api
  }
  var api: Api
}
