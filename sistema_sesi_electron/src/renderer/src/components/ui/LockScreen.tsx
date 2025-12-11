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
  readonly onUnlock: () => void
  readonly isExiting?: boolean
}

type Mode = 'login' | 'recovery'

function LockScreenSuccess({
  isUnlocking,
  onEnterApp
}: {
  readonly isUnlocking: boolean
  readonly onEnterApp: () => void
}): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
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
              onClick={onEnterApp}
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

function LockScreenHeader({ mode }: { readonly mode: Mode }): React.ReactElement {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/10 border border-gray-100 transition-all">
          {mode === 'login' ? (
            <Lock className="text-blue-600 w-8 h-8" />
          ) : (
            <ShieldCheck className="text-green-600 w-8 h-8" />
          )}
        </div>
      </div>

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
    </>
  )
}

export function LockScreen({ onUnlock, isExiting }: LockScreenProps): React.ReactElement {
  const [password, setPassword] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [dragActive, setDragActive] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerShake = (): void => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleEnterApp = (): void => {
    setShowSuccess(false)
    setIsUnlocking(true)
    setTimeout(() => {
      onUnlock()
    }, 1200)
  }

  const verifyCode = async (code: string): Promise<void> => {
    setIsVerifying(true)
    setError(null)
    try {
      const isValid = await globalThis.window.api.verifyRecoveryCode(code)
      if (isValid) {
        await globalThis.window.api.disableSecurity()
        setShowSuccess(true)
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
      const isValid = await globalThis.window.api.verifyPassword(password)
      if (isValid) {
        setIsUnlocking(true)
        setTimeout(() => {
          onUnlock()
        }, 1200)
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

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleFile = async (file: File): Promise<void> => {
    if (file.type !== 'text/plain') {
      setError('Por favor, envie um arquivo .txt')
      triggerShake()
      return
    }

    try {
      const text = await file.text()
      // Look for pattern XXXX-XXXX-XXXX using RegExp.exec as recommended
      const regex = /[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/
      const match = regex.exec(text)

      if (match) {
        setRecoveryCode(match[0])
        verifyCode(match[0])
      } else {
        setError('Código não encontrado no arquivo.')
        triggerShake()
      }
    } catch {
      setError('Erro ao ler arquivo.')
      triggerShake()
    }
  }

  const handleDrop = (e: React.DragEvent): void => {
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

  const getInputClass = (): string => {
    if (error) return 'border-red-500/50 focus:border-red-500 shadow-lg shadow-red-900/5'
    if (dragActive && mode === 'recovery') return 'border-green-500 bg-green-50'
    return 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
  }

  const getButtonClass = (): string => {
    const base =
      'w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] shadow-lg'
    const variant =
      mode === 'login'
        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20'
        : 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20'
    return `${base} ${variant}`
  }

  const renderButtonContent = (): React.ReactElement => {
    if (isUnlocking) {
      return (
        <div className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      )
    }
    if (isVerifying) {
      return (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto block" />
      )
    }
    return <>{mode === 'login' ? 'Desbloquear' : 'Recuperar Acesso'}</>
  }

  if (showSuccess) {
    return <LockScreenSuccess isUnlocking={isUnlocking} onEnterApp={handleEnterApp} />
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4 transition-all duration-500 ease-in-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
        <LockScreenHeader mode={mode} />

        <form
          onSubmit={(e) => {
            if (mode === 'login') handleUnlock(e)
            else {
              e.preventDefault()
              if (recoveryCode) verifyCode(recoveryCode)
            }
          }}
          className="space-y-6"
        >
          <div className="relative group">
            <div className="relative">
              <input
                type={mode === 'login' ? 'password' : 'text'}
                value={mode === 'login' ? password : recoveryCode}
                onChange={(e) =>
                  mode === 'login' ? setPassword(e.target.value) : setRecoveryCode(e.target.value)
                }
                placeholder={mode === 'login' ? 'Senha' : 'XXXX-XXXX-XXXX'}
                className={`w-full bg-white border text-gray-900 px-5 py-4 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-400 font-medium shadow-sm ${getInputClass()} ${
                  shake ? 'animate-shake' : ''
                }`}
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

            {mode === 'recovery' && (
              <button
                type="button"
                className={`w-full mt-2 text-center text-xs transition-all cursor-pointer hover:text-green-600 bg-transparent border-none ${
                  dragActive ? 'text-green-600 font-bold scale-105' : 'text-gray-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {dragActive ? 'Solte o arquivo aqui!' : 'Clique para buscar arquivo no computador'}
              </button>
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

          <button type="submit" disabled={isVerifying || isUnlocking} className={getButtonClass()}>
            {renderButtonContent()}
          </button>
        </form>

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
