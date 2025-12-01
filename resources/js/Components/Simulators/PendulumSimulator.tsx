import { useState } from 'react';
import { BaseSimulatorProps, ExperimentData, SimulatorMeasurement } from '@/Types/simulator';
import { BaseSimulatorLayout } from './BaseSimulatorLayout';
import { MeasurementDisplay } from './MeasurementDisplay';
import { Slider } from '@/Components/ui/slider';

export function PendulumSimulator({ config, onExperimentComplete, onInteraction }: BaseSimulatorProps) {
    const [length, setLength] = useState(50); // cm
    const [mass, setMass] = useState(5); // kg
    const [angle, setAngle] = useState(15); // grados
    const [isRunning, setIsRunning] = useState(false);
    const [experiments, setExperiments] = useState<ExperimentData[]>([]);

    // Fórmula del período: T = 2π√(L/g)
    const g = 9.8; // m/s²
    const period = 2 * Math.PI * Math.sqrt((length / 100) / g); // segundos
    const frequency = 1 / period; // Hz
    const maxVelocity = (angle * Math.PI / 180) * Math.sqrt(g / (length / 100)); // m/s

    const measurements: SimulatorMeasurement[] = [
        {
            id: 'period',
            label: 'Período (T)',
            value: period * 10, // Escalar para visualización
            unit: 's',
            color: '#3B82F6',
        },
        {
            id: 'frequency',
            label: 'Frecuencia (f)',
            value: frequency * 100, // Escalar
            unit: 'Hz',
            color: '#10B981',
        },
        {
            id: 'velocity',
            label: 'Velocidad Máxima',
            value: maxVelocity * 10, // Escalar
            unit: 'm/s',
            color: '#EF4444',
        },
    ];

    const runExperiment = () => {
        setIsRunning(true);

        setTimeout(() => {
            const experimentData: ExperimentData = {
                timestamp: new Date().toISOString(),
                controls: { length, mass, angle },
                measurements: {
                    period: parseFloat(period.toFixed(2)),
                    frequency: parseFloat(frequency.toFixed(2)),
                    maxVelocity: parseFloat(maxVelocity.toFixed(2)),
                },
            };

            setExperiments([...experiments, experimentData]);
            onExperimentComplete(experimentData);
            setIsRunning(false);
        }, 2000);
    };

    const reset = () => {
        setLength(50);
        setMass(5);
        setAngle(15);
    };

    // Visualización del péndulo
    const visualization = (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Punto de suspensión */}
            <div className="absolute top-0 w-4 h-4 bg-gray-800 rounded-full" />

            {/* Cuerda */}
            <div
                className="absolute top-2 w-1 bg-gray-600 origin-top transition-all duration-300"
                style={{
                    height: `${length * 2}px`,
                    transform: `rotate(${isRunning ? 0 : angle}deg)`,
                }}
            />

            {/* Masa */}
            <div
                className="absolute bg-blue-600 rounded-full transition-all duration-300"
                style={{
                    width: `${20 + mass * 4}px`,
                    height: `${20 + mass * 4}px`,
                    top: `${length * 2}px`,
                    transform: `translateX(${isRunning ? 0 : Math.sin(angle * Math.PI / 180) * length * 2}px)`,
                }}
            />

            {isRunning && (
                <div className="absolute bottom-4 bg-white/90 px-3 py-1 rounded text-sm">
                    Oscilando...
                </div>
            )}
        </div>
    );

    const controls = (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    Longitud: {length} cm
                </label>
                <Slider
                    value={[length]}
                    onValueChange={(v) => setLength(v[0])}
                    min={10}
                    max={100}
                    step={5}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                    Masa: {mass} kg
                </label>
                <Slider
                    value={[mass]}
                    onValueChange={(v) => setMass(v[0])}
                    min={1}
                    max={10}
                    step={1}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                    Ángulo Inicial: {angle}°
                </label>
                <Slider
                    value={[angle]}
                    onValueChange={(v) => setAngle(v[0])}
                    min={5}
                    max={45}
                    step={5}
                />
            </div>
        </div>
    );

    const experimentsDisplay = experiments.length > 0 && (
        <div>
            <h4 className="font-medium mb-3">Experimentos: {experiments.length}</h4>
            <div className="grid grid-cols-3 gap-2">
                {experiments.map((exp, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                        <p className="font-medium">L: {exp.controls.length}cm</p>
                        <p className="text-gray-600">T: {exp.measurements.period}s</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <BaseSimulatorLayout
            title="Simulador de Péndulo"
            icon="⚖️"
            visualization={visualization}
            controls={controls}
            measurements={<MeasurementDisplay measurements={measurements} />}
            experiments={experimentsDisplay}
            onRun={runExperiment}
            onReset={reset}
            isRunning={isRunning}
        />
    );
}
