import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { PlantSimulator } from '@/Components/Simulators/PlantSimulator';
import { XpNotification } from '@/Components/Gamification/XpNotification';
import { LevelUpModal } from '@/Components/Gamification/LevelUpModal';

interface InquiryProps {
    auth: any;
    inquiry: {
        id: number;
        title: string;
        description: string;
        content: {
            steps: Array<{
                number: number;
                title: string;
                type: string;
                content: any;
                xp_reward: number;
            }>;
        };
        total_steps: number;
    };
    progress: {
        current_step: number;
        data: Record<string, any>;
        completed: boolean;
        time_spent: number;
    };
}

export default function InquiryShow({ auth, inquiry, progress }: InquiryProps) {
    const [currentStep, setCurrentStep] = useState(progress.current_step);
    const [stepData, setStepData] = useState<Record<string, any>>(progress.data || {});
    const [showXpNotif, setShowXpNotif] = useState(false);
    const [xpData, setXpData] = useState<any>(null);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const step = inquiry.content.steps[currentStep - 1];
    const progressPercentage = (currentStep / inquiry.total_steps) * 100;

    const saveProgress = async (data: any) => {
        try {
            const response = await fetch(`/indagacion/${inquiry.id}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    step: currentStep,
                    data,
                }),
            });

            const result = await response.json();

            if (result.gamification) {
                setXpData(result.gamification);
                setShowXpNotif(true);

                if (result.gamification.leveled_up) {
                    setTimeout(() => setShowLevelUp(true), 2000);
                }
            }

            setStepData({ ...stepData, [`step_${currentStep}`]: data });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const nextStep = () => {
        if (currentStep < inquiry.total_steps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (step.type) {
            case 'problem':
                return (
                    <div className="space-y-6">
                        <p className="text-lg">{step.content.introduction}</p>
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <label className="block text-sm font-medium mb-2">
                                {step.content.prompt}
                            </label>
                            <textarea
                                className="w-full p-3 border rounded-lg"
                                rows={4}
                                placeholder="Escribe tu pregunta aquí..."
                                defaultValue={stepData[`step_${currentStep}`]?.question || ''}
                                onBlur={(e) => saveProgress({ question: e.target.value })}
                            />
                            {step.content.hints && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium">💡 Pistas:</p>
                                    {step.content.hints.map((hint: string, i: number) => (
                                        <p key={i} className="text-sm text-gray-600">• {hint}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'hypothesis':
                return (
                    <div className="space-y-6">
                        <p className="text-lg">{step.content.introduction}</p>
                        <div className="bg-purple-50 p-6 rounded-lg">
                            <p className="text-sm font-medium mb-4">Plantilla: {step.content.template}</p>
                            <textarea
                                className="w-full p-3 border rounded-lg"
                                rows={3}
                                placeholder="Si... entonces..."
                                defaultValue={stepData[`step_${currentStep}`]?.hypothesis || ''}
                                onBlur={(e) => saveProgress({ hypothesis: e.target.value })}
                            />
                        </div>
                    </div>
                );

            case 'experiment':
                return (
                    <div className="space-y-6">
                        <p className="text-lg">{step.content.introduction}</p>
                        <PlantSimulator
                            onExperimentComplete={(data) => {
                                const experiments = stepData[`step_${currentStep}`]?.experiments || [];
                                saveProgress({ experiments: [...experiments, data] });
                            }}
                        />
                    </div>
                );

            case 'data_record':
                return (
                    <div className="space-y-6">
                        <p className="text-lg">{step.content.introduction}</p>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Los datos de tus experimentos se registran automáticamente.
                            </p>
                            {stepData[`step_3`]?.experiments && (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-green-100">
                                                <th className="border p-2">Color de Luz</th>
                                                <th className="border p-2">Intensidad</th>
                                                <th className="border p-2">Absorción</th>
                                                <th className="border p-2">Fotosíntesis</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stepData[`step_3`].experiments.map((exp: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="border p-2">{exp.lightColor}</td>
                                                    <td className="border p-2">{exp.intensity}%</td>
                                                    <td className="border p-2">{exp.absorption}%</td>
                                                    <td className="border p-2">{exp.photosynthesis}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'analysis':
                return (
                    <div className="space-y-6">
                        <p className="text-lg">{step.content.introduction}</p>
                        {step.content.questions?.map((q: any, i: number) => (
                            <div key={q.id} className="bg-yellow-50 p-6 rounded-lg">
                                <p className="font-medium mb-3">{i + 1}. {q.text}</p>
                                <textarea
                                    className="w-full p-3 border rounded-lg"
                                    rows={3}
                                    placeholder="Tu respuesta..."
                                    defaultValue={stepData[`step_${currentStep}`]?.[q.id] || ''}
                                    onBlur={(e) => {
                                        const answers = stepData[`step_${currentStep}`] || {};
                                        answers[q.id] = e.target.value;
                                        saveProgress(answers);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                );

            default:
                return <p>Tipo de paso desconocido</p>;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={inquiry.title} />

            <div className="py-12 bg-gradient-to-b from-green-50 to-white min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{inquiry.title}</h1>
                        <p className="text-gray-600">{inquiry.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                    Paso {currentStep} de {inquiry.total_steps}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {Math.round(progressPercentage)}% completado
                                </span>
                            </div>
                            <Progress value={progressPercentage} className="h-3" />
                        </CardContent>
                    </Card>

                    {/* Step Content */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {step.type}
                                </span>
                                {step.title}
                                <span className="ml-auto text-sm font-normal text-purple-600">
                                    +{step.xp_reward} XP
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderStepContent()}
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>
                        <Button
                            onClick={nextStep}
                            disabled={currentStep === inquiry.total_steps}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {showXpNotif && xpData && (
                <XpNotification
                    xpAwarded={xpData.xp_awarded}
                    multiplier={xpData.multiplier}
                    onClose={() => setShowXpNotif(false)}
                />
            )}

            {showLevelUp && xpData?.leveled_up && (
                <LevelUpModal
                    newLevel={xpData.new_level}
                    newTitle={xpData.new_title}
                    xpForNextLevel={1000}
                    onClose={() => setShowLevelUp(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
