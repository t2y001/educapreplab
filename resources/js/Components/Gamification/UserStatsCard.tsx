import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { Trophy, Zap, Flame, Star } from 'lucide-react';

interface UserStatsCardProps {
    stats: {
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
    };
}

export function UserStatsCard({ stats }: UserStatsCardProps) {
    return (
        <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Nivel {stats.level}</CardTitle>
                        <p className="text-purple-100 text-sm mt-1">{stats.scientist_title}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Trophy className="w-8 h-8" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* XP Progress */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {stats.xp} / {stats.xp_for_next_level} XP
                        </span>
                        <span>{Math.round(stats.progress_percentage)}%</span>
                    </div>
                    <Progress value={stats.progress_percentage} className="h-3 bg-white/20" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Streak */}
                    <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Flame className="w-4 h-4 text-orange-300" />
                            <span className="text-xs text-purple-100">Racha</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.current_streak}</p>
                        <p className="text-xs text-purple-200">días</p>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-300" />
                            <span className="text-xs text-purple-100">Logros</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.achievements_unlocked}</p>
                        <p className="text-xs text-purple-200">de {stats.total_achievements}</p>
                    </div>
                </div>

                {/* Total XP Badge */}
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                    <span className="text-sm text-purple-100">XP Total</span>
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        {stats.total_xp.toLocaleString()} XP
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
