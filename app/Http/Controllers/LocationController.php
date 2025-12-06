<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $locations = Location::query()
            ->where('is_active', true)
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return Inertia::render('Locations/Index', [
            'locations' => $locations,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location): Response
    {
        $location->load('bookings');

        return Inertia::render('Locations/Show', [
            'location' => $location,
        ]);
    }
}
