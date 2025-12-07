import { ipcMain } from 'electron'
import { StudentService } from '../services/StudentService'

export function registerHandlers(): void {
  ipcMain.handle('students:getAll', async () => {
    return StudentService.getAll()
  })

  ipcMain.handle('students:create', async (_event, data) => {
    return StudentService.create(data)
  })
}
