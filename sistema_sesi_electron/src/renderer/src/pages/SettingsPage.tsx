import { useEffect } from 'react'
import { Palette, User, Database, Shield } from 'lucide-react'
import { useSettingsStore } from '../features/settings/stores/useSettingsStore'
import { PersonalizationTab } from '../features/settings/components/PersonalizationTab'
import { ProfileTab } from '../features/settings/components/ProfileTab'
import { BackupTab } from '../features/settings/components/BackupTab'
import { SecurityTab } from '../features/settings/components/SecurityTab'

const SUDO_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export function SettingsPage(): React.ReactElement {
  const {
    activeTab,
    setActiveTab,
    isSudoUnlocked,
    lastSudoInteraction,
    setIsSudoUnlocked,
    resetMessages,
    refreshSudoTimer
  } = useSettingsStore()

  // Check if sudo is still valid
  useEffect(() => {
    const checkSudo = (): void => {
      if (isSudoUnlocked && Date.now() - lastSudoInteraction > SUDO_TIMEOUT_MS) {
        setIsSudoUnlocked(false)
      }
    }
    const interval = setInterval(checkSudo, 30000)
    return () => clearInterval(interval)
  }, [isSudoUnlocked, lastSudoInteraction, setIsSudoUnlocked])

  // Refresh sudo timer on interaction and reset messages when changing tabs
  useEffect(() => {
    resetMessages()
  }, [activeTab, resetMessages])

  // Monitoring interaction for active security tabs
  useEffect(() => {
    if ((activeTab === 'security' || activeTab === 'backup') && isSudoUnlocked) {
      refreshSudoTimer()
    }
  }, [activeTab, isSudoUnlocked, refreshSudoTimer])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie suas preferências e perfil.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personalization')}
          className={`px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-t-lg font-semibold whitespace-nowrap ${
            activeTab === 'personalization'
              ? 'border-purple-600 text-purple-700 bg-gray-100'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Palette size={18} className={activeTab === 'personalization' ? 'text-purple-600' : ''} />
          Personalização
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-t-lg font-semibold whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-700 bg-gray-100'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User size={18} className={activeTab === 'profile' ? 'text-blue-600' : ''} />
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-t-lg font-semibold whitespace-nowrap ${
            activeTab === 'backup'
              ? 'border-green-600 text-green-700 bg-gray-100'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Database size={18} className={activeTab === 'backup' ? 'text-green-600' : ''} />
          Backup e Dados
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-t-lg font-semibold whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-red-600 text-red-700 bg-gray-100'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Shield size={18} className={activeTab === 'security' ? 'text-red-600' : ''} />
          Segurança (Cofre)
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'personalization' && <PersonalizationTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'backup' && <BackupTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}
