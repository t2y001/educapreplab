import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface BaseSimulatorLayoutProps {
    title: string;
    icon?: ReactNode;
    visualization: ReactNode;
    controls: ReactNode;
    measurements: ReactNode;
    experiments?: ReactNode;
    onRun: () => void;
    onReset: () => void;
    isRunning: boolean;
}

export function BaseSimulatorLayout({
    title,
    icon,
    visualization,
    controls,
    measurements,
    experiments,
    onRun,
    onReset,
    isRunning,
}: BaseSimulatorLayoutProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Visualización */}
                        <div className="bg-gradient-to-b from-sky-100 to-green-50 p-8 rounded-lg min-h-[300px] flex items-center justify-center relative">
                            {visualization}
                        </div>

                        {/* Controles y Mediciones */}
                        <div className="space-y-6">
                            {/* Controles */}
                            <div>
                                <h4 className="font-medium mb-3">Controles</h4>
                                {controls}
                            </div>

                            {/* Mediciones */}
                            <div>
                                <h4 className="font-medium mb-3">Mediciones</h4>
                                {measurements}
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={onRun}
                                    disabled={isRunning}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {isRunning ? 'Ejecutando...' : 'Iniciar Experimento'}
                                </Button>
                                <Button onClick={onReset} variant="outline">
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Historial de Experimentos */}
                    {experiments && (
                        <div className="mt-6">
                            {experiments}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
