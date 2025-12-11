import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { menuStructure, isSection } from '../../config/menu'
import { useLocation, Link } from 'react-router-dom'
import { LogOut, ChevronRight, GraduationCap } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>): React.ReactElement {
  const location = useLocation()

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      {...props}
      className="bg-linear-to-br from-[#005C97] to-[#363795] border-none overflow-x-hidden"
    >
      <SidebarHeader className="h-16 border-b border-white/10 px-4 group-data-[collapsible=icon]:px-1 bg-transparent transition-[padding] duration-300 overflow-hidden">
        <SidebarMenu className="text-center">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/10">
              <Link to="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-linear-to-br from-sesi-green to-[#007a33] text-white shadow-lg shadow-black/10 border border-white/10 transition-all hover:scale-105 shrink-0">
                  <GraduationCap className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-1 transition-[width,opacity,margin] duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 overflow-hidden whitespace-nowrap">
                  <span className="truncate font-bold text-base text-white tracking-tight">
                    SESI Ped
                  </span>
                  <span className="truncate text-xs font-medium text-sidebar-foreground/70">
                    Gestão Pedagógica
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 gap-4 overflow-x-hidden">
        {/* Render itens que NÃO são seção primeiro (ex: Dashboard) */}
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {menuStructure
              .filter((item) => !isSection(item))
              .map((item) => {
                // Type guard manual
                if ('items' in item) return null
                const isActive = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="font-medium h-9 data-[active=true]:bg-white/10 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link to={item.href}>
                        {item.icon && (
                          <item.icon
                            className={isActive ? 'text-white' : 'text-sidebar-foreground/70'}
                          />
                        )}
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Render Seções com Collapsible Pattern */}
        {menuStructure.filter(isSection).map((section) => (
          <Collapsible
            key={section.id}
            title={section.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60 hover:text-white transition-colors mb-1"
              >
                <CollapsibleTrigger>
                  {section.title}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenuSub>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            className="h-9 hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                          >
                            <Link to={item.href}>
                              {item.icon && (
                                <item.icon
                                  className={isActive ? 'text-white' : 'text-sidebar-foreground/70'}
                                />
                              )}
                              <span className="group-data-[collapsible=icon]:hidden">
                                {item.label}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t border-white/10 bg-transparent transition-[padding] duration-300 overflow-hidden">
        <SidebarMenu className="">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-white/10 data-[state=open]:text-white hover:bg-white/10 text-sidebar-foreground hover:text-white transition-colors"
                >
                  <Avatar className="h-9 w-9 rounded-xl border border-white/20 shadow-sm shrink-0">
                    <AvatarImage src="" alt="Vitor R." />
                    <AvatarFallback className="rounded-xl bg-linear-to-br from-sesi-green to-[#007a33] text-white font-bold">
                      VR
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-1 transition-[width,opacity,margin] duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 overflow-hidden whitespace-nowrap">
                    <span className="truncate font-semibold text-sesi-dark">Vitor R.</span>
                    <span className="truncate text-xs text-muted-foreground">Professor</span>
                  </div>
                  <ChevronRight className="ml-auto size-4 text-muted-foreground/50 rotate-90 transition-[width,opacity,margin] duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 overflow-hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-xl border-sidebar-border"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-red-50 hover:text-red-900 focus:bg-red-50 focus:text-red-900 rounded-lg">
                  <LogOut className="mr-2 size-4" />
                  Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
