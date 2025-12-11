import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useSettingsStore } from '../../../stores/useSettingsStore'

interface ArchiveStudentModalProps {
  readonly isOpen: boolean
  readonly studentName: string
  readonly onConfirm: (reason: string) => void
  readonly onCancel: () => void
}

export function ArchiveStudentModal({
  isOpen,
  studentName,
  onConfirm,
  onCancel
}: ArchiveStudentModalProps): React.ReactElement {
  const { archivingReasons } = useSettingsStore()
  const [reason, setReason] = useState<string>('')

  const handleConfirm = (): void => {
    if (reason) {
      onConfirm(reason)
      setReason('') // Reset for next time
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">Arquivar Estudante</DialogTitle>
          <DialogDescription className="text-center">
            Deseja arquivar <strong>{studentName}</strong>? O estudante será movido para inativos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Motivo do Arquivamento</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason" className="w-full">
                <SelectValue placeholder="Selecione um motivo..." />
              </SelectTrigger>
              <SelectContent>
                {archivingReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={handleConfirm}
            disabled={!reason}
          >
            Arquivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
