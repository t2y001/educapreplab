<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementsSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            // INDAGACIÓN (Inquiry)
            [
                'code' => 'first_hypothesis',
                'name' => 'Primera Hipótesis',
                'description' => 'Formula tu primera hipótesis científica',
                'category' => 'inquiry',
                'icon' => '🤔',
                'xp_reward' => 50,
                'rarity' => 'common',
                'criteria' => ['action_type' => 'hypothesis_validated', 'target' => 1],
                'is_secret' => false,
            ],
            [
                'code' => 'experimenter_persistent',
                'name' => 'Experimentador Persistente',
                'description' => 'Completa 10 indagaciones científicas',
                'category' => 'inquiry',
                'icon' => '🔬',
                'xp_reward' => 100,
                'rarity' => 'common',
                'criteria' => ['action_type' => 'inquiry_guided_completed', 'target' => 10],
                'is_secret' => false,
            ],
            [
                'code' => 'variable_master',
                'name' => 'Maestro de Variables',
                'description' => 'Identifica correctamente variables en 20 experimentos',
                'category' => 'inquiry',
                'icon' => '📊',
                'xp_reward' => 150,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'hypothesis_correct', 'target' => 20],
                'is_secret' => false,
            ],
            [
                'code' => 'experiment_designer',
                'name' => 'Diseñador de Experimentos',
                'description' => 'Crea tu primera indagación abierta',
                'category' => 'inquiry',
                'icon' => '🎨',
                'xp_reward' => 200,
                'rarity' => 'epic',
                'criteria' => ['action_type' => 'inquiry_open_completed', 'target' => 1],
                'is_secret' => false,
            ],

            // CONSISTENCIA (Consistency)
            [
                'code' => 'fire_streak',
                'name' => 'Racha de Fuego',
                'description' => 'Mantén una racha de 7 días consecutivos',
                'category' => 'consistency',
                'icon' => '🔥',
                'xp_reward' => 100,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'any', 'target' => 7],
                'is_secret' => false,
            ],
            [
                'code' => 'full_month',
                'name' => 'Mes Completo',
                'description' => 'Practica durante 30 días consecutivos',
                'category' => 'consistency',
                'icon' => '📅',
                'xp_reward' => 300,
                'rarity' => 'epic',
                'criteria' => ['action_type' => 'any', 'target' => 30],
                'is_secret' => false,
            ],
            [
                'code' => 'early_bird',
                'name' => 'Madrugador',
                'description' => 'Completa una indagación antes de las 8 AM',
                'category' => 'consistency',
                'icon' => '🌅',
                'xp_reward' => 50,
                'rarity' => 'common',
                'criteria' => ['action_type' => 'inquiry_guided_completed', 'target' => 1],
                'is_secret' => false,
            ],

            // MAESTRÍA (Mastery)
            [
                'code' => 'perfectionist',
                'name' => 'Perfeccionista',
                'description' => 'Completa 10 indagaciones sin errores',
                'category' => 'mastery',
                'icon' => '⭐',
                'xp_reward' => 250,
                'rarity' => 'epic',
                'criteria' => ['action_type' => 'perfect_inquiry', 'target' => 10],
                'is_secret' => false,
            ],
            [
                'code' => 'data_analyst',
                'name' => 'Analista de Datos',
                'description' => 'Completa 50 análisis de datos',
                'category' => 'mastery',
                'icon' => '📈',
                'xp_reward' => 200,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'data_analysis_completed', 'target' => 50],
                'is_secret' => false,
            ],
            [
                'code' => 'biology_specialist',
                'name' => 'Especialista en Biología',
                'description' => 'Domina 20 indagaciones de biología',
                'category' => 'mastery',
                'icon' => '🌿',
                'xp_reward' => 150,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'inquiry_guided_completed', 'target' => 20],
                'is_secret' => false,
            ],
            [
                'code' => 'polymath',
                'name' => 'Polímata',
                'description' => 'Completa indagaciones en todas las áreas científicas',
                'category' => 'mastery',
                'icon' => '🎓',
                'xp_reward' => 300,
                'rarity' => 'legendary',
                'criteria' => ['action_type' => 'any', 'target' => 4],
                'is_secret' => false,
            ],

            // COLABORACIÓN (Collaboration)
            [
                'code' => 'team_player',
                'name' => 'Trabajo en Equipo',
                'description' => 'Completa 5 indagaciones colaborativas',
                'category' => 'collaboration',
                'icon' => '👥',
                'xp_reward' => 150,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'collaboration_completed', 'target' => 5],
                'is_secret' => false,
            ],
            [
                'code' => 'mentor',
                'name' => 'Mentor',
                'description' => 'Ayuda a 3 compañeros en sus indagaciones',
                'category' => 'collaboration',
                'icon' => '🤝',
                'xp_reward' => 100,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'peer_help', 'target' => 3],
                'is_secret' => false,
            ],

            // ESPECIALES (Special)
            [
                'code' => 'discoverer',
                'name' => 'Descubridor',
                'description' => 'Encuentra un easter egg oculto',
                'category' => 'special',
                'icon' => '🥚',
                'xp_reward' => 500,
                'rarity' => 'legendary',
                'criteria' => ['action_type' => 'easter_egg_found', 'target' => 1],
                'is_secret' => true,
            ],
            [
                'code' => 'peruvian_scientist',
                'name' => 'Científico Peruano',
                'description' => 'Completa todas las indagaciones sobre ecosistemas peruanos',
                'category' => 'special',
                'icon' => '🇵🇪',
                'xp_reward' => 250,
                'rarity' => 'epic',
                'criteria' => ['action_type' => 'inquiry_guided_completed', 'target' => 5],
                'is_secret' => false,
            ],
            [
                'code' => 'night_owl',
                'name' => 'Búho Nocturno',
                'description' => 'Completa 10 indagaciones después de las 10 PM',
                'category' => 'special',
                'icon' => '🦉',
                'xp_reward' => 100,
                'rarity' => 'rare',
                'criteria' => ['action_type' => 'inquiry_guided_completed', 'target' => 10],
                'is_secret' => true,
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}
