import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { PlusCircle, FileText, BookOpen, BarChart3 } from 'lucide-react';

export default function Dashboard({ auth, asignaciones, stats, recentItems, recentInquiries }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard de Profesor</h2>}
        >
            <Head title="Dashboard Profesor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Asignaciones del Profesor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tus Asignaciones</CardTitle>
                            <CardDescription>Áreas y audiencias asignadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {asignaciones.map((asignacion) => (
                                    <div key={asignacion.id} className="p-4 border rounded-lg">
                                        <div className="font-semibold">{asignacion.area?.nombre || 'Área no especificada'}</div>
                                        <div className="text-sm text-gray-600">{asignacion.audiencia?.nombre || 'Audiencia no especificada'}</div>
                                        <div className="text-xs text-gray-500 mt-2">Rol: {asignacion.rol}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_items}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Items Publicados</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.items_published}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Borradores</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.items_draft}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Indagaciones</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_inquiries}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Acciones Rápidas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                            <CardDescription>Crea nuevo contenido</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Link href={route('profesor.items.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Crear Item
                                </Button>
                            </Link>
                            <Link href={route('profesor.indagaciones.create')}>
                                <Button variant="outline">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Crear Indagación
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Contenido Reciente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items Recientes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Items Recientes</CardTitle>
                                <CardDescription>Últimos 5 items creados</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentItems.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentItems.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={route('profesor.items.show', item.id)}
                                                className="block p-3 border rounded hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-sm">Item #{item.id}</div>
                                                <div className="text-xs text-gray-500">
                                                    {item.status} • {new Date(item.updated_at).toLocaleDateString()}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No has creado items aún</p>
                                )}
                                <Link href={route('profesor.items.index')} className="block mt-4">
                                    <Button variant="link" className="p-0">Ver todos los items →</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Indagaciones Recientes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Indagaciones Recientes</CardTitle>
                                <CardDescription>Últimas 5 indagaciones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentInquiries.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentInquiries.map((inquiry) => (
                                            <Link
                                                key={inquiry.id}
                                                href={route('profesor.indagaciones.show', inquiry.id)}
                                                className="block p-3 border rounded hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-sm">{inquiry.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {inquiry.status} • {new Date(inquiry.updated_at).toLocaleDateString()}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No has creado indagaciones aún</p>
                                )}
                                <Link href={route('profesor.indagaciones.index')} className="block mt-4">
                                    <Button variant="link" className="p-0">Ver todas las indagaciones →</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
