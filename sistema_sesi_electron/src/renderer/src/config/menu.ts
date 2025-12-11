import {
  Home,
  Users,
  BookOpen,
  Settings,
  GraduationCap,
  Database,
  BarChart3,
  FileText
} from 'lucide-react'
import React from 'react'

export type MenuItem = {
  icon: React.ElementType
  label: string
  href: string
}

export type MenuSection = {
  id: string
  title: string
  icon?: React.ElementType
  items: MenuItem[]
}

export type MenuEntry = MenuItem | MenuSection

export const menuStructure: MenuEntry[] = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: BookOpen, label: 'Minhas Turmas', href: '/classes' },
  {
    id: 'library',
    title: 'Biblioteca Global',
    icon: Database,
    items: [
      { icon: Users, label: 'Todos os Alunos', href: '/students' },
      { icon: GraduationCap, label: 'Banco de Questões', href: '/formativas' } // Placeholder for future
    ]
  },
  {
    id: 'reports',
    title: 'Relatórios',
    icon: BarChart3,
    items: [{ icon: FileText, label: 'Relatórios Gerais', href: '/relatorios' }]
  },
  { icon: Settings, label: 'Configurações', href: '/settings' }
]

export const isSection = (entry: MenuEntry): entry is MenuSection => {
  return 'items' in entry
}
