<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RehashUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:rehash {--dry-run : Preview only, do not change database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Re-hash plain-text user passwords. Only updates passwords that do not appear hashed.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Scanning users for non-hashed passwords...');

        $users = User::all();
        $count = 0;
        $updated = 0;

        foreach ($users as $user) {
            $count++;
            $pwd = (string) $user->password;

            // If password already looks like a modern hash (bcrypt/argon), skip.
            if (preg_match('/^\$(2y|argon2i|argon2id|argon)\$/', $pwd)) {
                continue;
            }

            $this->line("Will rehash: {$user->email}");

            if (! $this->option('dry-run')) {
                $user->password = Hash::make($pwd);
                $user->save();
                $updated++;
            }
        }

        $this->info("Checked {$count} users.");
        if ($this->option('dry-run')) {
            $this->info("Dry-run complete. Users that would be re-hashed are listed above. No changes made.");
        } else {
            $this->info("Re-hashed passwords for {$updated} users.");
        }

        return 0;
    }
}
