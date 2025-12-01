import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Lock, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';

interface Achievement {
    id: number;
    name: string;
    description: string;
    category: 'inquiry' | 'consistency' | 'mastery' | 'collaboration' | 'special';
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xp_reward: number;
    is_secret: boolean;
    unlocked: boolean;
    progress: number;
    target: number;
    unlocked_at?: string;
}

interface AchievementsListProps {
    achievements: Achievement[];
}

const rarityColors = {
    common: 'bg-gray-100 text-gray-800 border-gray-300',
    rare: 'bg-blue-100 text-blue-800 border-blue-300',
    epic: 'bg-purple-100 text-purple-800 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const categoryLabels = {
    inquiry: 'Indagación',
    consistency: 'Consistencia',
    mastery: 'Maestría',
    collaboration: 'Colaboración',
    special: 'Especial',
};

export function AchievementsList({ achievements }: AchievementsListProps) {
    const categories = ['inquiry', 'consistency', 'mastery', 'collaboration', 'special'] as const;

    return (
        <div className="space-y-6">
            {categories.map((category) => {
                const categoryAchievements = achievements.filter((a) => a.category === category);

                if (categoryAchievements.length === 0) return null;

                return (
                    <div key={category}>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            {categoryLabels[category]}
                            <Badge variant="outline" className="text-xs">
                                {categoryAchievements.filter(a => a.unlocked).length} / {categoryAchievements.length}
                            </Badge>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryAchievements.map((achievement) => (
                                <TooltipProvider key={achievement.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Card
                                                className={`relative overflow-hidden transition-all hover:shadow-lg ${achievement.unlocked
                                                        ? 'border-2 ' + rarityColors[achievement.rarity]
                                                        : 'opacity-60 grayscale'
                                                    }`}
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="text-3xl">{achievement.icon}</div>
                                                        {achievement.unlocked ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <Lock className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <CardTitle className="text-base mt-2">{achievement.name}</CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {achievement.description}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent>
                                                    {!achievement.unlocked && achievement.progress > 0 && (
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                                <span>Progreso</span>
                                                                <span>{achievement.progress} / {achievement.target}</span>
                                                            </div>
                                                            <Progress
                                                                value={(achievement.progress / achievement.target) * 100}
                                                                className="h-2"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-3">
                                                        <Badge variant="outline" className="text-xs">
                                                            {achievement.rarity}
                                                        </Badge>
                                                        <span className="text-xs font-semibold text-purple-600">
                                                            +{achievement.xp_reward} XP
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-semibold">{achievement.name}</p>
                                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                            {achievement.unlocked && achievement.unlocked_at && (
                                                <p className="text-xs mt-1">
                                                    Desbloqueado: {new Date(achievement.unlocked_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
