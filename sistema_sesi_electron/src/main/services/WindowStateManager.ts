import { app, BrowserWindow, screen } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface WindowState {
  width: number
  height: number
  x?: number
  y?: number
  isMaximized: boolean
}

export class WindowStateManager {
  private readonly path: string
  private state: WindowState
  private timeoutId: NodeJS.Timeout | null = null

  constructor() {
    this.path = join(app.getPath('userData'), 'window-state.json')
    this.state = this.loadState()
  }

  private loadState(): WindowState {
    try {
      if (existsSync(this.path)) {
        const data = JSON.parse(readFileSync(this.path, 'utf-8'))
        return this.validateState(data)
      }
    } catch {
      // Ignore errors
    }
    return {
      width: 1200,
      height: 800,
      isMaximized: false
    }
  }

  private validateState(data: unknown): WindowState {
    if (typeof data !== 'object' || data === null) {
      return { width: 1200, height: 800, isMaximized: false }
    }

    const state = data as Record<string, unknown>

    const isValid =
      typeof state.width === 'number' &&
      typeof state.height === 'number' &&
      typeof state.isMaximized === 'boolean'

    if (!isValid) {
      return { width: 1200, height: 800, isMaximized: false }
    }

    const validState = state as unknown as WindowState

    // Check if bounds are within current screens
    // If window is off-screen, reset to center
    if (typeof validState.x === 'number' && typeof validState.y === 'number') {
      const isVisible = screen.getAllDisplays().some((display) => {
        return (
          validState.x! >= display.bounds.x &&
          validState.x! < display.bounds.x + display.bounds.width &&
          validState.y! >= display.bounds.y &&
          validState.y! < display.bounds.y + display.bounds.height
        )
      })
      if (!isVisible) {
        return { width: 1200, height: 800, isMaximized: false }
      }
    }

    return validState
  }

  public manage(window: BrowserWindow): void {
    if (this.state.isMaximized) {
      window.maximize()
    } else {
      const bounds: Partial<Electron.Rectangle> = {
        width: this.state.width,
        height: this.state.height
      }

      if (typeof this.state.x === 'number') bounds.x = this.state.x
      if (typeof this.state.y === 'number') bounds.y = this.state.y

      window.setBounds(bounds)
    }

    const saveHandler = (): void => {
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        try {
          if (!window.isDestroyed()) {
            const bounds = window.getBounds()
            const isMaximized = window.isMaximized()
            this.state = {
              width: bounds.width,
              height: bounds.height,
              x: bounds.x,
              y: bounds.y,
              isMaximized
            }
            writeFileSync(this.path, JSON.stringify(this.state))
          }
        } catch {
          // Ignore save errors
        }
      }, 1000) // Debounce 1s
    }

    window.on('resize', saveHandler)
    window.on('move', saveHandler)
    window.on('close', saveHandler)
  }
}
