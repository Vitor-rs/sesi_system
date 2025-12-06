import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';

export function Router() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="*" element={<div>Página não encontrada</div>} />
            </Routes>
        </MainLayout>
    );
}
