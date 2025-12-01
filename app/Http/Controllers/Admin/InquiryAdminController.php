<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\InquiryStep;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InquiryAdminController extends Controller
{
    /**
     * Display a listing of inquiries
     */
    public function index()
    {
        $inquiries = Inquiry::with(['steps', 'creator'])
            ->withCount('steps')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
        ]);
    }

    /**
     * Show the form for creating a new inquiry
     */
    public function create()
    {
        return Inertia::render('Admin/Inquiries/Create');
    }

    /**
     * Store a newly created inquiry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'steps' => 'required|array|min:1',
            'steps.*.title' => 'required|string',
            'steps.*.step_type' => 'required|string',
            'steps.*.content' => 'nullable|array',
            'steps.*.simulator_config' => 'nullable|array',
            'steps.*.xp_reward' => 'required|integer|min:0',
            'steps.*.options' => 'nullable|array',
        ]);

        $inquiry = Inquiry::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'created_by' => auth()->id(),
        ]);

        // Create steps
        foreach ($validated['steps'] as $index => $stepData) {
            $step = $inquiry->steps()->create([
                'order' => $index + 1,
                'step_type' => $stepData['step_type'],
                'title' => $stepData['title'],
                'content' => $stepData['content'] ?? [],
                'simulator_config' => $stepData['simulator_config'] ?? null,
                'xp_reward' => $stepData['xp_reward'],
            ]);

            // Create options if it's a multiple choice question
            if (isset($stepData['options']) && is_array($stepData['options'])) {
                foreach ($stepData['options'] as $optIndex => $option) {
                    $step->options()->create([
                        'option_label' => $option['label'] ?? chr(65 + $optIndex), // A, B, C, D
                        'option_text' => $option['text'],
                        'is_correct' => $option['is_correct'] ?? false,
                        'feedback' => $option['feedback'] ?? null,
                        'order' => $optIndex + 1,
                    ]);
                }
            }
        }

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Indagación creada exitosamente');
    }

    /**
     * Display the specified inquiry
     */
    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['steps.options', 'assets', 'creator']);

        return Inertia::render('Admin/Inquiries/Show', [
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Show the form for editing the specified inquiry
     */
    public function edit(Inquiry $inquiry)
    {
        $inquiry->load(['steps.options', 'assets']);

        return Inertia::render('Admin/Inquiries/Edit', [
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Update the specified inquiry
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'steps' => 'required|array|min:1',
        ]);

        $inquiry->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        // Delete existing steps and recreate
        $inquiry->steps()->delete();

        foreach ($validated['steps'] as $index => $stepData) {
            $step = $inquiry->steps()->create([
                'order' => $index + 1,
                'step_type' => $stepData['step_type'],
                'title' => $stepData['title'],
                'content' => $stepData['content'] ?? [],
                'simulator_config' => $stepData['simulator_config'] ?? null,
                'xp_reward' => $stepData['xp_reward'],
            ]);

            if (isset($stepData['options'])) {
                foreach ($stepData['options'] as $optIndex => $option) {
                    $step->options()->create([
                        'option_label' => $option['label'] ?? chr(65 + $optIndex),
                        'option_text' => $option['text'],
                        'is_correct' => $option['is_correct'] ?? false,
                        'feedback' => $option['feedback'] ?? null,
                        'order' => $optIndex + 1,
                    ]);
                }
            }
        }

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Indagación actualizada exitosamente');
    }

    /**
     * Remove the specified inquiry
     */
    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Indagación eliminada exitosamente');
    }
}
