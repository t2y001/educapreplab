import { motion } from 'framer-motion';
import { Sparkles, Trophy, Star } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface LevelUpModalProps {
    newLevel: number;
    newTitle: string;
    xpForNextLevel: number;
    onClose: () => void;
}

export function LevelUpModal({ newLevel, newTitle, xpForNextLevel, onClose }: LevelUpModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-2xl p-8 max-w-md w-full mx-4 text-white relative overflow-hidden"
            >
                {/* Confetti Background */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                top: '50%',
                                left: '50%',
                                scale: 0
                            }}
                            animate={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                scale: [0, 1, 0],
                                rotate: Math.random() * 360,
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <Star className="w-4 h-4 text-yellow-300" />
                        </motion.div>
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="mb-4"
                    >
                        <div className="bg-white/20 rounded-full p-6 inline-block">
                            <Trophy className="w-16 h-16" />
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl font-bold mb-2"
                    >
                        ¡Nivel {newLevel}!
                    </motion.h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <p className="text-xl font-semibold">{newTitle}</p>
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                        </div>
                        <p className="text-purple-100 text-sm">
                            Has alcanzado un nuevo nivel de maestría científica
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/10 rounded-lg p-4 mb-6"
                    >
                        <p className="text-sm text-purple-100 mb-1">Próximo nivel</p>
                        <p className="text-2xl font-bold">{xpForNextLevel} XP</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button
                            onClick={onClose}
                            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8"
                        >
                            ¡Continuar!
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
