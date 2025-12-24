import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Students
  getStudents: () => ipcRenderer.invoke('students:getAll'),
  getStudentsByClass: (classId: string) => ipcRenderer.invoke('students:getByClass', classId),
  getStudentById: (id: string) => ipcRenderer.invoke('students:getById', id),
  createStudent: (data: unknown) => ipcRenderer.invoke('students:create', data),
  updateStudent: (id: string, data: unknown) => ipcRenderer.invoke('students:update', { id, data }),
  deleteStudent: (id: string) => ipcRenderer.invoke('students:delete', id),
  addStudentHistory: (data: unknown) => ipcRenderer.invoke('students:addHistory', data),

  // Classes
  getClasses: () => ipcRenderer.invoke('classes:getAll'),
  createClass: (data: unknown) => ipcRenderer.invoke('classes:create', data),
  updateClass: (id: string, data: unknown) => ipcRenderer.invoke('classes:update', { id, data }),
  deleteClass: (id: string) => ipcRenderer.invoke('classes:delete', id),

  // Disciplines
  getDisciplines: () => ipcRenderer.invoke('disciplines:getAll'),
  createDiscipline: (data: unknown) => ipcRenderer.invoke('disciplines:create', data),
  updateDiscipline: (id: string, data: unknown) =>
    ipcRenderer.invoke('disciplines:update', { id, data }),
  deleteDiscipline: (id: string) => ipcRenderer.invoke('disciplines:delete', id),

  // Class Disciplines
  getClassDisciplines: (classId: string) =>
    ipcRenderer.invoke('classDisciplines:getByClass', classId),
  createClassDiscipline: (data: unknown) => ipcRenderer.invoke('classDisciplines:create', data),
  deleteClassDiscipline: (id: string) => ipcRenderer.invoke('classDisciplines:delete', id),

  // Formative Templates
  getFormativeTemplates: () => ipcRenderer.invoke('formativeTemplates:getAll'),
  createFormativeTemplate: (data: unknown) => ipcRenderer.invoke('formativeTemplates:create', data),
  updateFormativeTemplate: (id: string, data: unknown) =>
    ipcRenderer.invoke('formativeTemplates:update', { id, data }),
  deleteFormativeTemplate: (id: string) => ipcRenderer.invoke('formativeTemplates:delete', id),

  // Grades & Assessments
  getGrades: (classDisciplineId: string, bimester: number) =>
    ipcRenderer.invoke('grades:getAll', { classDisciplineId, bimester }),
  updateGrade: (studentId: string, assessmentId: string, value: number | null) =>
    ipcRenderer.invoke('grades:update', { studentId, assessmentId, value }),
  getFixedAssessments: (classDisciplineId: string, bimester: number) =>
    ipcRenderer.invoke('fixedAssessments:getAll', { classDisciplineId, bimester }),
  getFormativeInstances: (classDisciplineId: string, bimester: number) =>
    ipcRenderer.invoke('formativeInstances:getAll', { classDisciplineId, bimester }),
  getFormativeEntries: (assessmentId: string) =>
    ipcRenderer.invoke('formativeEntries:getAll', assessmentId),

  // Settings
  getSettings: (key: string) => ipcRenderer.invoke('settings:get', key),
  uploadIcon: (buffer: ArrayBuffer, fileName: string) =>
    ipcRenderer.invoke('settings:uploadIcon', { buffer, fileName }),
  getIcons: () => ipcRenderer.invoke('settings:getIcons'),
  applyIcon: (path: string) => ipcRenderer.invoke('settings:applyIcon', path),
  saveWelcomeImage: (path: string) => ipcRenderer.invoke('settings:saveWelcomeImage', path),

  // Backup
  detectBackups: () => ipcRenderer.invoke('settings:detectBackups'),
  createBackup: (additionalPaths: string[] = []) =>
    ipcRenderer.invoke('settings:createBackup', additionalPaths),
  selectBackupFolder: () => ipcRenderer.invoke('settings:selectBackupFolder'),
  openPath: (path: string) => ipcRenderer.invoke('settings:openPath', path),

  // Security
  setPassword: (password: string) => ipcRenderer.invoke('security:setPassword', password),
  verifyPassword: (password: string) => ipcRenderer.invoke('security:verifyPassword', password),
  getSecurityStatus: () => ipcRenderer.invoke('security:getStatus'),
  generateRecoveryKit: () => ipcRenderer.invoke('security:generateRecoveryKit'),
  verifyRecoveryCode: (code: string) => ipcRenderer.invoke('security:verifyRecoveryCode', code),
  setAutoLock: (minutes: number) => ipcRenderer.invoke('security:setAutoLock', minutes),
  disableSecurity: () => ipcRenderer.invoke('security:disable'),

  // Lifecycle
  appReady: () => ipcRenderer.send('app-ready'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  globalThis.window.electron = electronAPI
  // @ts-ignore (define in dts)
  globalThis.window.api = api
}
