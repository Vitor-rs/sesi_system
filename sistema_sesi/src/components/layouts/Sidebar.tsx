import { Home, Users, BookOpen, Settings, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/' },
        { icon: BookOpen, label: 'Disciplinas', href: '/disciplinas' },
        { icon: Users, label: 'Alunos', href: '/alunos' },
        { icon: GraduationCap, label: 'Formativa', href: '/formativas' },
        { icon: Settings, label: 'Configurações', href: '/configuracoes' },
    ];

    return (
        <aside className={`bg-sesi-dark text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
            <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className={`font-bold text-xl ${!isOpen && 'hidden'}`}>SESI System</div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-white/10 rounded">
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                        <span className="block w-full h-0.5 bg-white"></span>
                        <span className="block w-full h-0.5 bg-white"></span>
                        <span className="block w-full h-0.5 bg-white"></span>
                    </div>
                </button>
            </div>

            <nav className="flex-1 py-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <li key={item.label}>
                                <Link
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 transition-colors gap-3 ${isActive ? 'bg-sesi-blue text-white' : 'hover:bg-white/10 text-gray-300'}`}
                                >
                                    <item.icon size={20} />
                                    <span className={`${!isOpen && 'hidden'} whitespace-nowrap`}>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sesi-blue flex items-center justify-center font-bold">
                        VR
                    </div>
                    <div className={`${!isOpen && 'hidden'}`}>
                        <p className="font-medium text-sm">Vitor R.</p>
                        <p className="text-xs text-gray-400">Professor</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
