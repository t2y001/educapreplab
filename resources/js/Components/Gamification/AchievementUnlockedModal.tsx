import { motion } from 'framer-motion';
import { Award, Sparkles, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

interface AchievementUnlockedModalProps {
    achievement: {
        name: string;
        description: string;
        icon: string;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
        xp_reward: number;
    };
    onClose: () => void;
}

const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600',
};

const rarityLabels = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
};

export function AchievementUnlockedModal({ achievement, onClose }: AchievementUnlockedModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className={`bg-gradient-to-br ${rarityColors[achievement.rarity]} rounded-2xl p-8 max-w-md w-full mx-4 text-white relative overflow-hidden shadow-2xl`}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/10 animate-pulse" />

                {/* Sparkles */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                top: '50%',
                                left: '50%',
                                scale: 0,
                                opacity: 1
                            }}
                            animate={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                scale: [0, 1, 0],
                                opacity: [1, 1, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                ease: 'easeOut',
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                    ))}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="mb-4"
                    >
                        <div className="text-7xl mb-2">{achievement.icon}</div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Badge variant="secondary" className="mb-3 bg-white/20 text-white">
                            {rarityLabels[achievement.rarity]}
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-bold mb-2"
                    >
                        ¡Logro Desbloqueado!
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl font-semibold mb-2"
                    >
                        {achievement.name}
                    </motion.p>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-white/90 mb-6"
                    >
                        {achievement.description}
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/20 rounded-lg p-4 mb-6 inline-block"
                    >
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            <span className="text-lg font-bold">+{achievement.xp_reward} XP</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Button
                            onClick={onClose}
                            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8"
                        >
                            ¡Genial!
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
