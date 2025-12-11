import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageLayoutProps {
  readonly icon?: React.ElementType
  readonly title: string
  readonly description?: string
  readonly children: React.ReactNode
  readonly action?: React.ReactNode
  readonly subHeader?: React.ReactNode
  readonly backButton?: boolean
}

export function PageLayout({
  icon: Icon,
  title,
  description,
  children,
  action,
  subHeader,
  backButton
}: PageLayoutProps): React.ReactElement {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full w-full bg-gray-50/50">
      {/* Standard Header - Full Width */}
      <header className="flex flex-col bg-white shadow-sm z-10">
        <div className="flex h-16 shrink-0 items-center gap-2 px-6 border-b-2 border-sesi-blue">
          <div className="flex items-center gap-3">
            {backButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1"
              >
                <ArrowLeft className="size-5 text-gray-500" />
              </button>
            )}
            <div className="p-2 bg-sesi-blue/10 rounded-lg">
              {Icon && <Icon className="size-5 text-sesi-blue" />}
            </div>
            <div className="flex flex-col">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold text-lg text-gray-900 tracking-tight">
                      {title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {description && <p className="text-xs text-gray-500 font-medium">{description}</p>}
            </div>
          </div>

          {/* Page Actions/Meta */}
          <div className="ml-auto flex items-center gap-2">{action}</div>
        </div>

        {/* Optional Sub-Header (Double Header) */}
        {subHeader && (
          <div className="bg-gray-50/50 px-6 py-2 border-b border-gray-200">{subHeader}</div>
        )}
      </header>

      {/* Content Area with Padding */}
      <main className="flex-1 min-h-0 relative overflow-hidden">
        <div className="h-full w-full p-6 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] h-full flex flex-col">{children}</div>
        </div>
      </main>
    </div>
  )
}
