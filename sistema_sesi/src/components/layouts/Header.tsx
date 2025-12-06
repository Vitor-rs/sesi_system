import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Header() {
    const location = useLocation();

    const getPageTitle = (path: string) => {
        switch (path) {
            case '/': return 'Dashboard';
            case '/alunos': return 'Estudantes';
            case '/disciplinas': return 'Disciplinas';
            case '/formativas': return 'Formativas';
            case '/configuracoes': return 'Configurações';
            default: return 'Dashboard';
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-sesi-dark">
                    {getPageTitle(location.pathname)}
                </h1>
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
    );
}
