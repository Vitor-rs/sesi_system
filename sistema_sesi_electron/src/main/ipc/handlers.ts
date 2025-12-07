import { ipcMain } from 'electron'
import { StudentService } from '../services/StudentService'
import { ClassService } from '../services/ClassService'

export function registerHandlers(): void {
  ipcMain.handle('students:getAll', async () => {
    return StudentService.getAll()
  })

  ipcMain.handle('students:getById', async (_event, id) => {
    return StudentService.getById(id)
  })

  ipcMain.handle('students:create', async (_event, data) => {
    return StudentService.create(data)
  })

  ipcMain.handle('students:update', async (_event, { id, data }) => {
    return StudentService.update(id, data)
  })

  ipcMain.handle('students:delete', async (_event, id) => {
    return StudentService.delete(id)
  })

  ipcMain.handle('students:addHistory', async (_event, data) => {
    return StudentService.addHistory(data)
  })

  // Classes
  ipcMain.handle('classes:getAll', async () => {
    return ClassService.getAll()
  })

  ipcMain.handle('classes:create', async (_event, data) => {
    return ClassService.create(data)
  })

  ipcMain.handle('classes:update', async (_event, { id, data }) => {
    return ClassService.update(id, data)
  })

  ipcMain.handle('classes:delete', async (_event, id) => {
    return ClassService.delete(id)
  })
}
