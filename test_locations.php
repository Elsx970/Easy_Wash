<?php
require_once 'bootstrap/app.php';
$app = app();
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Get locations
$locations = \App\Models\Location::where('is_active', true)->get();
echo "Total locations: " . $locations->count() . "\n";
foreach ($locations as $loc) {
    echo json_encode($loc->toArray()) . "\n";
}
