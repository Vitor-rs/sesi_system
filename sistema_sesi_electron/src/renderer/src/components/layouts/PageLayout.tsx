import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

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

  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-4 gap-4">
      {/* Standard Header with SidebarTrigger and Breadcrumb */}
      <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-sidebar-border/50 pb-2">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {/* Static breadcrumb for now, can be dynamic later */}
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage className="font-semibold text-sesi-dark">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Actions/Meta */}
        <div className="ml-auto flex items-center gap-2">{action}</div>
      </header>

      {/* Page Title & Back Button (Optional - keeping legacy support but cleaner) */}
      <div className="flex flex-col gap-1 px-2">
        <div className="flex items-center gap-3">
          {backButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          {/* Icon optional in new layout? Keeping for compatibility */}
          {Icon && <Icon className="text-sesi-blue" size={24} />}
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h1>
        </div>
        {description && <p className="text-sm text-gray-500 ml-1">{description}</p>}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative flex flex-col max-w-[1600px] w-full mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}
