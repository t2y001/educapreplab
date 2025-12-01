import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Item {
    id: number;
    question_json: any;
    difficulty: 'easy' | 'medium' | 'hard';
    answer_key: string;
    visibility: string;
    status: string;
    author?: string;
    created_at: string;
    updated_at: string;
    stimulus?: {
        id: number;
        content_json: any;
    };
}

interface Props {
    auth: any;
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ProfesorItemsIndex({ auth, items }: Props) {
    const difficultyColors = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800',
    };

    const difficultyLabels = {
        easy: 'Fácil',
        medium: 'Medio',
        hard: 'Difícil',
    };

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        active: 'bg-blue-100 text-blue-800',
        archived: 'bg-orange-100 text-orange-800',
    };

    const statusLabels = {
        draft: 'Borrador',
        active: 'Activo',
        archived: 'Archivado',
    };

    const getQuestionPreview = (questionJson: any) => {
        if (!questionJson || !questionJson.blocks || questionJson.blocks.length === 0) {
            return 'Sin contenido';
        }
        const firstBlock = questionJson.blocks[0];
        return firstBlock.content?.substring(0, 100) || 'Sin contenido';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mis Ítems" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Mis Ítems</h1>
                            <p className="text-muted-foreground mt-1">
                                Total: {items.total} ítems
                            </p>
                        </div>
                        <Button onClick={() => router.visit(route('profesor.items.create'))}>
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Nuevo Ítem
                        </Button>
                    </div>

                    {/* Items List */}
                    {items.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground mb-4">
                                    No has creado ningún ítem todavía
                                </p>
                                <Button onClick={() => router.visit(route('profesor.items.create'))}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primer Ítem
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {items.data.map((item) => (
                                <Card key={item.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CardTitle className="text-lg">
                                                        Ítem #{item.id}
                                                    </CardTitle>
                                                    <Badge className={difficultyColors[item.difficulty]}>
                                                        {difficultyLabels[item.difficulty]}
                                                    </Badge>
                                                    <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                                                        {statusLabels[item.status as keyof typeof statusLabels]}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        Respuesta: {item.answer_key}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="line-clamp-2">
                                                    {getQuestionPreview(item.question_json)}
                                                </CardDescription>
                                                {item.author && (
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Autor: {item.author}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Actualizado: {new Date(item.updated_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(route('profesor.items.show', item.id))}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(route('profesor.items.edit', item.id))}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('¿Estás seguro de eliminar este ítem?')) {
                                                            router.delete(route('profesor.items.destroy', item.id));
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {items.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: items.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === items.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.visit(route('profesor.items.index', { page }))}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
