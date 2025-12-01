// Tipos base para simuladores
export interface SimulatorConfig {
    type: string;
    params: Record<string, any>;
    assets?: Record<string, string>;
}

export interface SimulatorMeasurement {
    id: string;
    label: string;
    value: number;
    unit: string;
    color?: string;
}

export interface SimulatorControl {
    id: string;
    label: string;
    type: 'slider' | 'select' | 'toggle' | 'input';
    value: any;
    options?: any[];
    min?: number;
    max?: number;
    step?: number;
}

export interface ExperimentData {
    timestamp: string;
    controls: Record<string, any>;
    measurements: Record<string, number>;
    metadata?: Record<string, any>;
}

export interface BaseSimulatorProps {
    config: SimulatorConfig;
    onExperimentComplete: (data: ExperimentData) => void;
    onInteraction?: (type: string, data: any) => void;
}

export interface SimulatorRegistryEntry {
    type: string;
    name: string;
    description: string;
    category: 'physics' | 'biology' | 'chemistry' | 'earth_science' | 'other';
    component: React.ComponentType<BaseSimulatorProps>;
    defaultConfig: Partial<SimulatorConfig>;
    icon?: string;
}
