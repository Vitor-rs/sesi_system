import { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  readonly children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps): React.ReactElement {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      <div className="absolute inset-0 flex h-screen animate-in fade-in duration-700">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden bg-gray-50/50">{children}</main>
        </div>
      </div>
    </div>
  )
}
