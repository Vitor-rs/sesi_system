import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { useAuthStore } from '../stores/useAuthStore'
import { LockScreen } from '../components/ui/LockScreen'
import { SplashScreen } from '../components/ui/SplashScreen'
import { PostAuthLoading } from '../components/ui/PostAuthLoading'
import { useInactivityTimer } from '../hooks/useInactivityTimer'

function App(): React.ReactElement {
  const { isLocked, setLocked, setAuthenticated, setSecurityEnabled, setAutoLockTimeout } =
    useAuthStore()

  const [showSplash, setShowSplash] = useState(true)
  const [showPostAuth, setShowPostAuth] = useState(false)
  const [welcomeImage, setWelcomeImage] = useState<string | null>(null)

  // Initialize Inactivity Timer
  useInactivityTimer()

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        // Parallel fetch for speed
        const [securityStatus, settingsImage] = await Promise.all([
          globalThis.window.api.getSecurityStatus(),
          globalThis.window.api.getSettings('welcome_image')
        ])

        // Handle Security
        setSecurityEnabled(securityStatus.isEnabled)
        setAutoLockTimeout(securityStatus.autoLockTimeout)

        if (securityStatus.isEnabled === false) {
          setLocked(false)
          setAuthenticated(true)
          // If no security, maybe skip post-auth or show it briefly?
          // User wants "Flow". Let's show it.
          setShowPostAuth(true)
        } else {
          // If security is enabled, but we are already authenticated (persisted session),
          // we should ensure we are unlocked.
          const { isAuthenticated } = useAuthStore.getState()
          if (isAuthenticated) {
            setLocked(false)
            setShowPostAuth(true)
          }
        }

        // Handle Welcome Image
        if (settingsImage) {
          setWelcomeImage(settingsImage)
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        // Signal to Main process that we are ready to be shown
        globalThis.window.api.appReady()
      }
    }

    initialize()
  }, [setLocked, setAuthenticated, setSecurityEnabled, setAutoLockTimeout])

  // Poll for settings changes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await globalThis.window.api.getSecurityStatus()
        setSecurityEnabled(status.isEnabled)
        setAutoLockTimeout(status.autoLockTimeout)
      } catch {
        /* ignore */
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [setSecurityEnabled, setAutoLockTimeout])

  return (
    <>
      {/* 1. Main App Layer (z-0) - Always mounted for seamless pre-rendering */}
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      {/* 2. Post-Auth Loading Layer (z-30) - Shows after unlock */}
      {showPostAuth && <PostAuthLoading onFinish={() => setShowPostAuth(false)} />}

      {/* 3. Lock Screen Layer (z-40) - Shows if locked */}
      {isLocked && (
        <LockScreen
          isExiting={false}
          onUnlock={() => {
            // Orchestrated Transition (Clean Slate Strategy):
            // 1. Mark as Authenticated
            setAuthenticated(true)

            // 2. Unmount Lock Immediately (It replaced by PostAuth which starts blank)
            setLocked(false)

            // 3. Mount PostAuth (Starts invisible/blank for 800ms)
            setShowPostAuth(true)

            // 4. Maximize Immediately
            // The expansion happens on a blank canvas, preventing visual glitches.
            globalThis.window.api.maximizeWindow()
          }}
        />
      )}

      {/* 4. Splash Screen Layer (z-50) - Topmost, fades out on finish */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} customImage={welcomeImage} />
      )}
    </>
  )
}

export default App
