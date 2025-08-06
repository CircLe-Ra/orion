import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { CircleX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationData } from '@/components/pagination-data';
import { router, usePage } from '@inertiajs/react';
import { PaginationLinks, SharedData } from '@/types';

type Props = {
    links: PaginationLinks[];
    tHead: string[];
    showPerPage?: number;
    children: React.ReactNode;
}

export default function TableData({ children, links, tHead, showPerPage = 5 }: Props) {
    const { search, show, page } = usePage<SharedData>().props;
    const [query, setQuery] = useState<string>(search || '');
    const [perPage, setPerPage] = useState<number>(show || showPerPage);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(window.location.pathname, { search: query, show: perPage, page },{
                replace: true,
                preserveState: true,
                preserveScroll: true
            });
        }, 200);

        return () => clearTimeout(timeout);
    }, [query, perPage, page]);

    return (
        <>
            <div className={"mb-4 flex"}>
                <div className={"relative"}>
                    <Input
                        type="text"
                        placeholder="Cari..."
                        className="w-64"
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <CircleX className={`absolute right-2 size-4 top-2.5 cursor-pointer ${query.length === 0 ? 'hidden' : 'block'}`} onClick={() => setQuery('')} />
                </div>
                <Select onValueChange={(e) => setPerPage(parseInt(e))}>
                    <SelectTrigger className="w-24 ml-2">
                        <SelectValue placeholder={perPage} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={'1000'} onSelect={() => perPage == 1000}>Semua</SelectItem>
                        {[5, 10, 25, 50].map(item => (
                            <SelectItem key={item} value={item.toString()}>{item}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        {tHead.map((item, index) => {
                            return (
                                <TableHead key={index}>{item}</TableHead>
                            )
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {children}
                </TableBody>
            </Table>
            <PaginationData links={links} />
        </>
    );
}
