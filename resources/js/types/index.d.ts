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
    },
    search?: string,
    show?: number,
    page?: number
}

export type DialogProps = {
    id: string | null,
    status: boolean,
    dialogType: string
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

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    links: PaginationLinks[];
}


export interface NamedEntity {
    id: string;
    name: string;
}

export interface Service extends NamedEntity {
    description: string;
    image: string;
}

export interface Package extends NamedEntity {
    price: number;
    description: string;
    service_id: string;
    service?: Service;
}


