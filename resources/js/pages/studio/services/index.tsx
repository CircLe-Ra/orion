import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse, Service, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { MouseEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronRight, Loader2Icon, Settings, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import TableData from '@/components/table-data';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard'
    },{
        title: 'Studio',
    },
    {
        title: 'Layanan Studio',
        href: 'studio/services'
    }
];

type ServiceForm = {
    name: string;
}

type Props = {
    services: PaginatedResponse<Service>;
}

const ServicePage = ({ services }: Props) => {
    const { flash } = usePage<SharedData>().props;
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [open, setOpen] = useState<{ id: string | null; status: boolean }>({
        id: null,
        status: false,
    });

    useEffect(() => {
        if (flash.status === 'success') {
            toast.success(flash.message);
        }
        if(flash.status === 'error') {
            toast.error(flash.message);
        }
    }, [flash.status, flash.message]);


    const { data, setData, post, put, delete: destroy, processing, errors } = useForm<Required<ServiceForm>>({
        name: ''
    });

    const submit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (selectedItem){
            put('/studio/services/' + selectedItem, {
                preserveScroll: true,
                onSuccess: () => {
                    setData('name', '');
                    setSelectedItem(null);
                }
            });
        }else{
            post('/studio/services', {
                preserveScroll: true,
                onSuccess: () => {
                    setData('name', '');
                }
            });
        }
    }

    const handleUpdate = (id: string) => {
        const service = services.data.find((item) => item.id === id);
        if(!service) return;
        setSelectedItem(id);
        setData('name', service!.name);
    }

    const handleDelete = (id: string) => {
        destroy(`/studio/services/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen({
                    id:null,
                    status: false
                });
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Layanan Studio'} />
            <div className="px-4 py-6">
                <Heading title="Layanan" description="Tambahkan daftar layanan yang akan kamu buka" />
                <div className={'flex flex-col items-center justify-between gap-4 lg:flex-row'}>
                    <Card className={'w-full self-start lg:w-3/8'}>
                        <CardHeader>
                            <CardTitle>Input Data Layanan</CardTitle>
                            <CardDescription>Isikan nama layanan pada kolom lalu simpan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={'grid gap-2'}>
                                <Label htmlFor="name">Nama Layanan</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>
                        </CardContent>
                        <CardFooter className={'flex justify-end gap-2'}>
                            <Button
                                className={'cursor-pointer w-20'}
                                variant={'secondary'}
                                onClick={() => {
                                    setSelectedItem(null);
                                    setData('name', '');
                                }}>
                            Batal
                            </Button>
                            <Button onClick={submit} disabled={processing} className={'cursor-pointer w-20'}>
                                {processing && (<Loader2Icon className="animate-spin" />)}
                                {processing ? '' : selectedItem ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className={'w-full self-start lg:w-3/4'}>
                        <CardHeader>
                            <CardTitle>Data Layanan</CardTitle>
                            <CardDescription>Data layanan yang telah diinputkan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TableData links={services.links} tHead={['Nama Layanan', 'Aksi']}>
                                {services.data.length > 0
                                    ? services.data.map((service, index) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{service.name}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={'outline'} size={'sm'} className={'cursor-pointer'}>
                                                            Menu
                                                            <ChevronRight />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side={'right'}>
                                                        <DropdownMenuLabel className={'text-center'}><strong>{service.name}</strong></DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className={'cursor-pointer'} onClick={() => handleUpdate(service.id)}>
                                                            <Settings className={'-mt-0.5 hover:text-white'} />
                                                            Perbarui
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setOpen(prev => ({
                                                            ...prev,
                                                            id: service.id,
                                                            status: true
                                                        }))} className={'cursor-pointer'}>
                                                            <Trash2 className={'-mt-0.5 hover:text-white'} />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : (
                                        <TableRow>
                                            <TableCell colSpan={4} className={'text-center'}>Tidak ada data</TableCell>
                                        </TableRow>
                                    )}
                            </TableData>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <AlertDialog open={open.status}
                         onOpenChange={(isOpen) =>
                             setOpen(prev => ({
                            ...prev,
                            status:isOpen
                        }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kamu yakin akan menghapus data ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data Anda secara permanen
                            dan menghapus data Anda dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpen(()  => ({
                            id:null,
                            status: false
                        }))}>Batal</AlertDialogCancel>
                        <AlertDialogAction className={'bg-red-500 hover:bg-red-500 cursor-pointer'} onClick={() => handleDelete(open.id!)}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

export default ServicePage;
