import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '../stores/useAuthStore'

export function useInactivityTimer(): void {
  const { isLocked, setLocked, securityEnabled, autoLockTimeout } = useAuthStore()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (isLocked || !securityEnabled || autoLockTimeout === 0) return

    // Convert minutes to ms
    const timeoutMs = autoLockTimeout * 60 * 1000

    // Prevent immediate locking or invalid configuration
    if (timeoutMs < 60000) return

    timerRef.current = setTimeout(() => {
      // Double check state before locking
      if (!isLocked && securityEnabled) {
        setLocked(true)
      }
    }, timeoutMs)
  }, [isLocked, securityEnabled, autoLockTimeout, setLocked])

  useEffect(() => {
    // Initial start
    resetTimer()

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    const handleActivity = (): void => resetTimer()

    events.forEach((event) => window.addEventListener(event, handleActivity))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((event) => window.removeEventListener(event, handleActivity))
    }
  }, [resetTimer])
}
