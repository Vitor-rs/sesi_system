import { useEffect, useCallback } from 'react'
import { CheckCircle, ImageIcon, Image as LucideImage, Save, Upload } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'

export function PersonalizationTab(): React.ReactElement {
  const {
    icons,
    currentIconPath,
    selectedIconPath,
    isUploading,
    uploadMessage,
    setIcons,
    setCurrentIconPath,
    setSelectedIconPath,
    setIsUploading,
    setUploadMessage
  } = useSettingsStore()

  const loadIcons = useCallback(async (): Promise<void> => {
    try {
      const fetchedIcons = await globalThis.window.api.getIcons()
      setIcons(fetchedIcons)
    } catch (error) {
      console.error('Failed to load icons', error)
    }
  }, [setIcons])

  const loadCurrentSettings = useCallback(async (): Promise<void> => {
    try {
      const path = await globalThis.window.api.getSettings('app_icon_path')
      if (path) {
        setCurrentIconPath(path)
        setSelectedIconPath(path)
      }
    } catch (error) {
      console.error('Failed to load settings', error)
    }
  }, [setCurrentIconPath, setSelectedIconPath])

  useEffect(() => {
    loadIcons()
    loadCurrentSettings()
  }, [loadIcons, loadCurrentSettings])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadMessage(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      await globalThis.window.api.uploadIcon(arrayBuffer, file.name)
      await loadIcons()
      setUploadMessage({ type: 'success', text: 'Imagem enviada para galeria!' })
    } catch (error) {
      console.error('Upload failed', error)
      setUploadMessage({ type: 'error', text: 'Falha ao enviar imagem.' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleApplyIcon = async (): Promise<void> => {
    if (!selectedIconPath) return

    try {
      await globalThis.window.api.applyIcon(selectedIconPath)
      setCurrentIconPath(selectedIconPath)
      setUploadMessage({ type: 'success', text: 'Ícone aplicado com sucesso!' })
    } catch (error) {
      console.error('Apply failed', error)
      setUploadMessage({ type: 'error', text: 'Erro ao aplicar ícone.' })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
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

          <div className="lg:col-span-2 h-48 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <LucideImage size={16} /> Galeria de Ícones
            </h3>

            {icons.length === 0 ? (
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
                Nenhum ícone salvo.
              </div>
            ) : (
              <div className="flex overflow-x-auto gap-4 p-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {icons.map((icon) => (
                  <button
                    key={icon.path}
                    onClick={() => setSelectedIconPath(icon.path)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedIconPath === icon.path
                        ? 'border-purple-500 ring-2 ring-purple-100'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    title={icon.name}
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
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleApplyIcon}
            disabled={!selectedIconPath || selectedIconPath === currentIconPath}
            className="w-full sm:w-auto px-8 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            <Save size={16} /> Aplicar Ícone
          </button>

          <div className="text-sm h-6">
            {uploadMessage && (
              <span
                className={`flex items-center gap-2 ${
                  uploadMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {uploadMessage.type === 'success' ? <CheckCircle size={16} /> : null}
                {uploadMessage.text}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
