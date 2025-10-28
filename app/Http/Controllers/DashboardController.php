<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $communityStats = [
            'activeUsers' => User::count(),
            'problemSolved' => 1250,
            'SuccessRate' => 78
        ];
        return Inertia::render('Dashboard', [
            'stats' => $communityStats
        ]);
    }
}
