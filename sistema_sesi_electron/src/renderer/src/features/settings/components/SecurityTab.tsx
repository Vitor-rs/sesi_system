import { useState, useEffect, useCallback } from 'react'
import { Shield, Lock, ChevronDown, Key, FileText, CheckCircle } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'
import { SudoLockScreen } from './SudoLockScreen'

export function SecurityTab(): React.ReactElement {
  const {
    isSudoUnlocked,
    securityStatus,
    activeSecurityAccordion,
    isSettingPassword,
    securityMessage,
    setSecurityStatus,
    setIsSudoUnlocked,
    setActiveSecurityAccordion,
    setIsSettingPassword,
    setSecurityMessage,
    setLastSudoInteraction
  } = useSettingsStore()

  // Local state for password inputs (sensitive, transient)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const loadSecurityStatus = useCallback(async (): Promise<void> => {
    try {
      const status = await window.api.getSecurityStatus()
      setSecurityStatus(status)
      if (!status.isEnabled) {
        setIsSudoUnlocked(true)
      }
    } catch (error) {
      console.error('Failed to load security status', error)
    }
  }, [setSecurityStatus, setIsSudoUnlocked])

  useEffect(() => {
    loadSecurityStatus()
  }, [loadSecurityStatus])

  const handleSetPassword = async (): Promise<void> => {
    if (password.length < 4) {
      setSecurityMessage({ type: 'error', text: 'A senha deve ter pelo menos 4 caracteres.' })
      return
    }
    if (password !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }

    try {
      await window.api.setPassword(password)
      setSecurityMessage({ type: 'success', text: 'Senha mestra definida com sucesso!' })
      setPassword('')
      setConfirmPassword('')
      setIsSettingPassword(false)
      setLastSudoInteraction(Date.now())
      loadSecurityStatus()
    } catch (error) {
      console.error('Failed to set password', error)
      setSecurityMessage({ type: 'error', text: 'Erro ao definir senha.' })
    }
  }

  const handleGenerateRecoveryKit = async (): Promise<void> => {
    try {
      const code = await window.api.generateRecoveryKit()
      const content = `KIT DE RECUPERAÇÃO - SISTEMA SESI\n\nCÓDIGO DE RECUPERAÇÃO: ${code}\n\nIMPORTANTE:\nGuarde este arquivo em um local seguro (Pendrive ou HD Externo).\nSem este código, NÃO é possível recuperar seus dados caso perca a senha.\n\nGerado em: ${new Date().toLocaleString()}`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SesiSystem-Recovery-${new Date().getTime()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSecurityMessage({ type: 'success', text: 'Kit de recuperação gerado! Salve o arquivo.' })
      setLastSudoInteraction(Date.now())
      loadSecurityStatus()
    } catch (error) {
      console.error('Failed to generate recovery kit', error)
      setSecurityMessage({ type: 'error', text: 'Erro ao gerar kit de recuperação.' })
    }
  }

  const handleAutoLockChange = async (minutes: number): Promise<void> => {
    try {
      await window.api.setAutoLock(minutes)
      setLastSudoInteraction(Date.now())
      loadSecurityStatus()
    } catch (error) {
      console.error('Failed to set auto lock', error)
    }
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300">
      {!isSudoUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300">
          <SudoLockScreen />
        </div>
      )}

      <div
        className={
          !isSudoUnlocked
            ? 'filter blur-md pointer-events-none select-none opacity-50 duration-300'
            : 'duration-300'
        }
      >
        <div className="mb-6 flex items-center justify-between bg-amber-50 text-amber-900 px-4 py-3 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield size={16} className="text-amber-600" />
            <span>Modo Seguro Ativo: Configurações sensíveis desbloqueadas.</span>
          </div>
          <button
            onClick={() => setIsSudoUnlocked(false)}
            className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors text-amber-700 font-medium shadow-sm"
          >
            Bloquear Agora
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {/* 1. Access & Auth Accordion */}
          <div>
            <button
              onClick={() =>
                setActiveSecurityAccordion(activeSecurityAccordion === 'auth' ? null : 'auth')
              }
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Acesso e Autenticação</h2>
                  <p className="text-sm text-gray-500">
                    Gerencie a senha mestra para proteger o acesso.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`text-gray-400 transition-transform duration-300 ${activeSecurityAccordion === 'auth' ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${activeSecurityAccordion === 'auth' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-0">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Proteção com Senha</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {securityStatus.isEnabled
                            ? 'O sistema está protegido por senha.'
                            : 'O sistema não requer senha para entrar.'}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSettingPassword(!isSettingPassword)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          securityStatus.isEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-sesi-blue text-white hover:bg-blue-700'
                        }`}
                      >
                        {securityStatus.isEnabled ? 'Alterar Senha' : 'Definir Senha'}
                      </button>
                    </div>

                    {isSettingPassword && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Nova Senha
                            </label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                              placeholder="Mínimo 4 caracteres"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Confirmar Senha
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                              placeholder="Repita a senha"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            * Use uma senha que você não vai esquecer.
                          </span>
                          <button
                            onClick={handleSetPassword}
                            disabled={!password || !confirmPassword}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Salvar Nova Senha
                          </button>
                        </div>
                        {securityMessage && (
                          <div
                            className={`mt-2 text-sm ${securityMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
                          >
                            {securityMessage.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Auto Lock Accordion */}
          <div>
            <button
              onClick={() =>
                setActiveSecurityAccordion(activeSecurityAccordion === 'lock' ? null : 'lock')
              }
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-yellow-100 transition-colors">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Comportamento de Bloqueio</h2>
                  <p className="text-sm text-gray-500">
                    Configure quando solicitar senha novamente.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`text-gray-400 transition-transform duration-300 ${activeSecurityAccordion === 'lock' ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${activeSecurityAccordion === 'lock' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bloqueio Automático por Inatividade
                      </label>
                      <select
                        value={securityStatus.autoLockTimeout}
                        onChange={(e) => handleAutoLockChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 outline-none"
                      >
                        <option value={0}>Nunca bloquear automaticamente</option>
                        <option value={1}>Após 1 minuto</option>
                        <option value={5}>Após 5 minutos</option>
                        <option value={15}>Após 15 minutos</option>
                        <option value={30}>Após 30 minutos</option>
                      </select>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <Key size={16} className="mr-2 text-gray-400 shrink-0" />
                      <span>
                        O bloqueio exige a senha mestra para retornar. Se você perder a senha,
                        precisará do Kit de Recuperação.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Recovery Accordion */}
          <div>
            <button
              onClick={() =>
                setActiveSecurityAccordion(
                  activeSecurityAccordion === 'recovery' ? null : 'recovery'
                )
              }
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Recuperação de Emergência</h2>
                  <p className="text-sm text-gray-500">
                    Único método para recuperar acesso sem senha.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`text-gray-400 transition-transform duration-300 ${activeSecurityAccordion === 'recovery' ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${activeSecurityAccordion === 'recovery' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 pt-0">
                  <div className="border border-purple-100 bg-purple-50/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">Kit de Recuperação</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          Um arquivo contendo um código único criptografado. Salve-o em um local
                          seguro (fora deste computador).
                        </p>
                      </div>
                      <button
                        onClick={handleGenerateRecoveryKit}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                      >
                        <FileText size={16} />
                        {securityStatus.hasRecoveryKit
                          ? 'Gerar Novo Kit'
                          : 'Gerar Kit de Recuperação'}
                      </button>
                    </div>
                    {securityStatus.hasRecoveryKit && (
                      <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg text-sm border border-green-100 w-fit">
                        <CheckCircle size={16} />
                        <span>Kit de recuperação ativo e configurado.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
