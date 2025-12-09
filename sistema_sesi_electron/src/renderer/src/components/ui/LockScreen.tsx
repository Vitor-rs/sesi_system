import { useState, useRef } from 'react'
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  LogIn
} from 'lucide-react'

interface LockScreenProps {
  onUnlock: () => void
  isExiting?: boolean
}

export function LockScreen({ onUnlock, isExiting }: LockScreenProps): React.ReactElement {
  const [password, setPassword] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [mode, setMode] = useState<'login' | 'recovery'>('login')
  const [dragActive, setDragActive] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerShake = (): void => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSuccess = async (): Promise<void> => {
    setShowSuccess(true)
  }

  const handleEnterApp = (): void => {
    // Cinematic Unlock Transition for Recovery Success too
    setShowSuccess(false) // Hide success screen immediately? Or transition from it?
    // Actually, user wants the "Unlocking..." spinner effect.
    // If we hide success, we see the form again? No.
    // We should probably just trigger the unlock callback with the same delay if we want consistency.
    // But the "Unlocking..." spinner is part of the FORM view.
    // Let's render the spinner INSTEAD of the checks?
    // Or just fade out the success screen and call onUnlock?
    // User said: "It goes blink to reach the app. I want it to be the same when I type..."
    // So let's trigger the same flow:
    setIsUnlocking(true) // This state is usually for the form.
    // We need to support isUnlocking in the Success view if we want to show it there.

    // Simulating heavy load then unlock
    setTimeout(() => {
      onUnlock()
    }, 1200)
  }

  const handleUnlock = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault()

    if (!password) {
      setError('Por favor, informe uma senha')
      triggerShake()
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const isValid = await window.api.verifyPassword(password)
      if (isValid) {
        // Simulate "Heavy" Loading before Unlocking
        setIsUnlocking(true)
        setTimeout(() => {
          onUnlock()
        }, 1200) // 1.2s of "Unlocking..." state
      } else {
        setError('Senha incorreta')
        triggerShake()
        setIsVerifying(false)
      }
    } catch {
      setError('Erro ao verificar senha')
      setIsVerifying(false)
    }
    if (!isUnlocking) setIsVerifying(false)
  }

  const handleRecovery = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault()
    if (!recoveryCode) return
    verifyCode(recoveryCode)
  }

  const verifyCode = async (code: string): Promise<void> => {
    setIsVerifying(true)
    setError(null)
    try {
      const isValid = await window.api.verifyRecoveryCode(code)
      if (isValid) {
        await window.api.disableSecurity()
        // Recovery Flow: Show success screen
        handleSuccess()
      } else {
        setError('Código inválido ou arquivo incorreto')
        triggerShake()
      }
    } catch {
      setError('Erro ao validar código')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleFile = (file: File): void => {
    if (file.type !== 'text/plain') {
      setError('Por favor, envie um arquivo .txt')
      triggerShake()
      return
    }

    const reader = new FileReader()
    reader.onload = (e): void => {
      const text = e.target?.result as string
      // Look for pattern XXXX-XXXX-XXXX
      const match = text.match(/[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/)
      if (match) {
        setRecoveryCode(match[0])
        verifyCode(match[0])
      } else {
        setError('Código não encontrado no arquivo.')
        triggerShake()
      }
    }
    reader.readAsText(file)
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center animate-in zoom-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/10">
            {isUnlocking ? (
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isUnlocking ? 'Preparando Sistema...' : 'Acesso Liberado'}
          </h1>
          {!isUnlocking && (
            <>
              <p className="text-gray-500 mb-8">Segurança desativada com sucesso.</p>
              <button
                onClick={handleEnterApp}
                className="group relative px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto active:scale-95 shadow-lg shadow-blue-900/20"
                autoFocus
              >
                <LogIn
                  size={20}
                  className="text-white group-hover:translate-x-1 transition-transform"
                />
                Entrar no Sistema
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-0 z-40 bg-gray-50 flex items-center justify-center p-4 transition-all duration-500 ease-in-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
        {/* Header Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/10 border border-gray-100 transition-all">
            {mode === 'login' ? (
              <Lock className="text-blue-600 w-8 h-8" />
            ) : (
              <ShieldCheck className="text-green-600 w-8 h-8" />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Recuperação de Acesso'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {mode === 'login'
              ? 'Digite sua senha para continuar'
              : 'Digite o código ou arraste o arquivo do Kit aqui'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleUnlock : handleRecovery} className="space-y-6">
          <div className="relative group">
            {/* Input / Drop Zone */}
            <div
              className="relative cursor-text"
              onClick={() => {
                // If recovery mode, allow clicking anywhere on the input box to open file dialog if user wants?
                // User said "Click here to attach... or to load".
                // We have a dedicated helper text below.
              }}
            >
              <input
                type={mode === 'login' ? 'password' : 'text'}
                value={mode === 'login' ? password : recoveryCode}
                onChange={(e) =>
                  mode === 'login' ? setPassword(e.target.value) : setRecoveryCode(e.target.value)
                }
                placeholder={mode === 'login' ? 'Senha' : 'XXXX-XXXX-XXXX'}
                className={`w-full bg-white border text-gray-900 px-5 py-4 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-400 font-medium shadow-sm ${
                  error
                    ? 'border-red-500/50 focus:border-red-500 shadow-lg shadow-red-900/5'
                    : dragActive && mode === 'recovery'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                } ${shake ? 'animate-shake' : ''}`}
                autoFocus
                onDragEnter={mode === 'recovery' ? handleDrag : undefined}
                onDragLeave={mode === 'recovery' ? handleDrag : undefined}
                onDragOver={mode === 'recovery' ? handleDrag : undefined}
                onDrop={mode === 'recovery' ? handleDrop : undefined}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-blue-600">
                {mode === 'login' ? <ArrowRight size={20} /> : <KeyRound size={20} />}
              </div>
            </div>

            {/* Helper text for drag drop */}
            {mode === 'recovery' && (
              <div
                className={`mt-2 text-center text-xs transition-all cursor-pointer hover:text-green-600 ${dragActive ? 'text-green-600 font-bold scale-105' : 'text-gray-500'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {dragActive ? 'Solte o arquivo aqui!' : 'Clique para buscar arquivo no computador'}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt"
              onChange={handleFileChange}
            />

            {error && (
              <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-red-500 text-xs font-medium animate-in slide-in-from-left-1">
                <AlertCircle size={12} />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || isUnlocking}
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] shadow-lg ${
              mode === 'login'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20'
            }`}
          >
            {isUnlocking ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : isVerifying ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto block" />
            ) : mode === 'login' ? (
              'Desbloquear'
            ) : (
              'Recuperar Acesso'
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'recovery' : 'login')
              setError(null)
              setPassword('')
              setRecoveryCode('')
            }}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            {mode === 'login' ? 'Esqueci a senha' : 'Voltar para Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
