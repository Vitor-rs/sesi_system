import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageLayoutProps {
  readonly icon?: React.ElementType
  readonly title: string
  readonly description?: string
  readonly children: React.ReactNode
  readonly action?: React.ReactNode
  readonly backButton?: boolean
}

export function PageLayout({
  icon: Icon,
  title,
  description,
  children,
  action,
  backButton
}: PageLayoutProps): React.ReactElement {
  const navigate = useNavigate()
  // Actually, for backButton we need useNavigate from react-router-dom

  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-5 gap-4">
      {/* Fixed Page Sub-Header */}
      <header className="flex-none flex items-start justify-between border-b-2 border-sesi-blue/20 pb-4 shrink-0 max-w-[1600px] w-full mx-auto">
        <div className="flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3">
              {backButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="mr-2 p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  aria-label="Voltar"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              {Icon && <Icon className="text-sesi-blue" size={28} />}
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
            </div>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {action && <div className="flex gap-2">{action}</div>}
        </div>
      </header>

      {/* Content Area */}
      {/* We provide a flex-1 container that handles the 'rest' of the space.
          The child is responsible for managing its own scroll if it wants to be split (like Dashboard).
          Or if it's a simple page, it can just be overflow-auto.
          But to allow standard simple pages to scroll, we default to hidden here
          and let the child be flex-col h-full.
      */}
      <div className="flex-1 min-h-0 relative flex flex-col max-w-[1600px] w-full mx-auto">
        {children}
      </div>
    </div>
  )
}
