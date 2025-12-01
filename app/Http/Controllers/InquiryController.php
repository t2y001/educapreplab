<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\UserInquiryProgress;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InquiryController extends Controller
{
    protected GamificationService $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    /**
     * Mostrar una indagación
     */
    public function show(Inquiry $inquiry)
    {
        $userId = auth()->id();
        
        // Obtener o crear progreso del usuario
        $progress = UserInquiryProgress::firstOrCreate(
            [
                'user_id' => $userId,
                'inquiry_id' => $inquiry->id,
            ],
            [
                'current_step' => 1,
                'started_at' => now(),
            ]
        );

        return Inertia::render('Inquiry/Show', [
            'inquiry' => [
                'id' => $inquiry->id,
                'title' => $inquiry->title,
                'description' => $inquiry->description,
                'content' => $inquiry->content,
                'total_steps' => $inquiry->getTotalSteps(),
            ],
            'progress' => [
                'current_step' => $progress->current_step,
                'data' => $progress->data ?? [],
                'completed' => $progress->completed,
                'time_spent' => $progress->time_spent,
            ],
        ]);
    }

    /**
     * Guardar progreso de un paso
     */
    public function saveProgress(Request $request, Inquiry $inquiry)
    {
        $validated = $request->validate([
            'step' => 'required|integer|min:1',
            'data' => 'required|array',
        ]);

        $userId = auth()->id();
        $progress = UserInquiryProgress::where('user_id', $userId)
            ->where('inquiry_id', $inquiry->id)
            ->firstOrFail();

        // Guardar datos del paso
        $progress->saveStepData($validated['step'], $validated['data']);

        // Otorgar XP si el paso se completó
        $step = $inquiry->getStep($validated['step']);
        if ($step && isset($step['xp_reward'])) {
            $result = $this->gamificationService->awardXp(
                $userId,
                $step['xp_reward'],
                'inquiry_step_completed',
                'Inquiry',
                $inquiry->id,
                "Completó paso {$validated['step']}: {$step['title']}"
            );

            return response()->json([
                'success' => true,
                'progress' => $progress,
                'gamification' => $result,
            ]);
        }

        return response()->json([
            'success' => true,
            'progress' => $progress,
        ]);
    }

    /**
     * Completar indagación
     */
    public function complete(Request $request, Inquiry $inquiry)
    {
        $userId = auth()->id();
        $progress = UserInquiryProgress::where('user_id', $userId)
            ->where('inquiry_id', $inquiry->id)
            ->firstOrFail();

        // Calcular score basado en respuestas correctas
        $score = $request->input('score', 100);
        
        $progress->markAsCompleted($score);

        // Otorgar XP bonus por completar
        $bonusXp = 50;
        if ($score >= 90) {
            $bonusXp = 100; // Perfección
        }

        $result = $this->gamificationService->awardXp(
            $userId,
            $bonusXp,
            'inquiry_completed',
            'Inquiry',
            $inquiry->id,
            "Completó indagación: {$inquiry->title}"
        );

        return response()->json([
            'success' => true,
            'progress' => $progress,
            'gamification' => $result,
        ]);
    }
}
