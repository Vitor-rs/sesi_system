import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { registerHandlers } from './ipc/handlers'
import { initDb } from './db/client'
import { runMigrations } from './db/migrator'
import { seedDatabase } from './db/seed'

import { SettingsService } from './services/SettingsService'
import { appConfig } from './config'
import { existsSync, unlinkSync } from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false, // Wait for ready-to-show
    autoHideMenuBar: true,
    backgroundColor: '#111827', // Match bg-gray-900 to prevent white flash
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Maximize if configured (but don't show yet)
  // CRITICAL FIX: Do NOT call maximize() here. It forces the window to show immediately on some platforms/configs.
  // We move this logic to the 'app-ready' event.

  // Open DevTools if configured
  if (appConfig.development.openDevTools) {
    mainWindow.webContents.openDevTools()
  }

  // Fallback: If renderer fails to signal in 5s, show anyway to avoid zombie process
  const fallbackTimeout = setTimeout(() => {
    if (!mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      console.warn('Renderer took too long to signal readiness. Showing window via fallback.')
      mainWindow.show()
    }
  }, 5000)

  // Handshake Protocol: Only show window when Renderer says it's ready (and screen is dark)
  ipcMain.on('app-ready', () => {
    clearTimeout(fallbackTimeout) // Success! Cancel the fallback
    if (!mainWindow.isVisible()) {
      // Apply maximization JUST before showing
      if (appConfig.window.startMaximized) {
        mainWindow.maximize()
      }
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
app.whenReady().then(() => {
  // Set app user model id for windows
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.sistema_sesi.app')
  }

  // Check for --reset-db flag
  if (process.argv.includes('--reset-db')) {
    const dbPath = join(app.getPath('userData'), 'sistema_sesi.db')
    if (existsSync(dbPath)) {
      try {
        console.log('[Main] Resetting database...')
        unlinkSync(dbPath)
        console.log('[Main] Database deleted.')
      } catch (error) {
        console.error('[Main] Failed to delete database:', error)
      }
    }
  }

  initDb()
  runMigrations()
  seedDatabase().catch((err) => console.error(err))
  registerHandlers()

  // Load Custom Icon if exists
  SettingsService.get('app_icon_path').then((iconPath) => {
    if (iconPath && existsSync(iconPath)) {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.setIcon(iconPath)
      }
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
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
