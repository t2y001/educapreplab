<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificamos si el usuario está autenticado y si tiene el rol 'admin'
        if (! $request->user() || ! $request->user()->isAdmin()) {
            // Si el user no es admin, lo redirigimos al dashboard normal.
            return redirect(RouteServiceProvider::HOME);
        }
        return $next($request);
    }
}
