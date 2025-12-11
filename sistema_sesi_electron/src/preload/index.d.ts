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

  // Formative Templates
  getFormativeTemplates: () => Promise<
    Omit<import('../shared/types').FormativeTemplate, 'id' & { id: string }>[]
  >
  createFormativeTemplate: (data: unknown) => Promise<void>
  updateFormativeTemplate: (id: string, data: unknown) => Promise<void>
  deleteFormativeTemplate: (id: string) => Promise<void>

  // Grades & Formatives instances
  getGrades: (
    classDisciplineId: string,
    bimester: number
  ) => Promise<import('../shared/types').Grade[]>
  saveGrade: (data: unknown) => Promise<void>

  getFormativeInstances: (
    classDisciplineId: string,
    bimester: number
  ) => Promise<import('../shared/types').FormativeInstance[]>
  createFormativeInstance: (data: unknown) => Promise<import('../shared/types').FormativeInstance>
  updateFormativeInstance: (id: string, data: unknown) => Promise<void>
  deleteFormativeInstance: (id: string) => Promise<void>

  getFormativeEntries: (
    formativeInstanceId: string
  ) => Promise<import('../shared/types').FormativeEntry[]>
  saveFormativeEntry: (data: unknown) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SesiApi
  }
}
