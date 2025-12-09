import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '../components/layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { StudentsPage } from '../pages/StudentsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { ReportsPage } from '../pages/ReportsPage'

export function Router(): React.ReactElement {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/alunos" element={<StudentsPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Route>
    </Routes>
  )
}
