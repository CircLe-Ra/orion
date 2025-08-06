<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';
        $show = $request->show ?? 5;
        $page = $request->page ?? 1;

        if($search){
            $services = Service::where('name', 'like', '%' . $search . '%')->paginate($show)->withQueryString();
        }else{
            $services = Service::paginate($show)->withQueryString();
        }

        return Inertia::render('master-data/services/index',[
            'services' => $services,
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
            'name' => 'required|string',
        ]);

        try {
            Service::create($validated);
            return to_route('services.index')->with([
                'status' => 'success',
                'message' => 'Layanan baru berhasil ditambahkan.'
            ]);
        }catch (\Exception $exception){
            return to_route('services.index')->with([
                'status' => 'error',
                'message' => 'Error : '.$exception->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        try {
            $service->update($validated);
            return to_route('services.index')->with([
                'status' => 'success',
                'message' => 'Layanan berhasil diperbaharui.'
            ]);
        }catch (\Exception $exception){
            return to_route('services.index')->with([
                'status' => 'error',
                'message' => 'Error : '.$exception->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        try{
            $service->delete();
            return to_route('services.index')->with([
                'status' => 'success',
                'message' => 'Layanan berhasil dihapus.'
            ]);
        }catch (\Exception $exception){
            return to_route('services.index')->with([
                'status' => 'error',
                'message' => 'Error : '.$exception->getMessage()
            ]);
        }
    }
}
