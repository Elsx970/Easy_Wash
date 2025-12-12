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
            if (!Schema::hasColumn('bookings', 'location_id')) {
                $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete()->after('user_id');
            }

            if (!Schema::hasColumn('bookings', 'booking_code')) {
                $table->string('booking_code')->nullable()->unique()->after('notes');
            }

            if (!Schema::hasColumn('bookings', 'queue_number')) {
                $table->string('queue_number')->nullable()->index()->after('booking_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'queue_number')) {
                $table->dropColumn('queue_number');
            }

            if (Schema::hasColumn('bookings', 'booking_code')) {
                $table->dropUnique(['booking_code']);
                $table->dropColumn('booking_code');
            }

            if (Schema::hasColumn('bookings', 'location_id')) {
                $table->dropConstrainedForeignId('location_id');
            }
        });
    }
};
