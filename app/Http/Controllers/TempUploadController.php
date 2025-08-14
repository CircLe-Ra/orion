<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class TempUploadController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->hasFile('files')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $file = $request->file('files');
        $path = $file->store('temp', 'public');

        return response()->json([
            'filepath' => $path
        ]);
    }

    public function revert(Request $request)
    {
        $filepath = $request->input('filepath');

        if ($filepath && Storage::disk('public')->exists($filepath)) {
            Storage::disk('public')->delete($filepath);
        }

        return response('', 200);
    }
}
