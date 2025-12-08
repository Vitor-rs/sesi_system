import { Bell, Search, ChevronRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { menuStructure, isSection, MenuSection, MenuItem } from '../../config/menu'

export function Header(): React.ReactElement {
  const location = useLocation()

  const getBreadcrumbs = (
    path: string
  ): {
    parent?: MenuSection
    item?: MenuItem
  } => {
    for (const entry of menuStructure) {
      if (isSection(entry)) {
        // Check sub-items
        const subItem = entry.items.find((item) => item.href === path)
        if (subItem) {
          return { parent: entry, item: subItem }
        }
      } else {
        // Check exact match. TS knows this is MenuItem here because of isSection check.
        if (entry.href === path) {
          return { item: entry }
        }
      }
    }
    // Default fallback
    const defaultEntry = menuStructure.find(
      (e) => !isSection(e) && (e as MenuItem).href === '/'
    ) as MenuItem | undefined
    return { item: defaultEntry }
  }

  const { parent, item } = getBreadcrumbs(location.pathname)

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sesi-dark">
        {parent && (
          <>
            <div className="flex items-center gap-2 text-gray-800">
              {parent.icon && <parent.icon size={20} />}
              <span className="font-bold text-lg">{parent.title}</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </>
        )}

        {item && (
          <div className={`flex items-center gap-2 ${parent ? 'text-gray-600' : 'text-gray-800'}`}>
            {item.icon && <item.icon size={20} />}
            <span className={`${parent ? 'font-medium' : 'font-bold text-lg'}`}>
              {item.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sesi-blue/50 w-64"
          />
        </div>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
