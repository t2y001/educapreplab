import { useState } from 'react';
import { BaseSimulatorProps, ExperimentData, SimulatorMeasurement } from '@/Types/simulator';
import { BaseSimulatorLayout } from './BaseSimulatorLayout';
import { MeasurementDisplay } from './MeasurementDisplay';
import { Slider } from '@/Components/ui/slider';

export function CircuitSimulator({ config, onExperimentComplete, onInteraction }: BaseSimulatorProps) {
    const [voltage, setVoltage] = useState(6); // V
    const [resistance, setResistance] = useState(10); // Ω
    const [isRunning, setIsRunning] = useState(false);
    const [experiments, setExperiments] = useState<ExperimentData[]>([]);

    // Ley de Ohm: I = V/R
    const current = voltage / resistance; // A
    const power = voltage * current; // W
    const energy = power * 1; // J (asumiendo 1 segundo)

    const measurements: SimulatorMeasurement[] = [
        {
            id: 'current',
            label: 'Corriente (I)',
            value: current * 10, // Escalar para visualización
            unit: 'A',
            color: '#EF4444',
        },
        {
            id: 'power',
            label: 'Potencia (P)',
            value: power * 2, // Escalar
            unit: 'W',
            color: '#F59E0B',
        },
        {
            id: 'energy',
            label: 'Energía',
            value: energy * 2, // Escalar
            unit: 'J',
            color: '#10B981',
        },
    ];

    const runExperiment = () => {
        setIsRunning(true);

        setTimeout(() => {
            const experimentData: ExperimentData = {
                timestamp: new Date().toISOString(),
                controls: { voltage, resistance },
                measurements: {
                    current: parseFloat(current.toFixed(2)),
                    power: parseFloat(power.toFixed(2)),
                    energy: parseFloat(energy.toFixed(2)),
                },
            };

            setExperiments([...experiments, experimentData]);
            onExperimentComplete(experimentData);
            setIsRunning(false);
        }, 1500);
    };

    const reset = () => {
        setVoltage(6);
        setResistance(10);
    };

    // Visualización del circuito
    const visualization = (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Batería */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2">
                <div className="w-12 h-20 border-4 border-red-600 rounded flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">{voltage}V</span>
                </div>
            </div>

            {/* Resistencia */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <div className="w-16 h-8 bg-yellow-600 rounded flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{resistance}Ω</span>
                </div>
            </div>

            {/* Cables */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                {/* Cable superior */}
                <line
                    x1="20%"
                    y1="30%"
                    x2="80%"
                    y2="30%"
                    stroke={isRunning ? '#EF4444' : '#374151'}
                    strokeWidth="4"
                    className="transition-all duration-300"
                />
                {/* Cable inferior */}
                <line
                    x1="20%"
                    y1="70%"
                    x2="80%"
                    y2="70%"
                    stroke={isRunning ? '#EF4444' : '#374151'}
                    strokeWidth="4"
                    className="transition-all duration-300"
                />
                {/* Cables verticales */}
                <line x1="20%" y1="30%" x2="20%" y2="70%" stroke="#374151" strokeWidth="4" />
                <line x1="80%" y1="30%" x2="80%" y2="70%" stroke="#374151" strokeWidth="4" />
            </svg>

            {/* Indicador de corriente */}
            {isRunning && (
                <div className="absolute top-4 bg-white/90 px-3 py-1 rounded text-sm font-medium">
                    ⚡ Corriente: {current.toFixed(2)} A
                </div>
            )}
        </div>
    );

    const controls = (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    Voltaje: {voltage} V
                </label>
                <Slider
                    value={[voltage]}
                    onValueChange={(v) => setVoltage(v[0])}
                    min={1}
                    max={12}
                    step={1}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">
                    Resistencia: {resistance} Ω
                </label>
                <Slider
                    value={[resistance]}
                    onValueChange={(v) => setResistance(v[0])}
                    min={1}
                    max={100}
                    step={5}
                />
            </div>
            <div className="bg-blue-50 p-3 rounded text-sm">
                <p className="font-medium">Ley de Ohm:</p>
                <p className="text-gray-700">I = V / R</p>
                <p className="text-gray-700">I = {voltage} / {resistance} = {current.toFixed(2)} A</p>
            </div>
        </div>
    );

    const experimentsDisplay = experiments.length > 0 && (
        <div>
            <h4 className="font-medium mb-3">Experimentos: {experiments.length}</h4>
            <div className="grid grid-cols-3 gap-2">
                {experiments.map((exp, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                        <p className="font-medium">V: {exp.controls.voltage}V</p>
                        <p className="text-gray-600">I: {exp.measurements.current}A</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <BaseSimulatorLayout
            title="Simulador de Circuitos"
            icon="⚡"
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
