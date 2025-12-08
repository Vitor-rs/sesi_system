import { useEffect, useState } from 'react'
import { Disc3 } from 'lucide-react'

interface SplashScreenProps {
  readonly onFinish: () => void
  readonly customImage?: string | null
}

export function SplashScreen({ onFinish, customImage }: SplashScreenProps): React.ReactElement {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Show splash for at least 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onFinish, 500) // Wait for fade out
    }, 2000)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-200 flex items-center justify-center bg-gray-50 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {customImage ? (
          <div className="relative animate-in fade-in zoom-in duration-1000">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <img
              src={customImage}
              alt="Welcome"
              className="relative w-64 h-64 object-contain animate-pulse-slow"
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse" />
            <Disc3 size={80} className="text-blue-600 animate-spin-slow relative z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full blur-xl" />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2">
          <h1 className="text-2xl font-light text-gray-800 tracking-[0.2em] animate-in slide-in-from-bottom-4 duration-700 delay-150">
            SISTEMA SESI
          </h1>
          <div className="h-0.5 w-12 bg-blue-600/50 rounded-full animate-in zoom-in duration-500 delay-300" />
          <p className="text-xs text-gray-500 tracking-widest uppercase animate-in fade-in duration-700 delay-500">
            Carregando sistema
          </p>
        </div>
      </div>
    </div>
  )
}
