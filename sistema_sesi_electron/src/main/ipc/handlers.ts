import { ipcMain } from 'electron'
import { StudentService } from '../services/StudentService'
import { ClassService } from '../services/ClassService'
import { SettingsService } from '../services/SettingsService'
import { BackupService } from '../services/BackupService'
import { SecurityService } from '../services/SecurityService'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'fs'
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

  // Settings
  ipcMain.handle('settings:get', async (_event, key) => {
    return SettingsService.get(key)
  })

  ipcMain.handle('settings:uploadIcon', async (_event, { buffer, fileName }) => {
    try {
      const iconsDir = join(app.getPath('userData'), 'icons')
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true })
      }

      // Generate unique filename to preserve history
      const timestamp = Date.now()
      const ext = fileName.split('.').pop()
      const safeName = `icon-${timestamp}.${ext}`
      const iconPath = join(iconsDir, safeName)

      writeFileSync(iconPath, Buffer.from(buffer))

      return { success: true, path: iconPath }
    } catch (error) {
      console.error('Failed to upload icon:', error)
      throw error
    }
  })

  ipcMain.handle('settings:getIcons', async () => {
    try {
      const iconsDir = join(app.getPath('userData'), 'icons')
      if (!existsSync(iconsDir)) return []

      const files = readdirSync(iconsDir)
      return files
        .filter((file) => /\.(png|jpg|jpeg|ico)$/i.test(file))
        .map((file) => {
          const fullPath = join(iconsDir, file)
          const base64 = readFileSync(fullPath).toString('base64')
          return {
            name: file,
            path: fullPath,
            preview: `data:image/png;base64,${base64}` // Simplification: assuming png/jpg compatible
          }
        })
        .sort((a, b) => b.name.localeCompare(a.name)) // Newest first
    } catch (error) {
      console.error('Failed to get icons:', error)
      return []
    }
  })

  ipcMain.handle('settings:applyIcon', async (_event, iconPath) => {
    try {
      // 1. Update DB
      await SettingsService.set('app_icon_path', iconPath)

      // 2. Update Window
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.setIcon(iconPath)
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to apply icon:', error)
      throw error
    }
  })

  // Backup
  ipcMain.handle('settings:detectBackups', async () => {
    return BackupService.detectProviders()
  })

  ipcMain.handle('settings:createBackup', async (_event, additionalPaths: string[] = []) => {
    return BackupService.performBackup(additionalPaths)
  })

  ipcMain.handle('settings:selectBackupFolder', async () => {
    return BackupService.selectBackupFolder()
  })

  ipcMain.handle('settings:openPath', async (_event, path: string) => {
    if (!existsSync(path)) {
      return { success: false, code: 'NOT_FOUND' }
    }
    const error = await shell.openPath(path)
    return error ? { success: false, error } : { success: true }
  })

  // --- Security ---
  ipcMain.handle('security:setPassword', async (_, password: string) => {
    await SecurityService.setPassword(password)
    return { success: true }
  })

  ipcMain.handle('security:verifyRecoveryCode', async (_, code: string) => {
    return SecurityService.verifyRecoveryCode(code)
  })

  ipcMain.handle('security:verifyPassword', async (_, password: string) => {
    return await SecurityService.verifyPassword(password)
  })

  ipcMain.handle('security:getStatus', async () => {
    return await SecurityService.getStatus()
  })

  ipcMain.handle('security:generateRecoveryKit', async () => {
    return await SecurityService.generateRecoveryKit()
  })

  ipcMain.handle('security:setAutoLock', async (_, minutes: number) => {
    await SecurityService.setAutoLock(minutes)
    return { success: true }
  })

  ipcMain.handle('security:disable', async () => {
    await SecurityService.disableSecurity()
    return true
  })
}
