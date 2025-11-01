import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import MainLayout from '@/Layouts/MainLayout';
import { ReactNode } from 'react';
import { route } from 'ziggy-js';

export default function SubscriptionPage() {
  return (
    <>
      <Head title="Planes de Suscripción" />

      <div className="bg-muted/30">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Elige el Plan Perfecto para Ti
            </h1>
            <p className="text-lg text-muted-foreground">
              Accede a todas las herramientas y contenido exclusivo para asegurar tu éxito.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Plan Gratuito */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <div className="text-4xl font-bold">S/ 0</div>
                <CardDescription>Para que empieces a explorar</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                  <FeatureItem>Acceso a problemas de muestra</FeatureItem>
                  <FeatureItem>Verificación de respuestas</FeatureItem>
                  <FeatureItem>Estadísticas de la comunidad</FeatureItem>
                </div>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href={route('register')}>Empezar Gratis</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Plan Premium */}
            <Card className="border-primary border-2 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Recomendado
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold text-primary">S/ 20 <span className="text-lg font-normal text-muted-foreground">/ mes</span></div>
                <CardDescription>Acceso completo e ilimitado</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                  <FeatureItem><strong>Todo</strong> lo del plan gratuito</FeatureItem>
                  <FeatureItem>Acceso a <strong>todas</strong> las casuísticas y soluciones</FeatureItem>
                  <FeatureItem>Simulacros de examen <strong>ilimitados</strong></FeatureItem>
                  <FeatureItem>Modo de práctica <strong>adaptativo</strong></FeatureItem>
                  <FeatureItem>Estadísticas de progreso <strong>personales</strong></FeatureItem>
                </div>
                {/* Este botón debería llevar a tu pasarela de pago (Stripe, MercadoPago, etc.) */}
                <Button className="w-full mt-6">
                  Elegir Plan Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}

// Componente auxiliar para los items de características
const FeatureItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span className="text-sm text-foreground">{children}</span>
  </div>
);

// Asignar el layout por defecto
SubscriptionPage.layout = (page: ReactNode) => <MainLayout children={page} />;

