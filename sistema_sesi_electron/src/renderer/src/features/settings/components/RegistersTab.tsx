import React, { useState } from 'react'
import { Plus, X, List, AlertCircle } from 'lucide-react'
import { useSettingsStore } from '../../../stores/useSettingsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

export function RegistersTab(): React.ReactElement {
  const { archivingReasons, addArchivingReason, removeArchivingReason } = useSettingsStore()
  const [newReason, setNewReason] = useState('')

  const handleAdd = (): void => {
    if (newReason.trim()) {
      if (archivingReasons.includes(newReason.trim())) {
        alert('Este motivo já existe.')
        return
      }
      addArchivingReason(newReason.trim())
      setNewReason('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cadastros Diversos</h2>
        <p className="text-gray-500">
          Gerencie listas e opções utilizadas em formulários do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <List className="text-primary h-5 w-5" />
            <CardTitle>Motivos de Arquivamento / Inatividade</CardTitle>
          </div>
          <CardDescription>
            Defina as opções disponíveis ao arquivar ou inativar um estudante (ex: Transferência,
            Mudança).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Novo motivo (ex: Transferência Interna)"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAdd} disabled={!newReason.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {archivingReasons.length === 0 ? (
              <div className="text-center p-4 bg-muted/50 rounded-lg text-muted-foreground flex items-center justify-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Nenhum motivo cadastrado.
              </div>
            ) : (
              archivingReasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-transparent hover:border-gray-200 transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-700">{reason}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeArchivingReason(reason)}
                    title="Remover"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
