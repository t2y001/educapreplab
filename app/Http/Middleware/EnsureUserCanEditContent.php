<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanEditContent
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
        
        // Admin siempre puede editar
        if ($request->user()->isAdmin()) {
            return $next($request);
        }
        
        // Para profesores, verificar permisos según el contenido
        // Obtener area_id y audiencia_id del request o route parameters
        $areaId = $request->input('area_id') ?? $request->route('area_id');
        $audienciaId = $request->input('audiencia_id') ?? $request->route('audiencia_id');
        
        if (! $request->user()->canEditContent($areaId, $audienciaId)) {
            abort(403, 'No tienes permisos para editar este contenido.');
        }
        
        return $next($request);
    }
}
