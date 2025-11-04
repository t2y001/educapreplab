<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Inquiry; // <-- Asegúrate de tener este modelo
use App\Models\InquiryStep; // <-- Y este
use App\Models\Area;
use App\Models\Tema;
use App\Models\Subtema;

class AdminInquiryController extends Controller
{
    /**
     * Muestra la lista de indagaciones (Index.tsx)
     */
    public function index()
    {
        $inquiries = Inquiry::with(['area', 'tema']) // Carga relaciones para la tabla
            ->orderBy('title')
            ->get();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva indagación
     */
    public function create()
    {
        return Inertia::render('Admin/Inquiries/Create', [
            'areas' => Area::orderBy('nombre')->get(),
            'temas' => Tema::orderBy('nombre')->get(),
            'subtemas' => Subtema::orderBy('nombre')->get(),
        ]);
    }

    /**
     * Guarda la nueva indagación en la BD
     */
    public function store(Request $request)
    {
        // (Aquí añadiríamos validación, por ahora guardamos directo)
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:draft,published',
            'area_id' => 'nullable|exists:areas,id',
            'tema_id' => 'nullable|exists:temas,id',
            'subtema_id' => 'nullable|exists:subtemas,id',
            'steps' => 'required|array|min:1',
            'steps.*.step_text' => 'required|string',
            'steps.*.step_type' => 'required|string',
            // ... (más reglas de validación)
        ]);
        
        DB::transaction(function () use ($validatedData) {
            // 1. Crear la Indagación principal
            $inquiry = Inquiry::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'status' => $validatedData['status'],
                'area_id' => $validatedData['area_id'],
                'tema_id' => $validatedData['tema_id'],
                'subtema_id' => $validatedData['subtema_id'],
            ]);

            // 2. Recorrer y crear cada Paso
            foreach ($validatedData['steps'] as $stepData) {
                $step = $inquiry->inquirySteps()->create([
                    'order' => $stepData['order'],
                    'step_text' => $stepData['step_text'],
                    'step_type' => $stepData['step_type'],
                    'simulation_data' => $stepData['simulation_data'] ?? null,
                ]);

                // 3. Si el paso es de opción múltiple, crear sus opciones
                if ($step->step_type === 'multiple_choice' && !empty($stepData['inquiry_options'])) {
                    foreach ($stepData['inquiry_options'] as $optionData) {
                        $step->inquiryOptions()->create([
                            'option_label' => $optionData['option_label'],
                            'option_text' => $optionData['option_text'],
                            'is_correct' => $optionData['is_correct'],
                            'feedback' => $optionData['feedback'],
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.inquiries.index');
    }

    /**
     * Muestra el formulario para editar una indagación
     */
    public function edit(Inquiry $inquiry)
    {
        // Carga la indagación con sus pasos y las opciones de esos pasos
        $inquiry->load('inquirySteps.inquiryOptions');

        return Inertia::render('Admin/Inquiries/Edit', [
            'inquiry' => $inquiry, // Pasa la indagación a editar
            'areas' => Area::orderBy('nombre')->get(),
            'temas' => Tema::orderBy('nombre')->get(),
            'subtemas' => Subtema::orderBy('nombre')->get(),
        ]);
    }

    /**
     * Actualiza la indagación en la BD
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        // (Validación similar a 'store')
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            // ... (resto de reglas)
            'steps' => 'required|array',
        ]);
        
        DB::transaction(function () use ($validatedData, $inquiry) {
            // 1. Actualizar la indagación principal
            $inquiry->update([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'status' => $validatedData['status'],
                'area_id' => $validatedData['area_id'],
                'tema_id' => $validatedData['tema_id'],
                'subtema_id' => $validatedData['subtema_id'],
            ]);

            // 2. Borrar todos los pasos antiguos (lo más simple)
            // (onDelete('cascade') en la BD borrará las opciones)
            $inquiry->inquirySteps()->delete();

            // 3. Re-crear todos los pasos y opciones (igual que en store)
            foreach ($validatedData['steps'] as $stepData) {
                $step = $inquiry->inquirySteps()->create([
                    'order' => $stepData['order'],
                    'step_text' => $stepData['step_text'],
                    'step_type' => $stepData['step_type'],
                    'simulation_data' => $stepData['simulation_data'] ?? null,
                ]);

                if ($step->step_type === 'multiple_choice' && !empty($stepData['inquiry_options'])) {
                    foreach ($stepData['inquiry_options'] as $optionData) {
                        $step->inquiryOptions()->create([
                            'option_label' => $optionData['option_label'],
                            'option_text' => $optionData['option_text'],
                            'is_correct' => $optionData['is_correct'],
                            'feedback' => $optionData['feedback'],
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.inquiries.index');
    }

    /**
     * Elimina la indagación de la BD
     */
    public function destroy(Inquiry $inquiry)
    {
        // (onDelete('cascade') se encargará de borrar pasos y opciones)
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index');
    }
}