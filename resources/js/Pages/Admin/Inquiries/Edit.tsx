import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { getAllSimulators } from '@/Components/Simulators/SimulatorRegistry';

const STEP_TYPES = [
  { value: 'problem', label: 'Problematización', icon: '❓' },
  { value: 'hypothesis', label: 'Hipótesis', icon: '💡' },
  { value: 'experiment', label: 'Experimento', icon: '🔬' },
  { value: 'data_record', label: 'Registro de Datos', icon: '📊' },
  { value: 'analysis', label: 'Análisis', icon: '🔍' },
  { value: 'multiple_choice', label: 'Opción Múltiple', icon: '☑️' },
];

export default function Edit({ auth, inquiry }: any) {
  const [title, setTitle] = useState(inquiry.title);
  const [description, setDescription] = useState(inquiry.description);
  const [steps, setSteps] = useState(
    inquiry.steps.map((s: any) => ({
      id: s.id.toString(),
      title: s.title,
      step_type: s.step_type,
      content: s.content || {},
      simulator_config: s.simulator_config,
      xp_reward: s.xp_reward,
      options: s.options || [],
    }))
  );

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
    setSteps(steps.filter((s: any) => s.id !== id));
  };

  const updateStep = (id: string, field: string, value: any) => {
    setSteps(steps.map((s: any) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.put(route('admin.inquiries.update', inquiry.id), {
      title,
      description,
      steps: steps.map((step: any) => ({
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
      <Head title={`Editar: ${inquiry.title}`} />

      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Editar Indagación</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

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
                {steps.map((step: any, index: number) => (
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
                ))}
              </CardContent>
            </Card>

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
                Actualizar Indagación
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}