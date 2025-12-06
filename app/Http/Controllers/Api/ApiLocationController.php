<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $locations = Location::query()
            ->where('is_active', true)
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return LocationResource::collection($locations);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location): LocationResource
    {
        return new LocationResource($location);
    }
}
