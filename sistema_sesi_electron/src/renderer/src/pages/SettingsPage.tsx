import { useState, useEffect } from 'react'
import {
  Upload,
  ImageIcon,
  Save,
  CheckCircle,
  User,
  Palette,
  Image as LucideImage,
  Database,
  Cloud,
  FolderOpen,
  HardDrive,
  RefreshCw
} from 'lucide-react'

type IconData = {
  name: string
  path: string
  preview: string
}

type BackupLocation = {
  provider: 'onedrive' | 'googledrive' | 'local'
  path: string
  isAvailable: boolean
}

export function SettingsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'personalization' | 'profile' | 'backup'>(
    'personalization'
  )

  // Icon State
  const [icons, setIcons] = useState<IconData[]>([])
  const [currentIconPath, setCurrentIconPath] = useState<string | null>(null)
  const [selectedIconPath, setSelectedIconPath] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Backup State
  const [backupLocations, setBackupLocations] = useState<BackupLocation[]>([])
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [backupMessage, setBackupMessage] = useState<string | null>(null)
  const [customBackupPath, setCustomBackupPath] = useState<string | null>(null)

  useEffect(() => {
    loadIcons()
    loadCurrentSettings()
    detectBackups()
  }, [])

  const detectBackups = async (): Promise<void> => {
    setIsScanning(true)
    try {
      // Small delay to make the interaction feel substantial
      await new Promise((resolve) => setTimeout(resolve, 500))
      const locations = await window.api.detectBackups()
      setBackupLocations(locations)
    } catch (error) {
      console.error('Failed to detect backups', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleBackup = async (): Promise<void> => {
    setIsBackingUp(true)
    setBackupMessage('Iniciando backup...')
    try {
      const result = await window.api.createBackup(customBackupPath ?? undefined)
      if (result.success) {
        setBackupMessage(`Backup concluído com sucesso em ${result.paths.length} locais!`)
      }
    } catch (error) {
      console.error('Backup failed', error)
      setBackupMessage('Erro ao realizar backup.')
    } finally {
      setIsBackingUp(false)
      // Clear message after 5s
      setTimeout(() => setBackupMessage(null), 5000)
    }
  }

  const handleSelectFolder = async (): Promise<void> => {
    const path = await window.api.selectBackupFolder()
    if (path) {
      setCustomBackupPath(path)
    }
  }

  const loadIcons = async (): Promise<void> => {
    try {
      const fetchedIcons = await window.api.getIcons()
      setIcons(fetchedIcons)
    } catch (error) {
      console.error('Failed to load icons', error)
    }
  }

  const loadCurrentSettings = async (): Promise<void> => {
    try {
      const path = await window.api.getSettings('app_icon_path')
      if (path) {
        setCurrentIconPath(path)
        setSelectedIconPath(path) // Default selection to current
      }
    } catch (error) {
      console.error('Failed to load settings', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      await window.api.uploadIcon(arrayBuffer, file.name)
      await loadIcons() // Refresh gallery
      setMessage({ type: 'success', text: 'Imagem enviada para galeria!' })
    } catch (error) {
      console.error('Upload failed', error)
      setMessage({ type: 'error', text: 'Falha ao enviar imagem.' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleApplyIcon = async (): Promise<void> => {
    if (!selectedIconPath) return

    try {
      await window.api.applyIcon(selectedIconPath)
      setCurrentIconPath(selectedIconPath)
      setMessage({ type: 'success', text: 'Ícone aplicado com sucesso!' })
    } catch (error) {
      console.error('Apply failed', error)
      setMessage({ type: 'error', text: 'Erro ao aplicar ícone.' })
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie suas preferências e perfil.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('personalization')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'personalization'
              ? 'border-sesi-red text-sesi-red'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette size={18} /> Personalização
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'profile'
              ? 'border-sesi-red text-sesi-red'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={18} /> Perfil
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'backup'
              ? 'border-sesi-red text-sesi-red'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Database size={18} /> Backup e Dados
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'personalization' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Icon Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Ícone do Aplicativo</h2>
                  <p className="text-sm text-gray-500">
                    Escolha um ícone da galeria ou faça upload de uma nova imagem (PNG/JPG).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Area */}
                <div className="lg:col-span-1">
                  <label className="block w-full h-48">
                    <div className="h-full w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all group">
                      <Upload className="h-10 w-10 text-gray-400 group-hover:text-purple-500 mb-2" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                        Upload Nova Imagem
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG (Max 2MB)</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".png,.jpg,.jpeg,.ico"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </div>
                  </label>
                </div>

                {/* Gallery */}
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <LucideImage size={16} /> Galeria de Ícones
                  </h3>

                  {icons.length === 0 ? (
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
                      Nenhum ícone salvo.
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-64 overflow-y-auto p-1">
                      {icons.map((icon) => (
                        <button
                          key={icon.path}
                          onClick={() => setSelectedIconPath(icon.path)}
                          className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                            selectedIconPath === icon.path
                              ? 'border-purple-500 ring-2 ring-purple-100'
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          <img
                            src={icon.preview}
                            alt={icon.name}
                            className="w-full h-full object-contain p-2"
                          />
                          {currentIconPath === icon.path && (
                            <div className="absolute top-1 right-1">
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                                ✓
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="text-sm">
                      {message && (
                        <span
                          className={`flex items-center gap-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {message.type === 'success' ? <CheckCircle size={16} /> : null}
                          {message.text}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleApplyIcon}
                      disabled={!selectedIconPath || selectedIconPath === currentIconPath}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Save size={16} /> Aplicar Ícone
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-20 h-20 bg-sesi-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              VR
            </div>
            <h2 className="text-xl font-bold text-gray-900">Vitor R.</h2>
            <p className="text-gray-500">Professor Titular</p>
            <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg inline-block text-sm">
              Edição de perfil será implementada em breve.
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                    <p className="text-sm text-gray-500">
                      O sistema detecta automaticamente unidades de nuvem (OneDrive/Google Drive) e
                      cria cópias redundantes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={detectBackups}
                  disabled={isScanning}
                  className="p-2 text-gray-400 hover:text-sesi-blue hover:bg-blue-50 rounded-lg transition-colors"
                  title="Atualizar detecção de nuvem"
                >
                  <RefreshCw size={20} className={isScanning ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Detected Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* Local Safe Storage */}
                <div className="p-4 border border-gray-200 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <HardDrive size={18} /> Sistema Interno (Oculto)
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-2 py-1 rounded w-fit">
                    <CheckCircle size={12} /> Fonte da Verdade
                  </div>
                  <p
                    className="text-xs text-gray-400 mt-auto truncate"
                    title={backupLocations.find((l) => l.provider === 'local')?.path}
                  >
                    {backupLocations.find((l) => l.provider === 'local')?.path ||
                      'AppData/Roaming/.../Backups'}
                  </p>
                </div>

                {/* OneDrive */}
                <div
                  className={`p-4 border rounded-xl flex flex-col gap-3 transition-colors ${
                    backupLocations.some((l) => l.provider === 'onedrive')
                      ? 'border-blue-200 bg-blue-50/50'
                      : 'border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Cloud size={18} className="text-blue-500" /> OneDrive
                  </div>
                  {backupLocations.some((l) => l.provider === 'onedrive') ? (
                    <div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded w-fit">
                      <CheckCircle size={12} /> Detectado
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Não detectado</div>
                  )}
                  <p
                    className="text-xs text-gray-400 mt-auto truncate"
                    title={backupLocations.find((l) => l.provider === 'onedrive')?.path}
                  >
                    {backupLocations.find((l) => l.provider === 'onedrive')?.path ||
                      'Não disponível'}
                  </p>
                </div>

                {/* Google Drive */}
                <div
                  className={`p-4 border rounded-xl flex flex-col gap-3 transition-colors ${
                    backupLocations.some((l) => l.provider === 'googledrive')
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Cloud size={18} className="text-green-500" /> Google Drive
                  </div>
                  {backupLocations.some((l) => l.provider === 'googledrive') ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-100 px-2 py-1 rounded w-fit">
                      <CheckCircle size={12} /> Detectado
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Não detectado</div>
                  )}
                  <p
                    className="text-xs text-gray-400 mt-auto truncate"
                    title={backupLocations.find((l) => l.provider === 'googledrive')?.path}
                  >
                    {backupLocations.find((l) => l.provider === 'googledrive')?.path ||
                      'Não disponível'}
                  </p>
                </div>
              </div>

              {/* Manual Override */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Local Personalizado (Opcional)
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    readOnly
                    value={customBackupPath || ''}
                    placeholder="Nenhuma pasta selecionada (usando padrão)"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={handleSelectFolder}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-600 text-sm flex items-center gap-2"
                  >
                    <FolderOpen size={16} /> Escolher Pasta
                  </button>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm">
                  {backupMessage && (
                    <span
                      className={`flex items-center gap-2 ${
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
                <button
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className="px-6 py-3 bg-sesi-blue text-white rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isBackingUp ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isBackingUp ? 'Realizando Backup...' : 'Realizar Backup Agora'}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
