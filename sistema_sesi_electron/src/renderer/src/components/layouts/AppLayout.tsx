import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'

export function AppLayout(): React.ReactElement {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-full w-full overflow-hidden bg-gray-50/50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
