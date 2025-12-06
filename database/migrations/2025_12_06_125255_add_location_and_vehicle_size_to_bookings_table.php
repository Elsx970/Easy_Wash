<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->string('vehicle_size')->nullable()->after('vehicle_type'); // M, L, atau null untuk motor
            $table->string('booking_code')->nullable()->after('id')->unique(); // Kode booking seperti "000000001"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn(['location_id', 'vehicle_size', 'booking_code']);
        });
    }
};
