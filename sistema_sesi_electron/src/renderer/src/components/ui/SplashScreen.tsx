import { useEffect, useState } from 'react'

interface SplashScreenProps {
  readonly onFinish: () => void
  readonly customImage?: string | null
}

export function SplashScreen({
  onFinish,
  customImage
}: Readonly<SplashScreenProps>): React.ReactElement {
  const [isVisible, setIsVisible] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Show splash for at least 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onFinish, 500) // Wait for fade out
    }, 2000)

    return () => clearTimeout(timer)
  }, [onFinish])

  const showCustomImage = customImage && !imageError

  return (
    <div
      className={`fixed inset-0 z-200 flex flex-col items-center justify-center overflow-hidden bg-white text-gray-900 transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {showCustomImage ? (
          <div className="relative animate-in fade-in zoom-in duration-1000">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <img
              src={customImage}
              alt="Welcome"
              onError={() => setImageError(true)}
              className="relative w-64 h-64 object-contain animate-pulse-slow"
            />
          </div>
        ) : (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            {/* SESI Text Logo Fallback */}
            <div className="relative">
              {/* Subtle backdrop glow */}
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />

              <h1 className="relative text-9xl font-black italic tracking-tighter bg-linear-to-br from-sesi-blue via-sesi-green to-sesi-blue bg-size-[200%_auto] animate-floating-gradient bg-clip-text text-transparent drop-shadow-sm select-none">
                SESI
              </h1>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-px w-8 bg-gray-300" />
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-sesi-blue">
                Sistema FIEMS
              </h1>
              <div className="h-px w-8 bg-gray-300" />
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-2">
          {/* Footer text logic... can keep existing or simplify if Logo is huge */}
          <p className="text-xs text-gray-400 tracking-widest uppercase animate-in fade-in duration-700 delay-500">
            Carregando sistema
          </p>
        </div>
      </div>
    </div>
  )
}
