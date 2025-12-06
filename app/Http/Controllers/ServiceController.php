<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $services = Service::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Services/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::create($request->validated());

        return redirect()->route('services.index')
            ->with('success', 'Layanan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): Response
    {
        $service->load('bookings');

        return Inertia::render('Services/Show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service): Response
    {
        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return redirect()->route('services.index')
            ->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Layanan berhasil dihapus.');
    }
}
