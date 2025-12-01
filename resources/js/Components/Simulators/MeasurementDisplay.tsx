import { SimulatorMeasurement } from '@/Types/simulator';

interface MeasurementDisplayProps {
    measurements: SimulatorMeasurement[];
}

export function MeasurementDisplay({ measurements }: MeasurementDisplayProps) {
    return (
        <div className="space-y-3">
            {measurements.map((measurement) => (
                <div key={measurement.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{measurement.label}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-300"
                                style={{
                                    width: `${measurement.value}%`,
                                    backgroundColor: measurement.color || '#10B981',
                                }}
                            />
                        </div>
                        <span className="text-sm font-bold w-16 text-right">
                            {Math.round(measurement.value)}{measurement.unit}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
