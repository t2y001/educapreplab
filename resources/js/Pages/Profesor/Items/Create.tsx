import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { BlockEditor } from '@/Components/BlockEditor';
import { ArrowLeft, Save } from 'lucide-react';

interface Block {
    id: string;
    type: 'paragraph' | 'formula' | 'image' | 'rich_text' | 'list' | 'table' | 'html';
    content?: string;
    imageUrl?: string;
    imageAlt?: string;
    listItems?: string[];
    listType?: 'bullet' | 'numbered';
    tableData?: string[][];
}

interface Props {
    auth: any;
    areas: any[];
    temas: any[];
    subtemas: any[];
    audiencias: any[];
}

export default function ProfesorCreateItem({ auth, areas, temas, subtemas, audiencias }: Props) {
    // Jerarquía
    const [audienciaId, setAudienciaId] = useState('');
    const [areaId, setAreaId] = useState('');
    const [temaId, setTemaId] = useState('');
    const [subtemaId, setSubtemaId] = useState('');

    // Configuración
    const [difficulty, setDifficulty] = useState('medium');
    const [answerKey, setAnswerKey] = useState('A');
    const [visibility, setVisibility] = useState('public');
    const [author, setAuthor] = useState('');

    // Estímulo
    const [useStimulus, setUseStimulus] = useState(false);
    const [stimulusBlocks, setStimulusBlocks] = useState<Block[]>([]);

    // Pregunta
    const [questionBlocks, setQuestionBlocks] = useState<Block[]>([]);

    // Alternativas dinámicas según audiencia
    const selectedAudiencia = audiencias.find(a => a.id.toString() === audienciaId);
    const numAlternatives = selectedAudiencia?.num_alternatives || 3;
    const alternativeLetters = numAlternatives === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];

    const [choices, setChoices] = useState<Record<string, Block[]>>({
        A: [],
        B: [],
        C: [],
        D: [],
    });

    // Explicación
    const [explanationBlocks, setExplanationBlocks] = useState<Block[]>([]);

    const [saving, setSaving] = useState(false);

    // Filtros en cascada
    const filteredAreas = areas.filter(a => !audienciaId || a.audiencia_id.toString() === audienciaId);
    const filteredTemas = temas.filter(t => !areaId || t.area_id.toString() === areaId);
    const filteredSubtemas = subtemas.filter(s => !temaId || s.tema_id.toString() === temaId);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!subtemaId) {
            alert('Debes seleccionar un subtema');
            return;
        }

        if (questionBlocks.length === 0) {
            alert('Debes agregar contenido a la pregunta');
            return;
        }

        // Validar que todas las alternativas necesarias tengan contenido
        for (const letter of alternativeLetters) {
            if (choices[letter].length === 0) {
                alert(`La alternativa ${letter} está vacía`);
                return;
            }
        }

        setSaving(true);

        const data = {
            subtema_id: subtemaId,
            difficulty,
            answer_key: answerKey,
            visibility,
            author: author || null,
            question_json: { blocks: questionBlocks },
            stimulus_blocks: useStimulus && stimulusBlocks.length > 0 ? stimulusBlocks : null,
            choices: alternativeLetters.map((letter, index) => ({
                letter,
                order_index: index,
                content_json: { blocks: choices[letter] }
            })),
            explanation_json: explanationBlocks.length > 0 ? { blocks: explanationBlocks } : null,
        };

        router.post(route('profesor.items.store'), data, {
            onSuccess: () => {
                alert('Item creado exitosamente');
                router.visit(route('profesor.items.index'));
            },
            onError: (errors) => {
                console.error(errors);
                alert('Error al guardar el item. Revisa la consola para más detalles.');
                setSaving(false);
            },
            onFinish: () => {
                setSaving(false);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Crear Item" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.visit(route('profesor.dashboard'))}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                                <h1 className="text-3xl font-bold">Crear Nuevo Item</h1>
                            </div>
                            <Button type="submit" disabled={saving}>
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? 'Guardando...' : 'Guardar Item'}
                            </Button>
                        </div>

                        {/* Configuración General */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración General</CardTitle>
                                <CardDescription>Selecciona la jerarquía y propiedades del item</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Audiencia */}
                                    <div className="space-y-2 col-span-2">
                                        <Label>Audiencia *</Label>
                                        <Select value={audienciaId} onValueChange={(value) => {
                                            setAudienciaId(value);
                                            setAreaId('');
                                            setTemaId('');
                                            setSubtemaId('');
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona audiencia" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {audiencias.map(aud => (
                                                    <SelectItem key={aud.id} value={aud.id.toString()}>
                                                        {aud.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Área */}
                                    {audienciaId && (
                                        <div className="space-y-2 col-span-2">
                                            <Label>Área *</Label>
                                            <Select value={areaId} onValueChange={(value) => {
                                                setAreaId(value);
                                                setTemaId('');
                                                setSubtemaId('');
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona área" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredAreas.map(area => (
                                                        <SelectItem key={area.id} value={area.id.toString()}>
                                                            {area.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Tema */}
                                    {areaId && (
                                        <div className="space-y-2 col-span-2">
                                            <Label>Tema *</Label>
                                            <Select value={temaId} onValueChange={(value) => {
                                                setTemaId(value);
                                                setSubtemaId('');
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona tema" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredTemas.map(tema => (
                                                        <SelectItem key={tema.id} value={tema.id.toString()}>
                                                            {tema.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Subtema */}
                                    {temaId && (
                                        <div className="space-y-2 col-span-2">
                                            <Label>Subtema *</Label>
                                            <Select value={subtemaId} onValueChange={setSubtemaId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona subtema" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredSubtemas.map(subtema => (
                                                        <SelectItem key={subtema.id} value={subtema.id.toString()}>
                                                            {subtema.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Autor */}
                                    <div className="space-y-2 col-span-2">
                                        <Label>Autor (Opcional)</Label>
                                        <Input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="Ej: Juan Pérez, Universidad XYZ"
                                            maxLength={150}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Se mostrará debajo del estímulo en la visualización del ítem
                                        </p>
                                    </div>

                                    {/* Dificultad */}
                                    <div className="space-y-2">
                                        <Label>Dificultad</Label>
                                        <Select value={difficulty} onValueChange={setDifficulty}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Fácil</SelectItem>
                                                <SelectItem value="medium">Medio</SelectItem>
                                                <SelectItem value="hard">Difícil</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Respuesta Correcta */}
                                    <div className="space-y-2">
                                        <Label>Respuesta Correcta</Label>
                                        <Select value={answerKey} onValueChange={setAnswerKey}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {alternativeLetters.map(letter => (
                                                    <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Visibilidad */}
                                    <div className="space-y-2 col-span-2">
                                        <Label>Visibilidad</Label>
                                        <Select value={visibility} onValueChange={setVisibility}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Público</SelectItem>
                                                <SelectItem value="subscribers">Suscriptores</SelectItem>
                                                <SelectItem value="private">Privado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estímulo */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Estímulo (Opcional)</CardTitle>
                                        <CardDescription>Texto introductorio o contexto compartido</CardDescription>
                                    </div>
                                    <Switch checked={useStimulus} onCheckedChange={setUseStimulus} />
                                </div>
                            </CardHeader>
                            {useStimulus && (
                                <CardContent>
                                    <BlockEditor
                                        blocks={stimulusBlocks}
                                        onChange={setStimulusBlocks}
                                        label="Contenido del Estímulo"
                                    />
                                </CardContent>
                            )}
                        </Card>

                        {/* Pregunta */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pregunta *</CardTitle>
                                <CardDescription>Contenido de la pregunta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BlockEditor
                                    blocks={questionBlocks}
                                    onChange={setQuestionBlocks}
                                />
                            </CardContent>
                        </Card>

                        {/* Alternativas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Alternativas ({numAlternatives} opciones)</CardTitle>
                                <CardDescription>Define las opciones de respuesta</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {alternativeLetters.map(letter => (
                                    <div key={letter} className="space-y-2">
                                        <Label className="text-lg font-semibold">
                                            Alternativa {letter}
                                            {letter === answerKey && (
                                                <span className="text-green-600 ml-2 text-sm">(Correcta)</span>
                                            )}
                                        </Label>
                                        <BlockEditor
                                            blocks={choices[letter]}
                                            onChange={(blocks) => setChoices({ ...choices, [letter]: blocks })}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Explicación */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Explicación (Opcional)</CardTitle>
                                <CardDescription>Se muestra después de responder</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BlockEditor
                                    blocks={explanationBlocks}
                                    onChange={setExplanationBlocks}
                                    label="Explicación de la Respuesta"
                                />
                            </CardContent>
                        </Card>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
