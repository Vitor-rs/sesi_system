import { Cloud, RefreshCw, Save, CheckCircle, FolderOpen } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'
import { SudoLockScreen } from './SudoLockScreen'

export function BackupTab(): React.ReactElement {
  const {
    isSudoUnlocked,
    backupLocations,
    isScanning,
    isBackingUp,
    backupMessage,
    customBackupPath,
    selectedDrivePath, // From Store
    setIsScanning,
    setBackupLocations,
    setIsBackingUp,
    setBackupMessage,
    setCustomBackupPath,
    setSelectedDrivePath, // From Store
    setIsSudoUnlocked // For the 'Block Now' button
  } = useSettingsStore()

  const detectBackups = async (): Promise<void> => {
    setIsScanning(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const locations = await globalThis.window.api.detectBackups()
      setBackupLocations(locations)
    } catch (error) {
      console.error('Failed to detect backups', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleCreateBackup = async (): Promise<void> => {
    setIsBackingUp(true)
    setBackupMessage('Iniciando backup...')
    try {
      // Logic: Always save to "System Internal" (handled by backend)
      // Mirrors: Add selected Drive AND Custom Path if they exist
      const targets: string[] = []

      if (selectedDrivePath) targets.push(selectedDrivePath)
      if (customBackupPath) targets.push(customBackupPath)

      // Cast to bypass potential d.ts mismatch in build environment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await globalThis.window.api.createBackup(targets as any)
      // The backend result.paths contains all successful save locations
      if (result.success) {
        // cast result to any because the type might not be fully updated in frontend inference yet if we don't restart TS server
        // but broadly it returns { success, paths }
        setBackupMessage(`Backup salvo no Sistema + Espelhado para ${targets.length} locais!`)
      }
    } catch (error) {
      console.error('Backup failed', error)
      setBackupMessage('Erro ao realizar backup.')
    } finally {
      setIsBackingUp(false)
      setTimeout(() => setBackupMessage(null), 5000)
    }
  }

  const handleSelectFolder = async (): Promise<void> => {
    const path = await globalThis.window.api.selectBackupFolder()
    if (path) {
      setCustomBackupPath(path)
      // Note: User can now have BOTH cloud and manual selected if they want mirrors.
      // But if user wants to 'switch', they can uncheck cloud.
      // The previous logic cleared the other. Currently the user asked for "mirroring".
      // "E ele vai só copiar para lá. E se eu colocar uma opção manual... O sistema vai fazer backup espelhado."
      // So I will NOT clear selectedDrivePath here based on "mirroring" requirement.
    }
  }

  // Helper to toggle drive selection
  const toggleDriveSelection = (path: string): void => {
    if (selectedDrivePath === path) {
      setSelectedDrivePath(null)
    } else {
      setSelectedDrivePath(path)
      // Custom path is NOT cleared, allowing parallel backup as requested
    }
  }

  // Helper to determine display order of cloud providers
  const sortedCloudLocations = (): { showGoogleFirst: boolean } => {
    const hasGoogle = backupLocations.some((l) => l.provider === 'googledrive')
    // OneDrive check removed as unused var, we just check Google to decide order
    return { showGoogleFirst: hasGoogle }
  }

  const { showGoogleFirst } = sortedCloudLocations()

  const GoogleDriveBlock = (
    <div
      className={`p-4 border rounded-xl flex flex-col gap-3 transition-colors ${
        backupLocations.some((l) => l.provider === 'googledrive')
          ? 'border-green-200 bg-green-50/50'
          : 'border-gray-100 bg-gray-50/50 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Google Drive
        </div>
        {backupLocations.some((l) => l.provider === 'googledrive') && (
          <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-100 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} />{' '}
            {backupLocations.filter((l) => l.provider === 'googledrive').length} Detectados
          </span>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {backupLocations
          .filter((l) => l.provider === 'googledrive')
          .map((drive) => (
            <div
              key={drive.path}
              className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-green-100 shadow-sm"
            >
              <input
                type="checkbox"
                checked={selectedDrivePath === drive.path}
                onChange={() => toggleDriveSelection(drive.path)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate" title={drive.path}>
                  Unidade ({drive.path.substring(0, 1)})
                </p>
                <p className="text-[10px] text-gray-500 truncate">{drive.path}</p>
              </div>
              <button
                onClick={async () => {
                  await globalThis.window.api.openPath(drive.path)
                }}
                className="p-1.5 text-gray-500 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
                title="Abrir Raiz"
              >
                <FolderOpen size={14} />
              </button>
            </div>
          ))}
        {!backupLocations.some((l) => l.provider === 'googledrive') && (
          <span className="text-xs text-gray-400">Nenhuma unidade G: detectada.</span>
        )}
      </div>
    </div>
  )

  const OneDriveBlock = (
    <div
      className={`p-4 border rounded-xl flex flex-col gap-3 transition-colors ${
        backupLocations.some((l) => l.provider === 'onedrive')
          ? 'border-blue-200 bg-blue-50/50'
          : 'border-gray-100 bg-gray-50/50 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> OneDrive
        </div>
        {backupLocations.some((l) => l.provider === 'onedrive') && (
          <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-100 px-2 py-0.5 rounded-full">
            <CheckCircle size={10} /> Conectado
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-auto pt-2">
        {backupLocations.some((l) => l.provider === 'onedrive') ? (
          <button
            onClick={async () => {
              const path = backupLocations.find((l) => l.provider === 'onedrive')?.path
              if (path) await globalThis.window.api.openPath(path)
            }}
            className="text-blue-700 hover:underline flex items-center gap-1"
          >
            <FolderOpen size={12} /> Abrir pasta local
          </button>
        ) : (
          'Não detectado'
        )}
      </div>
    </div>
  )

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300">
      {!isSudoUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300">
          <SudoLockScreen />
        </div>
      )}

      <div
        className={
          isSudoUnlocked
            ? 'duration-300 space-y-6'
            : 'filter blur-md pointer-events-none select-none opacity-50 duration-300 space-y-6'
        }
      >
        <div className="mb-6 flex items-center justify-between bg-amber-50 text-amber-900 px-4 py-3 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Cloud size={16} className="text-amber-600" />
            <span>Modo Seguro Ativo: Você tem acesso total.</span>
          </div>
          <button
            onClick={() => setIsSudoUnlocked(false)}
            className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors text-amber-700 font-medium shadow-sm"
          >
            Bloquear Agora
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Cloud size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Cópia de Segurança Inteligente
                </h2>
                <p className="text-sm text-gray-500">Sistema de espelhamento automático e nuvem.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={detectBackups}
                disabled={isScanning}
                className="p-2 text-gray-400 hover:text-sesi-blue hover:bg-blue-50 rounded-lg transition-colors"
                title="Atualizar detecção de nuvem"
              >
                <RefreshCw size={20} className={isScanning ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* 1. Main System Backup */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <Save size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Backup Geral (Sistema)</h3>
                  <p className="text-xs text-gray-500">
                    Salvo em: Pasta Oculta do Sistema (Fonte da Verdade)
                    {selectedDrivePath ? ' + Nuvem' : ''}
                    {customBackupPath ? ' + Pasta Manual' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCreateBackup()}
                disabled={isBackingUp}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {isBackingUp ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                {isBackingUp ? 'Espelhando...' : 'Fazer Backup Agora'}
              </button>
            </div>

            {/* 2. Manual Mirror Option (Moved Here) */}
            <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-800">Espelhamento Manual</h3>
                  {customBackupPath && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  Selecione uma pasta extra para onde o sistema deve copiar o backup (ex: Pen Drive
                  ou Pasta Compartilhada).
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleSelectFolder}
                  className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 text-blue-700 bg-white rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium shadow-sm"
                >
                  <FolderOpen size={14} />
                  {customBackupPath ? 'Alterar Local' : 'Adicionar Local'}
                </button>
                {customBackupPath && (
                  <div
                    className="text-[10px] text-gray-500 max-w-[200px] truncate"
                    title={customBackupPath}
                  >
                    ...{customBackupPath.slice(-25)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Cloud Locations Container */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Cloud size={18} className="text-blue-500" /> Locais de Nuvem
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showGoogleFirst ? (
              <>
                {GoogleDriveBlock}
                {OneDriveBlock}
              </>
            ) : (
              <>
                {OneDriveBlock}
                {GoogleDriveBlock}
              </>
            )}
          </div>
        </section>

        <div className="text-sm text-center">
          {backupMessage && (
            <span
              className={`flex items-center justify-center gap-2 ${
                backupMessage.includes('Erro')
                  ? 'text-red-600'
                  : 'text-green-600 animate-in fade-in'
              }`}
            >
              {backupMessage.includes('Erro') ? null : <CheckCircle size={16} />}
              {backupMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
