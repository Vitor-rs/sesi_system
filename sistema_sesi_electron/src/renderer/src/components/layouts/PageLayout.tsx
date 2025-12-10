import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'

interface PageLayoutProps {
  readonly icon?: React.ElementType
  readonly title: string
  readonly children: React.ReactNode
  readonly action?: React.ReactNode
}

export function PageLayout({
  icon: Icon,
  title,
  children,
  action
}: PageLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Standard Header - Full Width */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b-2 border-sesi-blue bg-white px-4">
        <div className="flex items-center gap-2 ml-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                {Icon && <Icon className="mr-2 size-5 text-sesi-blue" />}
                <BreadcrumbPage className="font-bold text-lg text-sesi-dark tracking-tight capitalize">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Actions/Meta */}
        <div className="ml-auto flex items-center gap-2">{action}</div>
      </header>

      {/* Content Area with Padding */}
      <div className="flex-1 min-h-0 relative flex flex-col p-6 w-full mx-auto max-w-[1600px]">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
          {children}
        </div>
      </div>
    </div>
  )
}
