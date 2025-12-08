import { Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete?: () => void
  isExiting?: boolean
}

export function SplashScreen({ onComplete, isExiting }: SplashScreenProps): React.ReactElement {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('Inicializando sistema...')

  useEffect(() => {
    const duration = 3800 // ~4s total
    const interval = 40 // Update every 40ms
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0

    const timer = setInterval(() => {
      currentProgress += increment

      // Update messages based on progress
      if (currentProgress > 20 && currentProgress < 40) setMessage('Verificando segurança...')
      if (currentProgress > 40 && currentProgress < 70) setMessage('Carregando módulos...')
      if (currentProgress > 70 && currentProgress < 90)
        setMessage('Conectando ao banco de dados...')
      if (currentProgress > 95) setMessage('Pronto!')

      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(timer)
        setTimeout(() => onComplete?.(), 200) // Small delay at 100%
      }

      setProgress(currentProgress)
    }, interval)

    return () => clearInterval(timer)
  }, []) // Remove dependency on onComplete to avoid re-running if prop changes

  return (
    <div
      className={`fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-200 font-sans text-gray-100 transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
        }`}
    >
      <div className="relative mb-12">
        <div className="w-24 h-24 bg-gray-800 rounded-3xl flex items-center justify-center shadow-2xl border border-gray-700 animate-in zoom-in duration-700">
          <Shield className="w-12 h-12 text-sesi-red animate-pulse" />
        </div>
      </div>

      <div className="w-64 space-y-3">
        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
          <div
            className="h-full bg-linear-to-r from-sesi-red to-orange-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Message */}
        <div className="flex justify-between text-xs font-medium text-gray-500 h-5">
          <span className="animate-in fade-in slide-in-from-left-2 duration-300 key={message}">
            {message}
          </span>
          <span className="text-gray-600">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
