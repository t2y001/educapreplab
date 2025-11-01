import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Toaster, toast } from "sonner"; // Importamos Toaster
import { BookOpen, Target, TrendingUp, Trophy, LogOut, Users, Calendar, BarChart} from "lucide-react";
import { PageProps } from '@/types'; // Importamos los tipos de Inertia
import { route } from 'ziggy-js';

interface WeakTopic {
    name: string;
    accuracy: number;
    link: string;
}

interface PersonalStats {
    practiceStreak: number;
    overallAccuracy: number;
    communityAverage: number;
    weakestTopics: WeakTopic[];
}

interface CommunityChallenge {
    title: string;
    description: string;
    link: string;
}
// Definimos los tipos para las props que recibimos del controlador
interface DashboardProps extends PageProps {
    stats: {
        activeUsers: number;
        problemsSolved: number;
        successRate: number;
    };
    personalStats: PersonalStats;
    communityChallenge: CommunityChallenge;
}

export default function Dashboard() {
    // Obtenemos las props (incluyendo 'auth' y 'stats')
    const { auth, stats, personalStats, communityChallenge} = usePage<DashboardProps>().props;
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

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Tu Progreso Detallado</h2>
  
                        <div className="grid gap-6 md:grid-cols-3">
    
                            {/* --- Tarjeta: Puntos a Reforzar --- */}
                            <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Target className="h-6 w-6 text-destructive" />
                                        <CardTitle>Mis 3 Puntos a Reforzar</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Tu diagnóstico basado en las últimas prácticas. ¡Enfócate aquí!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
        <ul className="space-y-4">
          {personalStats.weakestTopics.map((topic) => (
            <li key={topic.name}>
              <Link href={topic.link} className="block p-4 rounded-lg bg-accent hover:bg-muted/80 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{topic.name}</span>
                  <span className="text-sm font-bold text-destructive">{topic.accuracy}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Tu precisión está por debajo del promedio. ¡Vamos a reforzar!
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    {/* --- Tarjeta: Racha y Comparativa --- */}
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle>Racha de Práctica</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold text-primary">
            🔥 {personalStats.practiceStreak}
          </div>
          <p className="text-muted-foreground mt-2">días seguidos practicando</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart className="h-6 w-6 text-secondary" />
            <CardTitle>Tu Comparativa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex justify-around gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{personalStats.overallAccuracy}%</div>
            <p className="text-sm text-muted-foreground">Tu Precisión</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-muted-foreground">{personalStats.communityAverage}%</div>
            <p className="text-sm text-muted-foreground">Promedio</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  {/* --- Tarjeta: Desafío de la Comunidad --- */}
  <Card className="mt-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-secondary/10 to-transparent">
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-secondary" />
          <CardTitle>{communityChallenge.title}</CardTitle>
        </div>
        <CardDescription className="mt-2">{communityChallenge.description}</CardDescription>
      </div>
      <Button asChild>
        <Link href={communityChallenge.link}>Intentar el Ítem</Link>
      </Button>
    </CardHeader>
  </Card>
</div>
                </main>
            </div>
        </>
    );
}