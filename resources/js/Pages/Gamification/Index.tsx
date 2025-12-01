import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useGamification } from '@/Hooks/useGamification';
import { UserStatsCard } from '@/Components/Gamification/UserStatsCard';
import { AchievementsList } from '@/Components/Gamification/AchievementsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { Trophy, Target, Flame, Star } from 'lucide-react';

export default function GamificationPage({ auth }: { auth: any }) {
    const { stats, achievements, loading, error } = useGamification();

    if (error) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Gamificación" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800">Error al cargar datos: {error}</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mi Progreso - Gamificación" />

            <div className="py-12 bg-gradient-to-b from-purple-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Mi Progreso Científico
                        </h1>
                        <p className="text-gray-600">
                            Sigue tu evolución como científico y desbloquea logros increíbles
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Main Stats Card */}
                        <div className="lg:col-span-1">
                            {loading ? (
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-8 w-32" />
                                        <Skeleton className="h-4 w-48 mt-2" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-32 w-full" />
                                    </CardContent>
                                </Card>
                            ) : stats ? (
                                <UserStatsCard stats={stats} />
                            ) : null}
                        </div>

                        {/* Quick Stats */}
                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            {loading ? (
                                <>
                                    {[1, 2, 3, 4].map((i) => (
                                        <Card key={i}>
                                            <CardContent className="pt-6">
                                                <Skeleton className="h-16 w-full" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            ) : stats ? (
                                <>
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Trophy className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <CardTitle className="text-sm font-medium text-gray-600">
                                                    Nivel Actual
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-3xl font-bold text-gray-900">{stats.level}</p>
                                            <p className="text-sm text-gray-500 mt-1">{stats.scientist_title}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-orange-100 p-2 rounded-lg">
                                                    <Flame className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <CardTitle className="text-sm font-medium text-gray-600">
                                                    Racha Actual
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-3xl font-bold text-gray-900">{stats.current_streak}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Máxima: {stats.longest_streak} días
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-yellow-100 p-2 rounded-lg">
                                                    <Star className="w-5 h-5 text-yellow-600" />
                                                </div>
                                                <CardTitle className="text-sm font-medium text-gray-600">
                                                    Logros
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stats.achievements_unlocked}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                de {stats.total_achievements} totales
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <Target className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <CardTitle className="text-sm font-medium text-gray-600">
                                                    XP Total
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stats.total_xp.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {stats.xp} / {stats.xp_for_next_level} para nivel {stats.level + 1}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : null}
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Logros</CardTitle>
                            <CardDescription>
                                Desbloquea logros completando indagaciones y alcanzando metas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-32 w-full" />
                                    ))}
                                </div>
                            ) : achievements.length > 0 ? (
                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="all">Todos</TabsTrigger>
                                        <TabsTrigger value="unlocked">Desbloqueados</TabsTrigger>
                                        <TabsTrigger value="locked">Bloqueados</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all">
                                        <AchievementsList achievements={achievements} />
                                    </TabsContent>

                                    <TabsContent value="unlocked">
                                        <AchievementsList
                                            achievements={achievements.filter((a) => a.unlocked)}
                                        />
                                    </TabsContent>

                                    <TabsContent value="locked">
                                        <AchievementsList
                                            achievements={achievements.filter((a) => !a.unlocked)}
                                        />
                                    </TabsContent>
                                </Tabs>
                            ) : (
                                <div className="text-center py-12">
                                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No hay logros disponibles</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
