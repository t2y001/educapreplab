import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp, Award } from 'lucide-react';

interface XpNotificationProps {
    xpAwarded: number;
    multiplier?: number;
    leveledUp?: boolean;
    newLevel?: number;
    newTitle?: string;
    onClose: () => void;
}

export function XpNotification({
    xpAwarded,
    multiplier = 1,
    leveledUp = false,
    newLevel,
    newTitle,
    onClose
}: XpNotificationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 min-w-[300px]">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">+{xpAwarded} XP</p>
                                    {multiplier > 1 && (
                                        <p className="text-sm text-purple-100">
                                            Multiplicador: {multiplier}x
                                        </p>
                                    )}
                                    {leveledUp && newLevel && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="w-4 h-4 text-yellow-300" />
                                            <p className="text-sm font-semibold text-yellow-300">
                                                ¡Nivel {newLevel}!
                                            </p>
                                        </div>
                                    )}
                                    {newTitle && (
                                        <p className="text-xs text-purple-100 mt-1">
                                            {newTitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsVisible(false);
                                    setTimeout(onClose, 300);
                                }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
