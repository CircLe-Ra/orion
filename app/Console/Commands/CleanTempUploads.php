<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanTempUploads extends Command
{
    protected $signature = 'temp:clean {hours=24}';
    protected $description = 'Delete temp uploads older than N hours';

    public function handle()
    {
        $hours = (int)$this->argument('hours');
        $cutoff = now()->subHours($hours);
        $files = Storage::disk('public')->files('temp');

        foreach ($files as $file) {
            $time = Storage::disk('public')->lastModified($file);
            if (Carbon::createFromTimestamp($time)->lessThan($cutoff)) {
                Storage::disk('public')->delete($file);
            }
        }

        $this->info('Temp cleanup done.');
    }
}
