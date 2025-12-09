import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, School, BookOpen, Settings, LogOut } from 'lucide-react'

export function AppLayout(): React.ReactElement {
  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <AppSidebar />
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

function AppSidebar(): React.ReactElement {
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Estudantes', icon: Users, to: '/students' },
    { label: 'Turmas', icon: School, to: '/classes' },
    { label: 'Disciplinas', icon: BookOpen, to: '/disciplines' },
    { label: 'Configurações', icon: Settings, to: '/settings' }
  ]

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 mb-2">
        <div className="h-8 w-8 bg-sesi-blue rounded-lg mr-3 flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="font-bold text-lg text-gray-800 tracking-tight">SESI System</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to))
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                size={20}
                className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
              />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  )
}
