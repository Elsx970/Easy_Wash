<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'user' => new UserResource($this->whenLoaded('user')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'location' => new LocationResource($this->whenLoaded('location')),
            'vehicle_type' => $this->vehicle_type,
            'vehicle_size' => $this->vehicle_size,
            'vehicle_plate' => $this->vehicle_plate,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'estimated_finish_at' => $this->estimated_finish_at?->toIso8601String(),
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
