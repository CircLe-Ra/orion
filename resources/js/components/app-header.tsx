import { PropsWithChildren, useState } from 'react';
import {
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    Navbar,
    NavbarButton,
    NavbarLogo,
    NavBody,
    NavItems,
} from '@/components/ui/resizable-navbar';
import { Button } from '@/components/ui/moving-border';

const navItems = [
    {
        name: "Features",
        link: "#features",
    },
    {
        name: "Pricing",
        link: "#pricing",
    },
    {
        name: "Contact",
        link: "#contact",
    },
];

export function AppHeader({ children }: PropsWithChildren) {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <div >
            <div className="relative w-full max-w-7xl mx-auto">
                <Navbar >
                    <NavBody>
                        <NavbarLogo />
                        <NavItems items={navItems} />
                        <div className="flex items-center gap-4">
                            <NavbarButton variant="secondary" href={'/login'}>Masuk</NavbarButton>
                            <NavbarButton variant="primary" href={'/register'}>Daftar</NavbarButton>
                        </div>
                    </NavBody>

                    <MobileNav>
                        <MobileNavHeader>
                            <NavbarLogo />
                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </MobileNavHeader>

                        <MobileNavMenu
                            isOpen={isMobileMenuOpen}
                            onClose={() => setIsMobileMenuOpen(false)}
                        >
                            {navItems.map((item, idx) => (
                                <a
                                    key={`mobile-link-${idx}`}
                                    href={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="relative text-neutral-600 dark:text-neutral-300"
                                >
                                    <span className="block">{item.name}</span>
                                </a>
                            ))}
                            <div className="flex w-full flex-col gap-4">
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Masuk
                                </NavbarButton>
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Daftar
                                </NavbarButton>
                            </div>
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>
            </div>
            { children }
        </div>
    );
}
