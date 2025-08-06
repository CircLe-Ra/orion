import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { PaginationLinks, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';

interface LinkProps {
    links: PaginationLinks[];
}

export function PaginationData({ links } : LinkProps) {
    const { search, show } = usePage<SharedData>().props;
    if (!links || links.length === 0) return null;

    const parseLabel = (label: string): string => {
        return label
            .replace("&laquo;", "<<")
            .replace("&raquo;", ">>")
            .replace(/<[^>]*>/g, "");
    };

    const handleChangePage = (page: number) => {
        router.get(window.location.pathname, { search, show, page }, { preserveScroll: true});
    }

    return (
        <Pagination className={"mt-4 flex justify-end"}>
            <PaginationContent>
                {links.map((link, i) => {
                        if (link.label.includes("...")) {
                            return (
                                <PaginationItem key={i}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        const isPrev = link.label.includes("&laquo;");
                        const isNext = link.label.includes("&raquo;");

                        if (isPrev) {
                            return (
                                <PaginationItem key={i}>
                                    <PaginationPrevious
                                        href={link.url ?? '#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (link.url) {
                                                const urlParams = new URLSearchParams(link.url.split('?')[1]);
                                                handleChangePage(Number(urlParams.get('page')));
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            );
                        }

                        if (isNext) {
                            return (
                                <PaginationItem key={i}>
                                    <PaginationNext
                                        href={link.url ?? '#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (link.url) {
                                                const urlParams = new URLSearchParams(link.url.split('?')[1]);
                                                handleChangePage(Number(urlParams.get('page')));
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href={link.url ?? '#'}
                                    isActive={link.active}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.url){
                                            const urlParams = new URLSearchParams(link.url.split('?')[1]);
                                            handleChangePage(Number(urlParams.get('page')));
                                        }
                                    }}
                                >
                                    {parseLabel(link.label)}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })
                }
            </PaginationContent>
        </Pagination>
    )
}
