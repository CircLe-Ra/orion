import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse, Service, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Loader2Icon, Settings, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { limitString } from '@/lib/utils';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

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
    description: string;
    image: string;
}

type Props = {
    services: PaginatedResponse<Service>;
}

const ServicePage = ({ services }: Props) => {
    const { flash } = usePage<SharedData>().props;
    const pondRef = useRef<FilePond | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
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
        name: '',
        description: '',
        image: ''
    });

    const submit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (selectedItem){
            put('/studio/services/' + selectedItem, {
                preserveScroll: true,
                onSuccess: () => {
                    setData('name', '');
                    setData('description', '');
                    setData('image', '');
                    if (pondRef.current) {
                        pondRef.current.removeFiles();
                    }
                    setSelectedItem(null);
                    setExistingImage(null);
                }
            });
        }else{
            post('/studio/services', {
                preserveScroll: true,
                onSuccess: () => {
                    setData('name', '');
                    setData('description', '');
                    setData('image', '');
                    if (pondRef.current) {
                        pondRef.current.removeFiles();
                    }
                }
            });
        }
    }

    const handleUpdate = (id: string) => {
        const service = services.data.find((item) => item.id === id);
        if(!service) return;
        setSelectedItem(id);
        setData('name', service.name);
        setData('description', service.description);

        if (service.image) {
            setData('image', service.image);
            setExistingImage(service.image);
            if (pondRef.current) {
                pondRef.current.removeFiles();
                pondRef.current.addFile('/storage/' + service.image);
            }

        } else {
            setData('image', '');
        }
    };


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
                        <CardContent className={'grid gap-4'}>
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
                            <div className={'grid gap-2'}>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea id="description" tabIndex={1} value={data.description} onChange={(e) => setData('description', e.target.value)} required>
                                    {data.description}
                                </Textarea>

                                <InputError message={errors.description} />
                            </div>
                            <div className={'grid gap-2'}>
                                <Label htmlFor="image">Gambar</Label>
                                <FilePond
                                    ref={pondRef}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    {...(selectedItem && existingImage
                                        ? {
                                            files: [
                                                {
                                                    source: existingImage,
                                                    options: { type: 'local' },
                                                },
                                            ],
                                        }
                                        : {})}
                                    server={{
                                        process: {
                                            url: '/uploads',
                                            method: 'POST',
                                            headers: {
                                                'X-CSRF-TOKEN':
                                                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                                                        ?.content || '',
                                            },
                                            onload: (response) => {
                                                const res = JSON.parse(response);
                                                setData('image', res.filepath);
                                                if (selectedItem) {
                                                    setExistingImage('');
                                                }
                                                return res.filepath;
                                            },
                                        },
                                        revert: (uniqueFileId, load, error) => {
                                            fetch(`/reverts`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'X-CSRF-TOKEN':
                                                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                                                            ?.content || '',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({ filepath: uniqueFileId }),
                                            })
                                                .then(() => load())
                                                .catch(() => error('Gagal menghapus file'));
                                        },
                                        load: (source, load, error, progress, abort) => {
                                            fetch(`/storage/${source}`)
                                                .then((res) => res.blob())
                                                .then((blob) => load(blob))
                                                .catch(() => {
                                                    error('Gagal memuat gambar');
                                                    abort();
                                                });
                                        },
                                    }}
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />


                                <InputError message={errors.image} />
                            </div>
                        </CardContent>
                        <CardFooter className={'flex justify-end gap-2'}>
                            <Button
                                className={'cursor-pointer w-20'}
                                variant={'secondary'}
                                onClick={() => {
                                    setSelectedItem(null);
                                    setExistingImage(null);
                                    setData('name', '');
                                    setData('description', '');
                                    setData('image', '');
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
                            <TableData links={services.links} tHead={['Gambar', 'Nama Layanan', 'Deskripsi', 'Aksi']}>
                                {services.data.length > 0
                                    ? services.data.map((service, index) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <img src={'/storage/' + service.image} alt={service.name} className={'w-16 h-16 rounded-full object-cover'} />
                                            </TableCell>
                                            <TableCell>{service.name}</TableCell>
                                            <TableCell>{limitString(service.description, 50)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={'ghost'} size={'sm'} className={'cursor-pointer'}>
                                                            <EllipsisVertical className={'h-4 w-4'} />
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
                                            <TableCell colSpan={5} className={'text-center'}>Tidak ada data</TableCell>
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
