import { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar-context'
import { AppSidebar } from './AppSidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function CustomTrigger(): React.ReactElement {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const showTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (): void => {
    setIsHovered(true)

    // Clear existing timers
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

    // Wait 2.5s before showing
    showTimerRef.current = setTimeout(() => {
      setShowTooltip(true)

      // Wait 2.5s visible then hide
      hideTimerRef.current = setTimeout(() => {
        setShowTooltip(false)
      }, 2500)
    }, 2500)
  }

  const handleMouseLeave = (): void => {
    setIsHovered(false)
    setShowTooltip(false) // Hide immediately on leave
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }

  // Logic for Rotation (Y-Axis / Coin Spin)
  // Collapsed: Default < (0deg), Hover > (180deg flip)
  // Expanded: Default > (180deg flat), Hover < (0deg)
  const shouldRotate = (isCollapsed && isHovered) || (!isCollapsed && !isHovered)

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleSidebar}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variant="ghost"
            size="icon"
            className="absolute -left-2.5 top-[63px] -translate-y-1/2 h-5 w-5 p-0 rounded-full bg-sesi-blue text-white border-2 border-transparent shadow-md hover:bg-white hover:text-sesi-blue hover:rounded-[4px] hover:border-sesi-blue hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 flex items-center justify-center group ring-0 outline-none will-change-[border-radius,transform]"
          >
            <ArrowLeft
              className={`size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${shouldRotate ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}
            />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={10}
          className="bg-[#e6efff] text-[#0047BB] border border-[#0047BB]/20 rounded-md shadow-sm font-medium"
        >
          <p>{isCollapsed ? 'Expandir' : 'Recolher'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function AppLayout(): React.ReactElement {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <CustomTrigger />
        <div className="flex flex-col h-full w-full overflow-hidden bg-gray-50/50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
