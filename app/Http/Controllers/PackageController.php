<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $show = $request->show ?? 5;
        $search = $request->search ?? '';
        $page = $request->page ?? 1;

        if ($search) {
            $packages = Package::with('service')->whereHas('service', function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            })->orWhereAny(['name', 'price', 'description'], 'like', '%' . $search . '%')
                ->paginate($show)->withQueryString();
        } else {
            $packages = Package::with('service')->paginate($show)->withQueryString();
        }
        return Inertia::render('studio/package/index', [
            'services' => Service::all(),
            'packages' => $packages,
            'search' => $search,
            'show' => $show,
            'page' => (int)$page
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'required|string',
        ]);
        try {
            Package::create($validated);
            return to_route('packages.index')->with([
                'status' => 'success',
                'message' => 'Paket baru berhasil ditambahkan.'
            ]);
        }catch (\Exception $exception){
            return to_route('packages.index')->with([
                'status' => 'error',
                'message' => 'Error : '.$exception->getMessage()
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Package $package)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Package $package)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'required|string',
        ]);
        try {
            $package->update($validated);
            return to_route('packages.index')->with([
                'status' => 'success',
                'message' => 'Paket berhasil diperbaharui.'
            ]);
        }catch (\Exception $exception){
            return to_route('packages.index')->with([
                'status' => 'error',
                'message' => 'Error : '.$exception->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Package $package)
    {
        try {
            $package->delete();
            return to_route('packages.index')->with([
                'status' => 'success',
                'message' => 'Paket berhasil dihapus.'
            ]);
        }catch (\Exception $exception){
            return to_route('packages.index')->with([
                'status' => 'error',
                'message' => 'Error : '.$exception->getMessage()
            ]);
        }
    }
}
