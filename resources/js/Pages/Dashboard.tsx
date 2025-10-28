import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Toaster, toast } from "sonner"; // Importamos Toaster
import { BookOpen, Target, TrendingUp, Trophy, LogOut, Users } from "lucide-react";
import { PageProps } from '@/types'; // Importamos los tipos de Inertia
import { route } from 'ziggy-js';

// Definimos los tipos para las props que recibimos del controlador
interface DashboardProps extends PageProps {
    stats: {
        activeUsers: number;
        problemsSolved: number;
        successRate: number;
    };
}

export default function Dashboard() {
    // Obtenemos las props (incluyendo 'auth' y 'stats')
    const { auth, stats } = usePage<DashboardProps>().props;
    const user = auth.user;

    // Función de Logout adaptada a Inertia
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('logout'), {}, {
            onSuccess: () => {
                toast.success("Sesión cerrada");
            }
        });
    };

    // Tu helper de Badge (está perfecto)
    const getPlanBadge = (plan: string | null) => {
        const variants = {
            free: { label: "Plan Gratuito", variant: "outline" as const },
            inicial: { label: "Plan Inicial", variant: "secondary" as const },
            avanzado: { label: "Plan Avanzado", variant: "default" as const }
        };
        // Asumimos que 'free' es el plan por defecto si es nulo
        const planKey = plan as keyof typeof variants || 'free';
        return variants[planKey] || variants.free;
    };

    const planInfo = getPlanBadge(user.subscription_plan); // Asumimos que 'subscription_plan' está en el modelo User

    return (
        <>
            <Head title="Mi Panel de Control" />
            <Toaster richColors /> {/* Componente para mostrar notificaciones */}

            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent to-secondary/5">
                <header className="bg-card border-b">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold text-primary">EducaPrepLab</h1>
                                <p className="text-sm text-muted-foreground">
                                    Bienvenido, {user.name || "Usuario"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={planInfo.variant}>{planInfo.label}</Badge>
                            <form onSubmit={handleLogout}>
                                <Button variant="ghost" size="icon" type="submit">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        
                        {/* MEJORA: Usamos <Link> de Inertia en lugar de botones deshabilitados */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Target className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Modo Práctica</CardTitle>
                                <CardDescription>
                                    Practica por tema, dificultad, tipo de problema o casuística a tu ritmo. 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" asChild>
                                    {/* A futuro, esta ruta debe existir en web.php */}
                                    <Link href={route('profesores.index')}>Empezar Práctica</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Trophy className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Simulacros</CardTitle>
                                <CardDescription>
                                    Realiza exámenes completos cronometrados y evalúa tu avance. Mira tu feedback detallado y estadísticas. 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" asChild>
                                    <Link href="#"> Simulacros</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Mis Estadísticas</CardTitle>
                                <CardDescription>
                                    {user.subscription_plan === "free" 
                                      ? "Disponible en Plan Inicial" 
                                      : "Revisa tu progreso y avances"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button 
                                    className="w-full" 
                                    disabled={user.subscription_plan === "free"}
                                    asChild
                                >
                                    <Link href={user.subscription_plan === "free" ? "#" : "#"}>
                                      {user.subscription_plan === "free" ? "🔒 Mejorar Plan" : "Ver Estadísticas"}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <Users className="h-8 w-8 text-secondary mb-2" />
                            <CardTitle>Estadísticas de la Comunidad</CardTitle>
                            <CardDescription>Datos de todos los usuarios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="text-center p-4 bg-accent rounded-lg">
                                    <p className="text-3xl font-bold text-primary">{stats.activeUsers}</p>
                                    <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                                </div>
                                <div className="text-center p-4 bg-accent rounded-lg">
                                    <p className="text-3xl font-bold text-secondary">{stats.problemsSolved}</p>
                                    <p className="text-sm text-muted-foreground">Problemas Resueltos</p>
                                </div>
                                <div className="text-center p-4 bg-accent rounded-lg">
                                    <p className="text-3xl font-bold text-primary">{stats.successRate}%</p>
                                    <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    );
}