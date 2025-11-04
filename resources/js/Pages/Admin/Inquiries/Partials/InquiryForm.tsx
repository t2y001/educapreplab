import { useState } from "react";
// --- CAMBIOS DE INERTIA ---
import { useForm, usePage } from "@inertiajs/react";
// --------------------------
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Separator } from "@/Components/ui/separator";
import { Checkbox } from "@/Components/ui/checkbox";
import InputError from "@/Components/InputError"; // Importa tu componente de error

// --- Definición de Tipos ---
// (Estos deberían coincidir con tus modelos de Eloquent)
interface Area { id: number; nombre: string; }
interface Tema { id: number; nombre: string; }
interface Subtema { id: number; nombre: string; }

interface InquiryOption {
  id?: number; // Puede no tener ID si es nuevo
  option_label: string;
  option_text: string;
  is_correct: boolean;
  feedback: string;
}

interface InquiryStep {
  id?: number; // Puede no tener ID si es nuevo
  order: number;
  step_text: string;
  step_type: 'multiple_choice' | 'open_ended' | 'simulation_result' | 'conclusion';
  simulation_data: any; // O un tipo más específico si lo tienes
  inquiry_options: InquiryOption[];
}

interface Inquiry {
  id?: number;
  title: string;
  description: string;
  status: 'draft' | 'published';
  area_id: number | null;
  tema_id: number | null;
  subtema_id: number | null;
}

interface PageProps {
  inquiry?: Inquiry & { inquiry_steps: InquiryStep[] }; // 'inquiry' solo existe en modo edición
  areas: Area[];
  temas: Tema[];
  subtemas: Subtema[];
}

const InquiryForm = () => {
  const { toast } = useToast();
  // --- CAMBIO DE INERTIA: Recibir datos como props ---
  const { inquiry, areas, temas, subtemas } = usePage<PageProps>().props;

  const isEditMode = !!inquiry;

  // --- CAMBIO DE INERTIA: Usar 'useForm' para manejar el estado ---
  const { data, setData, post, put, processing, errors } = useForm({
    // Datos de la indagación
    title: inquiry?.title || "",
    description: inquiry?.description || "",
    status: inquiry?.status || "draft",
    area_id: inquiry?.area_id || null,
    tema_id: inquiry?.tema_id || null,
    subtema_id: inquiry?.subtema_id || null,
    
    // Pasos y opciones anidados
    steps: inquiry?.inquiry_steps || [],
  });

  // --- Lógica de estado local (¡Esto se queda igual!) ---
  // (Solo que ahora usa 'setData' en lugar de 'setSteps')
  const addStep = () => {
    const newStep: InquiryStep = {
      order: data.steps.length + 1,
      step_text: `Paso ${data.steps.length + 1}`,
      step_type: "multiple_choice",
      simulation_data: null,
      inquiry_options: [],
    };
    setData("steps", [...data.steps, newStep]);
  };

  const removeStep = (stepIndex: number) => {
    const updatedSteps = data.steps
      .filter((_, index) => index !== stepIndex)
      .map((step, index) => ({ ...step, order: index + 1 })); // Re-ordenar
    setData("steps", updatedSteps);
  };
  
  // ... (Puedes añadir moveStepUp, moveStepDown aquí, actualizando 'setData')

  const updateStep = (stepIndex: number, field: keyof InquiryStep, value: any) => {
    const updatedSteps = [...data.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], [field]: value };
    setData("steps", updatedSteps);
  };

  const addOption = (stepIndex: number) => {
    const newOption: InquiryOption = {
      option_label: String.fromCharCode(65 + data.steps[stepIndex].inquiry_options.length), // A, B, C...
      option_text: "",
      is_correct: false,
      feedback: "",
    };
    const updatedSteps = [...data.steps];
    updatedSteps[stepIndex].inquiry_options.push(newOption);
    setData("steps", updatedSteps);
  };

  const removeOption = (stepIndex: number, optionIndex: number) => {
    const updatedSteps = [...data.steps];
    updatedSteps[stepIndex].inquiry_options = updatedSteps[stepIndex].inquiry_options
      .filter((_, index) => index !== optionIndex)
      .map((opt, index) => ({ ...opt, option_label: String.fromCharCode(65 + index) })); // Re-etiquetar
    setData("steps", updatedSteps);
  };

  const updateOption = (stepIndex: number, optionIndex: number, field: keyof InquiryOption, value: any) => {
    const updatedSteps = [...data.steps];
    updatedSteps[stepIndex].inquiry_options[optionIndex] = {
      ...updatedSteps[stepIndex].inquiry_options[optionIndex],
      [field]: value,
    };
    
    // Lógica para asegurar una sola respuesta correcta
    if (field === 'is_correct' && value === true) {
      updatedSteps[stepIndex].inquiry_options = updatedSteps[stepIndex].inquiry_options.map((opt, idx) => ({
        ...opt,
        is_correct: idx === optionIndex,
      }));
    }

    setData("steps", updatedSteps);
  };

  // --- CAMBIO DE INERTIA: 'handleSave' usa 'post' o 'put' ---
  const handleSave = () => {
    const onSuccess = () => {
      toast({ title: "Guardado", description: "Indagación guardada exitosamente." });
      // Redirige al índice (manejado por el controlador en Laravel)
    };
    const onError = () => {
      toast({ title: "Error", description: "Hubo errores de validación. Revisa el formulario.", variant: "destructive" });
    };

    if (isEditMode && inquiry.id) {
      put(route('admin.inquiries.update', inquiry.id), { onSuccess, onError });
    } else {
      post(route('admin.inquiries.store'), { onSuccess, onError });
    }
  };

  return (
    // Este componente es una 'Parte' del layout de admin
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metadatos de la Indagación</CardTitle>
          <CardDescription>Información principal y clasificación.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            <InputError message={errors.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={data.status} onValueChange={(value) => setData("status", value as 'draft' | 'published')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
            <InputError message={errors.status} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows={3}
            />
            <InputError message={errors.description} />
          </div>
          {/* Aquí puedes añadir los Selects para area, tema, subtema, usando los props 'areas', 'temas', 'subtemas' */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pasos de la Indagación</CardTitle>
          <CardDescription>Define la secuencia de la indagación guiada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.steps.map((step, stepIndex) => (
            <Card key={stepIndex} className="bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Paso {step.order}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => removeStep(stepIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Texto del Paso</Label>
                  <Textarea
                    value={step.step_text}
                    onChange={(e) => updateStep(stepIndex, "step_text", e.target.value)}
                    placeholder="Escribe la pregunta o guía para este paso..."
                    rows={3}
                  />
                  <InputError message={errors[`steps.${stepIndex}.step_text`]} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Paso</Label>
                  <Select
                    value={step.step_type}
                    onValueChange={(value) => updateStep(stepIndex, "step_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Opción Múltiple</SelectItem>
                      <SelectItem value="open_ended">Pregunta Abierta (IA)</SelectItem>
                      <SelectItem value="simulation_result">Resultado Simulación</SelectItem>
                      <SelectItem value="conclusion">Conclusión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {step.step_type === "multiple_choice" && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Opciones</h4>
                        <Button variant="outline" size="sm" onClick={() => addOption(stepIndex)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Opción
                        </Button>
                      </div>
                      {step.inquiry_options.map((option, optionIndex) => (
                        <Card key={optionIndex}>
                          <CardContent className="p-4 space-y-4">
                            <div className="flex gap-4">
                              <Input
                                value={option.option_label}
                                onChange={(e) => updateOption(stepIndex, optionIndex, "option_label", e.target.value)}
                                className="w-[80px]"
                                placeholder="Ej: A"
                              />
                              <Textarea
                                value={option.option_text}
                                onChange={(e) => updateOption(stepIndex, optionIndex, "option_text", e.target.value)}
                                placeholder="Texto de la opción"
                                rows={1}
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(stepIndex, optionIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Label>Retroalimentación (Feedback)</Label>
                              <Textarea
                                value={option.feedback}
                                onChange={(e) => updateOption(stepIndex, optionIndex, "feedback", e.target.value)}
                                placeholder="Explica por qué esta opción es correcta o incorrecta..."
                                rows={2}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`correct-${stepIndex}-${optionIndex}`}
                                checked={option.is_correct}
                                onCheckedChange={(checked) =>
                                  updateOption(stepIndex, optionIndex, "is_correct", !!checked)
                                }
                              />
                              <Label htmlFor={`correct-${stepIndex}-${optionIndex}`}>
                                Es la respuesta correcta
                              </Label>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
                
                {/* (Aquí puedes añadir UI para 'simulation_data' si el tipo es 'simulation_result') */}

              </CardContent>
            </Card>
          ))}
          
          <Button onClick={addStep} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Paso
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        {/* 'processing' viene de useForm y deshabilita el botón mientras se guarda */}
        <Button onClick={handleSave} disabled={processing}>
          <Save className="mr-2 h-4 w-4" />
          {processing ? 'Guardando...' : (isEditMode ? 'Actualizar Indagación' : 'Guardar Indagación')}
        </Button>
      </div>
    </div>
  );
};

export default InquiryForm;