import { ElectronAPI } from '@electron-toolkit/preload'
import { Student, Class, BackupProvider } from '../shared/types'
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
  detectBackups: () => Promise<BackupProvider[]>
  createBackup: (customPath?: string) => Promise<{ success: boolean; paths: string[] }>
  selectBackupFolder: () => Promise<string | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SesiApi
  }
}
