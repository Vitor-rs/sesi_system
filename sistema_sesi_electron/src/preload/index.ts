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

  // Backup
  detectBackups: () => ipcRenderer.invoke('settings:detectBackups'),
  createBackup: (customPath?: string) => ipcRenderer.invoke('settings:createBackup', customPath),
  selectBackupFolder: () => ipcRenderer.invoke('settings:selectBackupFolder')
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
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
