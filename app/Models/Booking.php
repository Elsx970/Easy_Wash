<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'location_id',
        'service_id',
        'vehicle_type',
        'vehicle_size',
        'vehicle_plate',
        'scheduled_at',
        'estimated_finish_at',
        'status',
        'notes',
        'booking_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'estimated_finish_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service for the booking.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the location for the booking.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Generate unique booking code.
     */
    public static function generateBookingCode(): string
    {
        do {
            $code = str_pad((string) (self::max('id') + 1), 9, '0', STR_PAD_LEFT);
        } while (self::where('booking_code', $code)->exists());

        return $code;
    }
}
