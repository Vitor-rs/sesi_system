import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { StudentsPage } from './pages/StudentsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ClassesPage } from './pages/ClassesPage'
import { ClassDetailsPage } from './features/class-management/pages/ClassDetailsPage'
import { DisciplinesPage } from './pages/DisciplinesPage'

function App(): React.ReactElement {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/:id" element={<ClassDetailsPage />} />
          <Route path="/disciplines" element={<DisciplinesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
