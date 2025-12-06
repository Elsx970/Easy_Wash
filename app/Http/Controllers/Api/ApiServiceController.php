<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $services = Service::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        return ServiceResource::collection($services);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): ServiceResource
    {
        $service->load('bookings');

        return new ServiceResource($service);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        $service->update($request->validated());

        return new ServiceResource($service);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Layanan berhasil dihapus.'], 200);
    }
}
