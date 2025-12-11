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
  status: 'active' | 'inactive'
  inactiveReason?: string // e.g. "Transferred", "Moved", "Dropout"

  // Admission Info
  enrollmentType: 'regular' | 'transfer_in' | 'late_admission'
  admissionDate?: string // ISO string (YYYY-MM-DD)

  // Origin Info
  originType?: 'sesi_internal' | 'public' | 'private_scholarship' | 'private_paying' | 'other'
  originDescription?: string // Name of previous school, etc.
  originObservation?: string // "Observação opcional"

  createdAt: string // ISO string
  number?: number
  history?: StudentHistoryEvent[]
}

export interface Class {
  id: string
  name: string // "4º Ano A"
  grade: string // "4" or "4º Ano"
  letter: string // "A"
  // Removed period, capacity, year, etc. as requested for simplification
}

export interface FormativeTemplate {
  id: string
  name: string
  type: 'simple' | 'composite'
  defaultMaxPoints: number
  isGeneric: boolean
  disciplineId?: string | null
}

export interface ClassDiscipline {
  id: string
  classId: string
  disciplineId: string
  teacherName?: string | null
  discipline: {
    id: string
    name: string
  }
}

export interface BackupProvider {
  provider: 'onedrive' | 'googledrive' | 'local'
  path: string
  isAvailable: boolean
}

export interface SecurityStatus {
  isEnabled: boolean
  hasRecoveryKit: boolean
  autoLockTimeout: number
}

export interface Discipline {
  id: string
  name: string
}
