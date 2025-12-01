import { useState, useEffect } from 'react';
import axios from 'axios';

interface GamificationStats {
    level: number;
    xp: number;
    total_xp: number;
    xp_for_next_level: number;
    progress_percentage: number;
    scientist_title: string;
    current_streak: number;
    longest_streak: number;
    achievements_unlocked: number;
    total_achievements: number;
    achievement_percentage: number;
}

interface Achievement {
    id: number;
    name: string;
    description: string;
    category: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xp_reward: number;
    is_secret: boolean;
    unlocked: boolean;
    progress: number;
    target: number;
    unlocked_at?: string;
}

interface XpAwardResult {
    xp_awarded: number;
    multiplier: number;
    total_xp: number;
    current_level: number;
    leveled_up: boolean;
    new_level?: number;
    new_title?: string;
    unlocked_achievements: Array<{
        id: number;
        name: string;
        description: string;
        rarity: string;
        xp_reward: number;
    }>;
}

export function useGamification() {
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar estadísticas
    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/gamification/stats');
            setStats(response.data.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar estadísticas');
            console.error(err);
        }
    };

    // Cargar logros
    const fetchAchievements = async (includeSecret = false) => {
        try {
            const response = await axios.get('/api/gamification/achievements', {
                params: { include_secret: includeSecret },
            });
            setAchievements(response.data.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar logros');
            console.error(err);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchAchievements()]);
            setLoading(false);
        };

        loadData();
    }, []);

    // Otorgar XP (para testing)
    const awardXp = async (
        userId: number,
        amount: number,
        actionType: string,
        description?: string
    ): Promise<XpAwardResult | null> => {
        try {
            const response = await axios.post('/api/gamification/award-xp', {
                user_id: userId,
                amount,
                action_type: actionType,
                description,
            });

            // Recargar stats después de otorgar XP
            await fetchStats();

            return response.data.data;
        } catch (err) {
            console.error('Error al otorgar XP:', err);
            return null;
        }
    };

    // Refrescar datos
    const refresh = async () => {
        await Promise.all([fetchStats(), fetchAchievements()]);
    };

    return {
        stats,
        achievements,
        loading,
        error,
        awardXp,
        refresh,
        fetchStats,
        fetchAchievements,
    };
}
