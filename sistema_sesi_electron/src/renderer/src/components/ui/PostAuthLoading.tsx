import { useEffect, useState } from 'react'
import { BookOpen, GraduationCap, School, Users } from 'lucide-react'

interface PostAuthLoadingProps {
  onFinish: () => void
}

const STEPS = [
  { icon: School, text: 'Conectando ao Sesi...', color: 'text-blue-600' },
  { icon: BookOpen, text: 'Carregando materiais...', color: 'text-indigo-600' },
  { icon: Users, text: 'Sincronizando turmas...', color: 'text-purple-600' },
  { icon: GraduationCap, text: 'Tudo pronto!', color: 'text-green-600' }
]

export function PostAuthLoading({ onFinish }: Readonly<PostAuthLoadingProps>): React.ReactElement {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Effect: Manage Animation Sequence
  useEffect(() => {
    // Small buffer before starting progress? No, immediate is improved.

    const totalDuration = 2500
    const intervalTime = 20
    const increment = 100 / (totalDuration / intervalTime)

    // Progress Bar Animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return next
      })
    }, intervalTime)

    // Step Switch Animation
    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, totalDuration / 3.5)

    // Finish & Exit Animation
    const finishTimer = setTimeout(() => {
      // Start exit animation (fade out)
      setIsVisible(false)
      // Signal parent to unmount after fade out
      setTimeout(onFinish, 500)
    }, totalDuration + 500)

    return () => {
      clearInterval(progressTimer)
      clearInterval(stepInterval)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  const CurrentIcon = STEPS[step].icon

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-50 transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-full max-w-md p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        {/* Animated Icon Container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center animate-subtle-bounce">
              <CurrentIcon
                size={48}
                className={`transition-all duration-500 ${STEPS[step].color} ${step === 1 ? 'animate-spin' : 'animate-bounce'}`}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <span className="text-sm font-medium text-gray-600 tracking-wide">
              {STEPS[step].text}
            </span>
            <span className="text-xs font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>

          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-linear-to-r from-blue-500 via-blue-600 to-green-500 transition-all duration-75 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            >
              <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-size-[1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-12 text-center opacity-50">
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
            Sistema SESI
          </h2>
        </div>
      </div>
    </div>
  )
}
