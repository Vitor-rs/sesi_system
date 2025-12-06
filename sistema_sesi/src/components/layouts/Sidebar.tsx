import {
    Home,
    Users,
    BookOpen,
    Settings,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    Database
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type MenuItem = {
    icon: React.ElementType;
    label: string;
    href: string;
};

type MenuSection = {
    id: string; // Unique ID for state management
    title: string;
    icon?: React.ElementType; // Icon for the accordion trigger
    items: MenuItem[];
};

type MenuEntry = MenuItem | MenuSection;

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    // State to track expanded sections by their ID. Default 'management' to open.
    const [expandedSections, setExpandedSections] = useState<string[]>(['management']);
    const location = useLocation();

    const menuStructure: MenuEntry[] = [
        { icon: Home, label: 'Dashboard', href: '/' },
        {
            id: 'management',
            title: 'Gerenciamento',
            icon: Database, // Icon representing the section
            items: [
                { icon: Users, label: 'Estudantes', href: '/alunos' },
                { icon: BookOpen, label: 'Disciplinas', href: '/disciplinas' },
                { icon: GraduationCap, label: 'Formativas', href: '/formativas' },
            ],
        },
        { icon: Settings, label: 'Configurações', href: '/configuracoes' },
    ];

    const toggleSection = (sectionId: string) => {
        if (!isOpen) setIsOpen(true); // Auto-open sidebar if clicking a section
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const isSection = (entry: MenuEntry): entry is MenuSection => {
        return 'items' in entry;
    };

    return (
        <aside
            className={`bg-sesi-dark text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                } flex flex-col`}
        >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className={`font-bold text-xl ${!isOpen && 'hidden'}`}>
                    SESI System
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 hover:bg-white/10 rounded"
                >
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                        <span className="block w-full h-0.5 bg-white"></span>
                        <span className="block w-full h-0.5 bg-white"></span>
                        <span className="block w-full h-0.5 bg-white"></span>
                    </div>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuStructure.map((entry) => {
                        if (isSection(entry)) {
                            const isExpanded = expandedSections.includes(entry.id);
                            const SectionIcon = entry.icon;

                            return (
                                <li key={entry.id} className="mb-2">
                                    <button
                                        onClick={() => toggleSection(entry.id)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {SectionIcon && <SectionIcon size={20} />}
                                            <span className={`${!isOpen && 'hidden'} font-medium`}>
                                                {entry.title}
                                            </span>
                                        </div>
                                        {isOpen && (
                                            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                        )}
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <ul className="space-y-1 mt-1">
                                            {entry.items.map((subItem) => {
                                                const isActive = location.pathname === subItem.href;
                                                return (
                                                    <li key={subItem.label}>
                                                        <Link
                                                            to={subItem.href}
                                                            className={`flex items-center px-4 py-2 pl-12 transition-colors gap-3 text-sm ${isActive
                                                                ? 'bg-sesi-blue text-white'
                                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                                }`}
                                                            title={!isOpen ? subItem.label : undefined}
                                                        >
                                                            <subItem.icon size={18} />
                                                            <span className={`${!isOpen && 'hidden'}`}>
                                                                {subItem.label}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </li>
                            );
                        } else {
                            // Standard Menu Item
                            const isActive = location.pathname === entry.href;
                            return (
                                <li key={entry.label}>
                                    <Link
                                        to={entry.href}
                                        className={`flex items-center px-4 py-3 transition-colors gap-3 ${isActive
                                            ? 'bg-sesi-blue text-white'
                                            : 'hover:bg-white/10 text-gray-300'
                                            }`}
                                        title={!isOpen ? entry.label : undefined}
                                    >
                                        <entry.icon size={20} />
                                        <span className={`${!isOpen && 'hidden'} whitespace-nowrap`}>
                                            {entry.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        }
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
