import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getStudents: () => ipcRenderer.invoke('students:getAll'),
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
  appReady: () => ipcRenderer.send('app-ready')
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
