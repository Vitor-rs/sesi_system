import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../components/layouts/MainLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { StudentsPage } from '../pages/StudentsPage'

export function Router(): React.ReactElement {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/alunos" element={<StudentsPage />} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </MainLayout>
  )
}
