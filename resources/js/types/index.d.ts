import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string | null;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export type SubMenu = {
    title: string,
    href: string,
}

export type NavItem = | {
    title: string;
    href: string;
    icon: LucideIcon | null;
    isActive?: boolean;
    subMenu?: undefined
} | {
    title: string;
    href: null;
    icon?: LucideIcon | null;
    isActive?: boolean;
    subMenu: SubMenu[];
}
// export interface NavItem {
//     title: string;
//     href: string | null;
//     icon?: LucideIcon | null;
//     isActive?: boolean;
//     subItem?:SubMenu[] | null;
// }

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
    flash: {
        status: string,
        message: string
    }
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Service {
    id: string;
    name: string;
}

export interface Package {
    id: string;
    name: string;
    price: number;
    description: string;
    service_id: string;
    service?: Service;
}
