import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'

export function SudoLockScreen(): React.ReactElement {
  const [password, setPassword] = useState('')
  const { sudoError, setSudoError, setIsSudoUnlocked, setLastSudoInteraction } = useSettingsStore()

  const handleSudoLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setSudoError(null)
    try {
      const isValid = await window.api.verifyPassword(password)
      if (isValid) {
        setIsSudoUnlocked(true)
        setLastSudoInteraction(Date.now())
        setPassword('')
      } else {
        setSudoError('Senha incorreta.')
      }
    } catch (error) {
      console.error('Sudo verification failed', error)
      setSudoError('Erro ao verificar senha.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-4 bg-gray-100 rounded-full">
        <Lock size={48} className="text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Autenticação Necessária</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Para acessar estas configurações sensíveis, por favor confirme sua senha.
        </p>
      </div>
      <form onSubmit={handleSudoLogin} className="w-full max-w-xs space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-center text-gray-900"
            placeholder="Digite sua senha"
            autoFocus
          />
          {sudoError && <p className="text-xs text-red-500 mt-2 text-center">{sudoError}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Desbloquear
        </button>
      </form>
    </div>
  )
}
