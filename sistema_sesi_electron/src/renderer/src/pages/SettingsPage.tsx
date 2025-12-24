import { useEffect } from 'react'
import { Palette, User, Database, Shield, Settings, Library } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'
import { PersonalizationTab } from '../features/settings/components/PersonalizationTab'
import { ProfileTab } from '../features/settings/components/ProfileTab'
import { BackupTab } from '../features/settings/components/BackupTab'
import { SecurityTab } from '../features/settings/components/SecurityTab'
import { FormativeTemplatesTab } from '../features/settings/components/templates/FormativeTemplatesTab'
import { RegistersTab } from '../features/settings/components/RegistersTab'
import { PageLayout } from '../components/layouts/PageLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SudoLockScreen } from '../features/settings/components/SudoLockScreen'

export function SettingsPage(): React.ReactElement {
  const {
    activeTab,
    setActiveTab,
    isSudoUnlocked,
    lastSudoInteraction,
    setIsSudoUnlocked,
    resetMessages,
    refreshSudoTimer,
    securityStatus,
    setSecurityStatus
  } = useSettingsStore()

  // Check if sudo is still valid
  useEffect(() => {
    const checkSudo = (): void => {
      // Only lock if enabled
      if (
        securityStatus.isEnabled &&
        isSudoUnlocked &&
        securityStatus.autoLockTimeout > 0 &&
        Date.now() - lastSudoInteraction > securityStatus.autoLockTimeout * 60 * 1000
      ) {
        setIsSudoUnlocked(false)
      }
    }
    const interval = setInterval(checkSudo, 30000)
    return () => clearInterval(interval)
  }, [
    isSudoUnlocked,
    lastSudoInteraction,
    setIsSudoUnlocked,
    securityStatus.isEnabled,
    securityStatus.autoLockTimeout
  ])

  // Load initial status
  useEffect(() => {
    const loadStatus = async (): Promise<void> => {
      try {
        const status = await globalThis.window.api.getSecurityStatus()
        setSecurityStatus(status)
      } catch (error) {
        console.error('Failed to load security status', error)
      }
    }
    loadStatus()
  }, [setSecurityStatus])

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

  // Determine if should block
  /*
    BLOCK CONDITION:
    1. Security is Enabled (has password) AND
    2. Sudo is NOT Unlocked
  */
  const isBlocked = securityStatus.isEnabled && !isSudoUnlocked

  return (
    <PageLayout
      title="Configurações"
      icon={Settings}
      description="Gerencie suas preferências e perfil."
    >
      {isBlocked ? (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <SudoLockScreen />
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(
              v as 'personalization' | 'profile' | 'templates' | 'backup' | 'security' | 'registers'
            )
          }
          className="h-full flex flex-col gap-6"
        >
          {/* Tabs - Fixed at top of content area */}
          <div className="flex border-b border-gray-200 overflow-x-auto flex-none">
            <TabsList className="bg-transparent p-0 h-auto space-x-0 w-full justify-start rounded-none">
              <TabsTrigger
                value="personalization"
                className="px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-none rounded-t-lg data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 data-[state=active]:bg-gray-100 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent "
              >
                <Palette
                  size={18}
                  className={activeTab === 'personalization' ? 'text-purple-600' : ''}
                />
                Personalização
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-none rounded-t-lg data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-gray-100 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent"
              >
                <User size={18} className={activeTab === 'profile' ? 'text-blue-600' : ''} />
                Perfil
              </TabsTrigger>
              <TabsTrigger
                value="registers"
                className="px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-none rounded-t-lg data-[state=active]:border-slate-600 data-[state=active]:text-slate-700 data-[state=active]:bg-gray-100 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent"
              >
                <Library size={18} className={activeTab === 'registers' ? 'text-slate-600' : ''} />
                Cadastros
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-none rounded-t-lg data-[state=active]:border-orange-600 data-[state=active]:text-orange-700 data-[state=active]:bg-gray-100 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent"
              >
                <Library size={18} className={activeTab === 'templates' ? 'text-orange-600' : ''} />
                Modelos de Avaliação
              </TabsTrigger>
              <TabsTrigger
                value="backup"
                className="px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-none rounded-t-lg data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-gray-100 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent"
              >
                <Database size={18} className={activeTab === 'backup' ? 'text-green-600' : ''} />
                Dados e Compartilhamento
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="px-6 py-3 text-sm flex items-center gap-2 transition-all border-b-2 rounded-none rounded-t-lg data-[state=active]:border-red-600 data-[state=active]:text-red-700 data-[state=active]:bg-gray-100 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent"
              >
                <Shield size={18} className={activeTab === 'security' ? 'text-red-600' : ''} />
                Segurança (Cofre)
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-2">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <TabsContent value="personalization">
                <PersonalizationTab />
              </TabsContent>
              <TabsContent value="profile">
                <ProfileTab />
              </TabsContent>
              <TabsContent value="registers">
                <RegistersTab />
              </TabsContent>
              <TabsContent value="templates">
                <FormativeTemplatesTab />
              </TabsContent>
              <TabsContent value="backup">
                <BackupTab />
              </TabsContent>
              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      )}
    </PageLayout>
  )
}
