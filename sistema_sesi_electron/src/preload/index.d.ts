import { ElectronAPI } from '@electron-toolkit/preload'
import { Student, Class } from '../shared/types'
interface SesiApi {
  // Students
  getStudents: () => Promise<Student[]>
  getStudentById: (id: string) => Promise<Student | undefined>
  createStudent: (data: unknown) => Promise<Student>
  updateStudent: (id: string, data: unknown) => Promise<Student>
  deleteStudent: (id: string) => Promise<void>
  addStudentHistory: (data: unknown) => Promise<void>

  // Classes
  getClasses: () => Promise<Class[]>
  createClass: (data: unknown) => Promise<Class>
  updateClass: (id: string, data: unknown) => Promise<Class>
  deleteClass: (id: string) => Promise<void>

  // Settings
  getSettings: (key: string) => Promise<string | null>
  uploadIcon: (buffer: ArrayBuffer, fileName: string) => Promise<{ success: boolean; path: string }>
  getIcons: () => Promise<Array<{ name: string; path: string; preview: string }>>
  applyIcon: (path: string) => Promise<{ success: boolean }>

  // Backup
  detectBackups: () => Promise<BackupLocation[]>
  createBackup: (additionalPaths?: string[]) => Promise<{ success: boolean; message: string }>
  selectBackupFolder: () => Promise<string | null>
  openPath: (path: string) => Promise<boolean>

  // Security
  setPassword: (password: string) => Promise<{ success: boolean }>
  verifyPassword: (password: string) => Promise<boolean>
  getSecurityStatus: () => Promise<{
    isEnabled: boolean
    hasRecoveryKit: boolean
    autoLockTimeout: number
  }>
  generateRecoveryKit: () => Promise<string>
  setAutoLock: (minutes: number) => Promise<{ success: boolean }>
  disableSecurity: () => Promise<boolean>
  appReady: () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SesiApi
  }
}
