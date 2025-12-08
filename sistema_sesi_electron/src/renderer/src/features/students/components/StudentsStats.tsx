import React from 'react'
import { CheckCircle, Archive, UserX } from 'lucide-react'

interface StudentsStatsProps {
  activeCount: number
  archivedCount: number
  transferredCount: number
}

export const StudentsStats = ({
  activeCount,
  archivedCount,
  transferredCount
}: StudentsStatsProps): React.ReactElement => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Ativos</p>
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
          <CheckCircle size={20} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Arquivados</p>
          <p className="text-2xl font-bold text-gray-900">{archivedCount}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
          <Archive size={20} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Transferidos</p>
          <p className="text-2xl font-bold text-gray-900">{transferredCount}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
          <UserX size={20} />
        </div>
      </div>
    </div>
  )
}
