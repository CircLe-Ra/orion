import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Package, Service, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Loader2Icon, PlusCircle, Settings, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { currency, limitString } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';


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
    packages: Package[];
    services: Service[];
}

const PackagePage = ({ services, packages } : Props) => {
    const { flash } = usePage<SharedData>().props;
    const [open, setOpen] = useState<Dialog>({
        id: null,
        status: false,
    });
    const [displayPrice, setDisplayPrice] = useState('');

    useEffect(() => {
        if (flash.status === 'success') {
            toast.success(flash.message);
        }
        if(flash.status === 'error') {
            toast.error(flash.message);
        }
    }, [flash.status, flash.message]);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm<Required<PackageForm>>({
        service_id: '',
        name: '',
        price: 0,
        description: ''
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(open.id){
            put(`/master-data/package/${open.id}`,{
                preserveScroll: true,
                onSuccess: () => {
                    reset('service_id', 'name', 'price', 'description');
                    setOpen(() => ({
                        id: null,
                        status: false
                    }));
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

    const handleUpdate = (id: string) => {
        const pkg = packages.find((item) => item.id === id);
        console.log(pkg)
        if(!pkg) return;
        setData('service_id', pkg!.service_id.toString());
        setData('name', pkg!.name);
        setData('price', pkg!.price);
        setData('description', pkg!.description);
        setDisplayPrice(currency(pkg!.price.toString()));
        setOpen((prev) => (
            {
                ...prev,
                id: id,
                status: true
            }
        ))
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
                                        <TableHead>Nama Layanan</TableHead>
                                        <TableHead>Nama Paket</TableHead>
                                        <TableHead>Harga Paket</TableHead>
                                        <TableHead>Deskripsi Paket</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {packages.length > 0 ? (
                                        packages.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.service?.name}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{currency(item.price.toString())}</TableCell>
                                                <TableCell>{limitString(item.description, 30)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant={'outline'} size={'sm'} className={'cursor-pointer'}>
                                                                Buka
                                                                <ChevronDown />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent side={'bottom'}>
                                                            <DropdownMenuLabel className={'text-center'}><strong>{item.name}</strong></DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className={'cursor-pointer'} onClick={() => handleUpdate(item.id)}>
                                                                <Settings className={'-mt-0.5 hover:text-white'} />
                                                                Perbarui
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setOpen(prev => ({
                                                                ...prev,
                                                                id: item.id,
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
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className={'text-center'}>Tidak ada data</TableCell>
                                        </TableRow>
                                    ) }
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{open.id ? 'Perbarui Data' : 'Tambah Data'}</DialogTitle>
                        <DialogDescription>
                            Silahkan lengkapi data dibawah ini, dan lakukan aksi simpan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-6">
                            <div className="grid gap-3">
                                <Label htmlFor="service">Layanan Foto</Label>
                                <Select onValueChange={(value) => setData('service_id', value)}
                                        defaultValue={data.service_id}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Layanan</SelectLabel>
                                            {services.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.service_id} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="name">Nama Paket</Label>
                                <Input id="name" name="name" value={data.name}
                                       onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
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
                                    name={'description'}
                                    onChange={(e) => setData('description', e.target.value)}
                                >
                                    {data.description}
                                </Textarea>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => {
                                    setOpen(() => ({
                                            id: null,
                                            status: false
                                        })
                                    );
                                    reset('service_id', 'name', 'price', 'description');
                                    setDisplayPrice('');
                                }} className={'cursor-pointer'}>Tutup</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing} className={'cursor-pointer'}>
                                {processing && <Loader2Icon className={'animate-spin'} />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}

export default PackagePage;
