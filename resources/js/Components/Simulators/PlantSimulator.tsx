import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Slider } from '@/Components/ui/slider';
import { Play, RotateCcw, Camera } from 'lucide-react';

interface PlantSimulatorProps {
    onExperimentComplete: (data: any) => void;
}

const lightColors = {
    red: { name: 'Rojo', color: '#EF4444', absorption: 90, photosynthesis: 85 },
    green: { name: 'Verde', color: '#10B981', absorption: 10, photosynthesis: 15 },
    blue: { name: 'Azul', color: '#3B82F6', absorption: 85, photosynthesis: 80 },
    white: { name: 'Blanco', color: '#F3F4F6', absorption: 60, photosynthesis: 70 },
};

export function PlantSimulator({ onExperimentComplete }: PlantSimulatorProps) {
    const [selectedColor, setSelectedColor] = useState<keyof typeof lightColors>('white');
    const [intensity, setIntensity] = useState(100);
    const [isRunning, setIsRunning] = useState(false);
    const [experiments, setExperiments] = useState<any[]>([]);

    const currentLight = lightColors[selectedColor];
    const effectiveAbsorption = (currentLight.absorption * intensity) / 100;
    const effectivePhotosynthesis = (currentLight.photosynthesis * intensity) / 100;

    const runExperiment = () => {
        setIsRunning(true);

        setTimeout(() => {
            const experimentData = {
                lightColor: currentLight.name,
                intensity,
                absorption: Math.round(effectiveAbsorption),
                photosynthesis: Math.round(effectivePhotosynthesis),
                timestamp: new Date().toISOString(),
            };

            const newExperiments = [...experiments, experimentData];
            setExperiments(newExperiments);
            onExperimentComplete(experimentData);
            setIsRunning(false);
        }, 2000);
    };

    const reset = () => {
        setSelectedColor('white');
        setIntensity(100);
        setIsRunning(false);
    };

    // Calcular el color de la planta basado en la luz reflejada
    const getPlantColor = () => {
        if (selectedColor === 'green') {
            return '#10B981'; // Verde brillante (refleja verde)
        } else if (selectedColor === 'red' || selectedColor === 'blue') {
            return '#065F46'; // Verde oscuro (absorbe rojo/azul)
        }
        return '#059669'; // Verde normal
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🌿 Simulador de Fotosíntesis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Visualización */}
                        <div className="bg-gradient-to-b from-sky-100 to-green-50 p-8 rounded-lg relative min-h-[300px] flex items-center justify-center">
                            {/* Sol/Luz */}
                            <div
                                className="absolute top-4 right-4 w-16 h-16 rounded-full blur-sm"
                                style={{
                                    backgroundColor: currentLight.color,
                                    opacity: intensity / 100,
                                    boxShadow: `0 0 ${intensity}px ${currentLight.color}`
                                }}
                            />

                            {/* Planta */}
                            <div className="relative">
                                {/* Tallo */}
                                <div
                                    className="w-4 h-32 mx-auto rounded-t-full transition-all duration-500"
                                    style={{ backgroundColor: getPlantColor() }}
                                />

                                {/* Hojas */}
                                <div className="absolute top-8 -left-12">
                                    <div
                                        className="w-20 h-12 rounded-full transform -rotate-45 transition-all duration-500"
                                        style={{ backgroundColor: getPlantColor() }}
                                    />
                                </div>
                                <div className="absolute top-8 -right-12">
                                    <div
                                        className="w-20 h-12 rounded-full transform rotate-45 transition-all duration-500"
                                        style={{ backgroundColor: getPlantColor() }}
                                    />
                                </div>
                                <div className="absolute top-16 -left-10">
                                    <div
                                        className="w-16 h-10 rounded-full transform -rotate-30 transition-all duration-500"
                                        style={{ backgroundColor: getPlantColor() }}
                                    />
                                </div>
                                <div className="absolute top-16 -right-10">
                                    <div
                                        className="w-16 h-10 rounded-full transform rotate-30 transition-all duration-500"
                                        style={{ backgroundColor: getPlantColor() }}
                                    />
                                </div>

                                {/* Maceta */}
                                <div className="w-24 h-16 bg-orange-800 rounded-b-lg mx-auto -mt-2" />
                            </div>

                            {/* Indicador de fotosíntesis */}
                            {isRunning && (
                                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg">
                                    <p className="text-sm font-medium">Fotosíntesis en proceso...</p>
                                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                                        <div
                                            className="h-full bg-green-500 rounded-full animate-pulse"
                                            style={{ width: `${effectivePhotosynthesis}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controles */}
                        <div className="space-y-6">
                            {/* Color de luz */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Color de Luz</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(lightColors).map(([key, light]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedColor(key as keyof typeof lightColors)}
                                            className={`p-3 rounded-lg border-2 transition-all ${selectedColor === key
                                                    ? 'border-gray-900 shadow-lg'
                                                    : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                            style={{ backgroundColor: light.color }}
                                        >
                                            <span className={`font-medium ${key === 'white' ? 'text-gray-900' : 'text-white'}`}>
                                                {light.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Intensidad */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Intensidad de Luz: {intensity}%
                                </label>
                                <Slider
                                    value={[intensity]}
                                    onValueChange={(value) => setIntensity(value[0])}
                                    max={100}
                                    step={10}
                                    className="w-full"
                                />
                            </div>

                            {/* Mediciones */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Absorción de Luz</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-300"
                                                style={{ width: `${effectiveAbsorption}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold w-12">{Math.round(effectiveAbsorption)}%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tasa de Fotosíntesis</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 transition-all duration-300"
                                                style={{ width: `${effectivePhotosynthesis}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold w-12">{Math.round(effectivePhotosynthesis)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={runExperiment}
                                    disabled={isRunning}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {isRunning ? 'Ejecutando...' : 'Iniciar Experimento'}
                                </Button>
                                <Button
                                    onClick={reset}
                                    variant="outline"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Historial de experimentos */}
                    {experiments.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-medium mb-3">Experimentos realizados: {experiments.length}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {experiments.map((exp, i) => (
                                    <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                                        <p className="font-medium">{exp.lightColor}</p>
                                        <p className="text-gray-600">Absorción: {exp.absorption}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
