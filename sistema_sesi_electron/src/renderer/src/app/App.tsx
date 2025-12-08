import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { useAuthStore } from '../stores/useAuthStore'
import { LockScreen } from '../components/ui/LockScreen'
import { useInactivityTimer } from '../hooks/useInactivityTimer'

function App(): React.ReactElement {
  const { isLocked, setLocked, setAuthenticated, setSecurityEnabled, setAutoLockTimeout } =
    useAuthStore()

  // Initialize Inactivity Timer
  useInactivityTimer()

  useEffect(() => {
    const checkSecurity = async (): Promise<void> => {
      try {
        const status = await globalThis.window.api.getSecurityStatus()
        setSecurityEnabled(status.isEnabled)
        setAutoLockTimeout(status.autoLockTimeout)

        // On startup:
        // If security is enabled, we start LOCKED (default state).
        // If security is disabled, we UNLOCK immediately.
        if (!status.isEnabled) {
          setLocked(false)
          setAuthenticated(true)
        }
        // If enabled, we remain locked until user enters password in LockScreen
      } catch (error) {
        console.error('Failed to check security status:', error)
      }
    }

    checkSecurity()
  }, [setLocked, setAuthenticated, setSecurityEnabled, setAutoLockTimeout])

  if (isLocked) {
    return <LockScreen onUnlock={() => setLocked(false)} />
  }

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
