import { NavItem } from '@/types';
import { BookOpen, Camera, Database, Folder, Layers, LayoutGrid } from 'lucide-react';

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
                title: 'Pengguna',
                href: '/master-data/users'
            },
            {
                title: 'Peran Pengguna',
                href: '/master-data/roles'
            }
        ],
    },
    {
        title: 'Studio',
        href: null,
        icon: Camera,
        subMenu: [
            {
                title: 'Layanan Studio',
                href: '/studio/services',
            },
            {
                title: 'Paket Foto',
                href: '/studio/packages'
            },
            {
                title: 'Galeri',
                href: '/studio/galleries'
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
