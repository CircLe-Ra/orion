import { NavItem } from '@/types';
import { BookOpen, Database, Folder, LayoutGrid } from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Master Data',
        href: null,
        icon: Database,
        subMenu: [
            {
                title: 'Layanan Studio',
                href: '/master-data/services',
            },
            {
                title: 'Paket Foto',
                href: '/master-data/package'
            }
        ],
    }
];


export const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
