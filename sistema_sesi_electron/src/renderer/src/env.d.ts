/// <reference types="vite/client" />

import {
  Student,
  Class,
  Discipline,
  FormativeTemplate,
  ClassDiscipline,
  BackupProvider
} from '../../shared/types'

interface Api {
  // Students
  getStudents: () => Promise<Student[]>
  getStudentsByClass: (classId: string) => Promise<Student[]>
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

  // Disciplines
  getDisciplines: () => Promise<Discipline[]>
  createDiscipline: (data: unknown) => Promise<Discipline>
  updateDiscipline: (id: string, data: unknown) => Promise<void>
  deleteDiscipline: (id: string) => Promise<void>

  // Class Disciplines
  getClassDisciplines: (classId: string) => Promise<ClassDiscipline[]>
  createClassDiscipline: (data: unknown) => Promise<ClassDiscipline>
  deleteClassDiscipline: (id: string) => Promise<void>

  // Formative Templates
  getFormativeTemplates: () => Promise<FormativeTemplate[]>
  createFormativeTemplate: (data: unknown) => Promise<FormativeTemplate>
  updateFormativeTemplate: (id: string, data: unknown) => Promise<void>
  deleteFormativeTemplate: (id: string) => Promise<void>

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
  maximizeWindow: () => Promise<boolean>

  // Grades & Assessments
  getGrades: (
    classDisciplineId: string,
    bimester: number
  ) => Promise<import('../../shared/types').GradeEntry[]>
  updateGrade: (studentId: string, assessmentId: string, value: number | null) => Promise<void>
  getFixedAssessments: (
    classDisciplineId: string,
    bimester: number
  ) => Promise<
    {
      id: string
      name: string
      type: 'av1' | 'av2' | 'av3_simple' | 'av3_composite' | 'recuperacao'
      maxPoints: number
    }[]
  >

  getFormativeInstances: (
    classDisciplineId: string,
    bimester: number
  ) => Promise<import('../../shared/types').FormativeInstance[]>
  createFormativeInstance: (
    data: unknown
  ) => Promise<import('../../shared/types').FormativeInstance>
  updateFormativeInstance: (id: string, data: unknown) => Promise<void>
  deleteFormativeInstance: (id: string) => Promise<void>

  getFormativeEntries: (
    assessmentId: string
  ) => Promise<import('../../shared/types').FormativeEntry[]>
  saveFormativeEntry: (data: unknown) => Promise<void>
}

declare global {
  interface Window {
    electron: import('@electron-toolkit/preload').ElectronAPI
    api: Api
  }
  var api: Api
}
