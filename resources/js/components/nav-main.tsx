import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub
} from '@/components/ui/sidebar';
import { type NavItem, SubMenu } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const isSubMenuItem = (item: NavItem): item is Extract<NavItem, { subMenu: SubMenu[] }> => {
    return item.href === null && Array.isArray(item.subMenu);
}

const isActiveSubMenu = (item: NavItem, currentUrl: string): boolean => {
    if(item.href !== null || !Array.isArray(item.subMenu)) return false;
    return item.subMenu.some((sub) => currentUrl.startsWith(sub.href));
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) =>
                        item.href ? (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ): isSubMenuItem(item) ? (
                            <Collapsible key={item.title} defaultOpen={isActiveSubMenu(item, page.url)} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={{ children: item.title }}>
                                            { item.icon && <item.icon />}
                                            { item.title }
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subMenu.map((sub) => (
                                                <SidebarMenuItem key={sub.title}>
                                                    <SidebarMenuButton asChild isActive={page.url.startsWith(sub.href)}>
                                                        <Link href={sub.href}>{sub.title}</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : null
                    )}
                </SidebarMenu>
        </SidebarGroup>
    );
}
