/// <reference types="vite/client" />

import { Student, Class } from '../../shared/types'

interface Api {
  // Students
  getStudents: () => Promise<Student[]>
  createStudent: (data: unknown) => Promise<Student>
  updateStudent: (id: string, data: unknown) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
  addStudentHistory: (data: unknown) => Promise<void>

  // Classes
  getClasses: () => Promise<Class[]>
  createClass: (data: unknown) => Promise<Class>
  updateClass: (id: string, data: unknown) => Promise<void>
  deleteClass: (id: string) => Promise<void>
}

declare global {
  interface Window {
    electron: import('@electron-toolkit/preload').ElectronAPI
    api: Api
  }
}
