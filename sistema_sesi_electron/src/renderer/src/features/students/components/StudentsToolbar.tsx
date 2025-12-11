import React from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { FloatingLabelInput } from '../../../components/ui/FloatingLabelInput'
import { FloatingLabelSelect } from '../../../components/ui/FloatingLabelSelect'
import type { Class } from '../../../stores/useClassStore'

interface StudentsToolbarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedClassId: string
  setSelectedClassId: (value: string) => void
  sortBy: 'alphabetical' | 'admission'
  setSortBy: (value: 'alphabetical' | 'admission') => void
  showArchived: boolean
  setShowArchived: (value: boolean) => void
  classes: Class[]
  onAddStudent: () => void
}

export const StudentsToolbar = ({
  searchTerm,
  setSearchTerm,
  selectedClassId,
  setSelectedClassId,
  sortBy,
  setSortBy,
  showArchived,
  setShowArchived,
  classes,
  onAddStudent
}: StudentsToolbarProps): React.ReactElement => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-3 items-center justify-between mb-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
        <div className="relative flex-1 md:w-64 w-full">
          <FloatingLabelInput
            label="Buscar estudante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort Filter */}
          <div className="w-full sm:w-48">
            <FloatingLabelSelect
              label="Ordenar por"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'admission')}
              icon={<Filter size={14} />}
            >
              <option value="alphabetical">Ordem Alfabética</option>
              <option value="admission">Data de Admissão</option>
            </FloatingLabelSelect>
          </div>

          {/* Class Filter */}
          <div className="w-full sm:w-48">
            <FloatingLabelSelect
              label="Turma"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="all">Todas as Turmas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </FloatingLabelSelect>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Mostrar Arquivados</span>
        </label>

        <button
          onClick={onAddStudent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium whitespace-nowrap h-10"
          title="Novo Estudante"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Novo Estudante</span>
        </button>
      </div>
    </div>
  )
}
