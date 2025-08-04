import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { FormEvent, useState } from 'react';
import { Loader2Icon, PlusCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { currency } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard'
    },{
        title: 'Master Data',
    },
    {
        title: 'Paket Foto',
        href: 'master-data/package'
    }
];

type PackageForm = {
    service_id: string;
    name: string;
    price: number;
    description: string;
}

type Dialog = {
    id: string | null,
    status: boolean
}

type Props = {
    services: Service[];
}

const PackagePage = ({ services } : Props) => {
    const [open, setOpen] = useState<Dialog>({
        id: null,
        status: false,
    });
    const [itemSelected, setItemSelected] = useState<string | null>(null);
    const [displayPrice, setDisplayPrice] = useState('');

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm<Required<PackageForm>>({
        service_id: '',
        name: '',
        price: 0,
        description: ''
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(itemSelected){
            put(`/master-data/package/${itemSelected}`,{
                preserveScroll: true,
                onSuccess: () => {
                    reset('service_id', 'name', 'price', 'description');
                    setOpen(() => ({
                        id: null,
                        status: false
                    }));
                    setItemSelected(null);
                },
            });
        }else{
            post('/master-data/package', {
                preserveScroll: true,
                onSuccess: () => {
                    reset('service_id', 'name', 'price', 'description');
                    setOpen(() => ({
                        id: null,
                        status: false
                    }));
                },
            });
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Paket Foto'} />
            <div className="px-4 py-6">
                <Heading title="Paket" description="Tambahkan daftar paket yang akan kamu berikan" />
                <div className={'flex flex-col items-center justify-between gap-4 lg:flex-row'}>
                    <Card className={'w-full'}>
                        <CardHeader>
                            <div className={'flex justify-between items-center'}>
                                <div>
                                    <CardTitle>Data Paket</CardTitle>
                                    <CardDescription>Data paket yang telah diinputkan</CardDescription>
                                </div>
                                <div>
                                    <Button onClick={() => setOpen(prev => ({
                                            ...prev,
                                            id: null,
                                            status: true
                                        })
                                    )}>
                                        <PlusCircle />
                                        Tambah Paket
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">No.</TableHead>
                                        <TableHead>Nama Paket</TableHead>
                                        <TableHead>Harga Paket</TableHead>
                                        <TableHead>Deskripsi Paket</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Dialog open={open.status} onOpenChange={(isOpen) => (
                setOpen(prev => ({
                    ...prev,
                    status: isOpen
                }))
            )}>
                <form onSubmit={submit}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{open.id ? 'Perbarui Data' : 'Tambah Data'}</DialogTitle>
                            <DialogDescription>
                                Silahkan lengkapi data dibawah ini, dan lakukan aksi simpan.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="service">Layanan Foto</Label>
                                <Input id="service" name="service" autoFocus value={data.service_id} onChange={(e) => setData('service_id', e.target.value)} />
                                <InputError message={ errors.service_id } />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name">Nama Paket</Label>
                                <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={ errors.name } />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="price">Harga Paket</Label>
                                <Input id="price"
                                       name="price"
                                       placeholder={currency(data.price.toString())}
                                       value={displayPrice}
                                       onChange={(e) => {
                                           const raw = e.target.value.replace(/\D/g, '');
                                           const num = parseInt(raw || '0', 10);
                                           setData('price', num);
                                           setDisplayPrice(currency(raw));
                                       }}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="desc">Deskripsi Paket</Label>
                                <Textarea
                                    placeholder="Masukan deskripsi paket..."
                                    id="desc"
                                    name={'desc'}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>

                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => setOpen(() => ({
                                    id: null,
                                    status: false,
                                }))}>Tutup</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2Icon className={'animate-spin'} />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </AppLayout>
    )
}

export default PackagePage;
