<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsProfesor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado
        if (! $request->user()) {
            return redirect()->route('login');
        }
        
        // Verificar si es admin o profesor
        if (! $request->user()->isAdmin() && ! $request->user()->isProfesor()) {
            abort(403, 'No tienes permisos para acceder a esta sección.');
        }
        
        return $next($request);
    }
}
