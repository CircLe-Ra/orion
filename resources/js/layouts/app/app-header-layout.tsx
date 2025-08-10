import { PropsWithChildren } from 'react';
import { AppHeader } from '@/components/app-header';

export default function AppHeaderLayout({ children }: PropsWithChildren) {

    return (
        <AppHeader>
            {children}
        </AppHeader>
    );
}
