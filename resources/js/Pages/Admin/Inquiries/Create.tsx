import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { getAllSimulators } from '@/Components/Simulators/SimulatorRegistry';

interface Step {
  id: string;
  title: string;
  step_type: string;
  content: any;
  simulator_config: any;
  xp_reward: number;
  options?: any[];
}

const STEP_TYPES = [
  { value: 'problem', label: 'Problematización', icon: '❓' },
  { value: 'hypothesis', label: 'Hipótesis', icon: '💡' },
  { value: 'experiment', label: 'Experimento', icon: '🔬' },
  { value: 'data_record', label: 'Registro de Datos', icon: '📊' },
  { value: 'analysis', label: 'Análisis', icon: '🔍' },
  { value: 'multiple_choice', label: 'Opción Múltiple', icon: '☑️' },
];

export default function Create({ auth }: { auth: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    {
      id: '1',
      title: '',
      step_type: 'problem',
      content: {},
      simulator_config: null,
      xp_reward: 10,
    },
  ]);

  const simulators = getAllSimulators();

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        title: '',
        step_type: 'problem',
        content: {},
        simulator_config: null,
        xp_reward: 10,
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: string, value: any) => {
    setSteps(
      steps.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.post(route('admin.inquiries.store'), {
      title,
      description,
      steps: steps.map((step, index) => ({
        title: step.title,
        step_type: step.step_type,
        content: step.content,
        simulator_config: step.simulator_config,
        xp_reward: step.xp_reward,
        options: step.options,
      })),
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Nueva Indagación" />

      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Crear Nueva Indagación</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="¿Por qué las plantas son verdes?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descubre el fascinante mundo de la fotosíntesis..."
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pasos de la Indagación</CardTitle>
                  <Button type="button" onClick={addStep} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Paso
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Paso {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                        className="ml-auto text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Título del Paso</label>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          placeholder="Observa y Pregunta"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Paso</label>
                        <select
                          value={step.step_type}
                          onChange={(e) => updateStep(step.id, 'step_type', e.target.value)}
                          className="w-full border rounded-md px-3 py-2"
                        >
                          {STEP_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Simulator Selector for Experiment Steps */}
                    {step.step_type === 'experiment' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Simulador</label>
                        <select
                          value={step.simulator_config?.type || ''}
                          onChange={(e) => {
                            const sim = simulators.find((s) => s.type === e.target.value);
                            updateStep(step.id, 'simulator_config', sim?.defaultConfig || null);
                          }}
                          className="w-full border rounded-md px-3 py-2"
                        >
                          <option value="">Seleccionar simulador...</option>
                          {simulators.map((sim) => (
                            <option key={sim.type} value={sim.type}>
                              {sim.icon} {sim.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">XP Recompensa</label>
                        <Input
                          type="number"
                          value={step.xp_reward}
                          onChange={(e) => updateStep(step.id, 'xp_reward', parseInt(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit(route('admin.inquiries.index'))}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Guardar Indagación
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}