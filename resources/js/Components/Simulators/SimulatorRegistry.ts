import { SimulatorRegistryEntry } from '@/Types/simulator';
import { PlantSimulator } from './PlantSimulator';
import { PendulumSimulator } from './PendulumSimulator';
import { CircuitSimulator } from './CircuitSimulator';

// Registro central de simuladores
const SIMULATOR_REGISTRY: Record<string, SimulatorRegistryEntry> = {
    plant_photosynthesis: {
        type: 'plant_photosynthesis',
        name: 'Simulador de Fotosíntesis',
        description: 'Experimenta con diferentes colores e intensidades de luz para ver cómo afectan la fotosíntesis',
        category: 'biology',
        component: PlantSimulator,
        defaultConfig: {
            type: 'plant_photosynthesis',
            params: {
                light_colors: ['red', 'green', 'blue', 'white'],
                intensity_range: [0, 100],
                measurements: ['absorption', 'photosynthesis'],
            },
        },
        icon: '🌿',
    },

    pendulum: {
        type: 'pendulum',
        name: 'Simulador de Péndulo',
        description: 'Estudia el movimiento pendular y cómo la longitud y masa afectan el período',
        category: 'physics',
        component: PendulumSimulator,
        defaultConfig: {
            type: 'pendulum',
            params: {
                length_range: [10, 100],
                mass_range: [1, 10],
                angle_range: [5, 45],
            },
        },
        icon: '⚖️',
    },

    circuit: {
        type: 'circuit',
        name: 'Simulador de Circuitos',
        description: 'Construye circuitos eléctricos y observa cómo fluye la corriente',
        category: 'physics',
        component: CircuitSimulator,
        defaultConfig: {
            type: 'circuit',
            params: {
                voltage_range: [1, 12],
                resistance_range: [1, 100],
            },
        },
        icon: '⚡',
    },
};

// Funciones de utilidad
export function getSimulator(type: string): SimulatorRegistryEntry | undefined {
    return SIMULATOR_REGISTRY[type];
}

export function getAllSimulators(): SimulatorRegistryEntry[] {
    return Object.values(SIMULATOR_REGISTRY);
}

export function getSimulatorsByCategory(category: string): SimulatorRegistryEntry[] {
    return Object.values(SIMULATOR_REGISTRY).filter(sim => sim.category === category);
}

export function registerSimulator(entry: SimulatorRegistryEntry): void {
    SIMULATOR_REGISTRY[entry.type] = entry;
}

export { SIMULATOR_REGISTRY };
