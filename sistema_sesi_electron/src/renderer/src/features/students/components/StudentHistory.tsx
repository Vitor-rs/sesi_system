import {
  Circle,
  UserPlus,
  Archive,
  RefreshCw,
  ArrowRightLeft,
  UserCog,
  Calendar
} from 'lucide-react'
import type { StudentHistoryEvent } from '../../../stores/useStudentStore'

interface StudentHistoryProps {
  readonly events: StudentHistoryEvent[]
}

export function StudentHistory({ events }: StudentHistoryProps): React.ReactElement {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum histórico registrado.</p>
      </div>
    )
  }

  // Sort events by date descending (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getEventIcon = (type: StudentHistoryEvent['type']): React.ReactElement => {
    switch (type) {
      case 'created':
        return <UserPlus size={16} className="text-blue-600" />
      case 'archived':
        return <Archive size={16} className="text-gray-600" />
      case 'reactivated':
        return <RefreshCw size={16} className="text-green-600" />
      case 'transfer_out':
        return <ArrowRightLeft size={16} className="text-red-600" />
      case 'transfer_in':
        return <ArrowRightLeft size={16} className="text-green-600" />
      case 'class_change':
        return <RefreshCw size={16} className="text-orange-600" />
      case 'info_update':
        return <UserCog size={16} className="text-indigo-600" />
      default:
        return <Circle size={16} className="text-gray-400" />
    }
  }

  const getEventColor = (type: StudentHistoryEvent['type']): string => {
    switch (type) {
      case 'created':
        return 'bg-blue-100 border-blue-200'
      case 'archived':
        return 'bg-gray-100 border-gray-200'
      case 'reactivated':
        return 'bg-green-100 border-green-200'
      case 'transfer_out':
        return 'bg-red-100 border-red-200'
      case 'transfer_in':
        return 'bg-green-100 border-green-200'
      case 'class_change':
        return 'bg-orange-100 border-orange-200'
      case 'info_update':
        return 'bg-indigo-100 border-indigo-200'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const getEventTitle = (type: StudentHistoryEvent['type']): string => {
    switch (type) {
      case 'created':
        return 'Estudante Cadastrado'
      case 'archived':
        return 'Arquivado'
      case 'reactivated':
        return 'Reativado'
      case 'transfer_out':
        return 'Transferido (Saída)'
      case 'transfer_in':
        return 'Transferido (Entrada)'
      case 'class_change':
        return 'Mudança de Turma'
      case 'info_update':
        return 'Dados Atualizados'
      default:
        return 'Evento'
    }
  }

  const formatDate = (dateStr: string): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr))
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedEvents.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx < sortedEvents.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getEventColor(event.type)}`}
                  >
                    {getEventIcon(event.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getEventTitle(event.type)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-gray-500 flex items-center gap-1 self-start">
                    <Calendar size={12} />
                    <time dateTime={event.date}>{formatDate(event.date)}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
