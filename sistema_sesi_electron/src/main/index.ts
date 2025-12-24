import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import icon from '../../resources/icon.png?asset'
// Trigger rebuild
import { registerHandlers } from './ipc/handlers'
import { initDb } from './db/client'
import { runMigrations } from './db/migrator'
import { seedDatabase } from './db/seed'

import { SettingsService } from './services/SettingsService'
import { appConfig } from './config'
import { existsSync, unlinkSync } from 'node:fs'
import { logger } from './services/LoggerService'

import { WindowStateManager } from './services/WindowStateManager'

function createWindow(): void {
  // Restore window state
  const windowState = new WindowStateManager()

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200, // Default fallback
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false, // Wait for ready-to-show
    autoHideMenuBar: true,
    backgroundColor: '#F9FAFB', // Match bg-gray-50 to prevent dark flash on resize
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Manage window state (restore size/position and save on change)
  windowState.manage(mainWindow)

  // Open DevTools if configured
  if (appConfig.development.openDevTools) {
    mainWindow.webContents.openDevTools()
  }

  // Fallback: If renderer fails to signal in 5s, show anyway to avoid zombie process
  const fallbackTimeout = setTimeout(() => {
    if (!mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      logger.warn('Renderer took too long to signal readiness. Showing window via fallback.')
      mainWindow.show()
    }
  }, 5000)

  // Handshake Protocol: Only show window when Renderer says it's ready (and screen is dark)
  ipcMain.on('app-ready', () => {
    clearTimeout(fallbackTimeout) // Success! Cancel the fallback
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
  })

  mainWindow.on('ready-to-show', () => {
    // We do NOTHING here related to visibility.
    // We wait for 'app-ready'.
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Disable Hardware Acceleration to prevent rendering glitches/white flash
app.commandLine.appendSwitch('disable-http-cache')
app.disableHardwareAcceleration()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
async function bootstrap(): Promise<void> {
  try {
    await app.whenReady()

    // NOSONAR
    // Set app user model id for windows
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.sistema_sesi.app')
    }

    // Check for --reset-db flag
    if (process.argv.includes('--reset-db')) {
      const dbPath = join(app.getPath('userData'), 'sistema_sesi.db')
      if (existsSync(dbPath)) {
        try {
          logger.info('[Main] Resetting database...')
          unlinkSync(dbPath)
          logger.info('[Main] Database deleted.')
        } catch (error) {
          logger.error('[Main] Failed to delete database:', error)
        }
      }
    }

    initDb()
    runMigrations()
    await seedDatabase()
    registerHandlers()

    // Load Custom Icon if exists
    try {
      const iconPath = await SettingsService.get('app_icon_path')
      if (iconPath && existsSync(iconPath)) {
        const win = BrowserWindow.getAllWindows()[0]
        if (win) {
          win.setIcon(iconPath)
        }
      }
    } catch (error) {
      logger.error('Failed to load custom icon:', error)
    }

    // IPC test
    ipcMain.on('ping', () => logger.debug('pong'))

    createWindow()
  } catch (error) {
    logger.error('Failed to initialize app:', error)
  }
}

bootstrap() // NOSONAR

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
