import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { useAuthStore } from '../stores/useAuthStore'
import { LockScreen } from '../components/ui/LockScreen'
import { SplashScreen } from '../components/ui/SplashScreen'
import { useInactivityTimer } from '../hooks/useInactivityTimer'

function App(): React.ReactElement {
  const { isLocked, setLocked, setAuthenticated, setSecurityEnabled, setAutoLockTimeout } =
    useAuthStore()

  const [showSplash, setShowSplash] = useState(true)
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

        if (!securityStatus.isEnabled) {
          setLocked(false)
          setAuthenticated(true)
        } else {
          // If security is enabled, but we are already authenticated (persisted session),
          // we should ensure we are unlocked.
          const { isAuthenticated } = useAuthStore.getState()
          if (isAuthenticated) {
            setLocked(false)
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

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} customImage={welcomeImage} />
  }

  if (isLocked) {
    return (
      <LockScreen
        onUnlock={() => {
          setLocked(false)
          setAuthenticated(true)
        }}
      />
    )
  }

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
