// Shared Types for Backend and Frontend

export interface StudentHistoryEvent {
  id: string
  type:
    | 'created'
    | 'archived'
    | 'reactivated'
    | 'transfer_out'
    | 'transfer_in'
    | 'class_change'
    | 'info_update'
  date: string // ISO string
  description: string
}

export interface Student {
  id: string
  name: string
  classId?: string
  status: 'active' | 'inactive' | 'transferred'
  enrollmentType: 'regular' | 'transfer'
  createdAt: string // ISO string for sorting by admission
  transferDate?: string // ISO string
  transferOrigin?: string
  transferCity?: string
  transferState?: string
  transferObservation?: string
  number?: number
  history?: StudentHistoryEvent[]
}

export interface Class {
  id: string
  name: string // Auto-generated: "${grade} ${letter}"
  grade: string // e.g., "4º Ano"
  letter: string // e.g., "A"
  period: 'Matutino' | 'Vespertino' | 'Noturno'
}
