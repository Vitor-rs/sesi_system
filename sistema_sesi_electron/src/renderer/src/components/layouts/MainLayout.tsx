import { useState, useEffect, ReactNode } from 'react'
import { LockScreen } from '../ui/LockScreen'
import { SplashScreen } from '../ui/SplashScreen'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  readonly children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [securitySettings, setSecuritySettings] = useState<{ isEnabled: boolean; timeout: number }>(
    {
      isEnabled: false,
      timeout: 0
    }
  )

  // Load settings on mount - CRITICAL: Blocks rendering until done
  useEffect(() => {
    const checkSecurity = async (): Promise<void> => {
      try {
        // We rely on the Cinematic Splash (4s) for the "waiting" feel.
        // No need for artificial delay here anymore.

        const status = await window.api.getSecurityStatus()
        setSecuritySettings({
          isEnabled: status.isEnabled,
          timeout: status.autoLockTimeout
        })

        // If enabled, lock immediately.
        if (status.isEnabled) {
          setIsLocked(true)
        }
      } catch (error) {
        console.error('Failed to load security status', error)
      } finally {
        // CRITICAL: Signal to Main process that we are painted and ready to be shown.
        // This removes the "White Flash" because Main waits for this.
        globalThis.window.api.appReady()
      }
      // NOTE: We do NOT set isLoading(false) here immediately anymore.
      // We wait for the SplashScreen onComplete to do it, to ensure the cinematic 4s duration.
    }
    checkSecurity()
  }, [])

  // Activity Monitor
  useEffect(() => {
    if (isLoading || !securitySettings.isEnabled || securitySettings.timeout === 0 || isLocked)
      return

    let timer: NodeJS.Timeout

    const resetTimer = (): void => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(
        () => {
          setIsLocked(true)
        },
        securitySettings.timeout * 60 * 1000
      )
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach((event) => document.addEventListener(event, resetTimer))
    resetTimer()

    return () => {
      if (timer) clearTimeout(timer)
      events.forEach((event) => document.removeEventListener(event, resetTimer))
    }
  }, [isLoading, securitySettings, isLocked])

  // Poll for settings changes
  useEffect(() => {
    if (isLoading) return

    const interval = setInterval(async () => {
      if (isLocked) return
      try {
        const status = await window.api.getSecurityStatus()
        setSecuritySettings((prev) => {
          if (prev.isEnabled !== status.isEnabled || prev.timeout !== status.autoLockTimeout) {
            return { isEnabled: status.isEnabled, timeout: status.autoLockTimeout }
          }
          return prev
        })
      } catch {
        /* ignore */
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isLocked, isLoading])

  // 1. State for Splash Screen Overlay
  // We start with the splash visible.
  const [showSplash, setShowSplash] = useState(true)
  const [isSplashExiting, setIsSplashExiting] = useState(false)

  // 2. Overlap Strategy
  // The App/Lock layer sits nicely underneath.
  // showApp: Render if NOT locked (and we are legally allowed to show it)
  // We can safely render the App layer if we are NOT locked.
  // Even if 'isLoading' is true (security check happening), the Splash covers it.
  // However, isLocked defaults to false, so there's a risk of rendering App then switching to Lock under the hood.
  // But since checkSecurity is fast (<100ms) and Splash is 4s, the swap happens invisibly.
  const showApp = !isLocked || isExiting
  const showLock = isLocked || isExiting

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* 3. Splash Screen Layer (Topmost) */}
      {showSplash && (
        <SplashScreen
          isExiting={isSplashExiting}
          onComplete={() => {
            // Start exit animation
            setIsSplashExiting(true)
            setIsLoading(false) // Data is technically ready

            // Unmount after animation
            setTimeout(() => {
              setShowSplash(false)
            }, 700)
          }}
        />
      )}

      {/* 4. Main App Layer (Bottom) */}
      {showApp && (
        <div className="absolute inset-0 flex h-screen animate-in fade-in duration-700">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-hidden bg-gray-50/50">{children}</main>
          </div>
        </div>
      )}

      {/* 5. Lock Screen Layer (Middle - above App, below Splash) */}
      {showLock && (
        <LockScreen
          isExiting={isExiting}
          onUnlock={() => {
            // Trigger exit animation
            setIsExiting(true)
            setIsLocked(false)

            // Remove LockScreen after animation completes
            setTimeout(() => {
              setIsExiting(false)
            }, 500)
          }}
        />
      )}
    </div>
  )
}
