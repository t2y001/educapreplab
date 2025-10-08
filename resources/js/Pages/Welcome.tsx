import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { GraduationCap, BookOpen, Calculator, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

// Las props que recibe de Laravel. Las mantenemos por compatibilidad.
export default function Welcome({ auth}) {
  const audiences = [
    {
      title: "Para Docentes",
      description: "Simulacros cronometrados, casuísticas resueltas y retroalimentación inmediata para tu éxito en el examen de ascenso o nombramiento del MINEDU.",
      image: "/images/teacher-card.jpg", 
      icon: GraduationCap,
      link: "/profesores",
      color: "from-primary/20 to-primary/5"
    },
    // ... (los otros audiences, asegúrate que las rutas de imagen sean públicas)
    {
      title: "Bachillerato",
      description: "Accede a materiales y prácticas que potencian tu rendimiento en el Bachillerato Internacional, con un enfoque dinámico y adaptable a cada asignatura.",
      image: "/images/bachillerato-card.jpg", 
      icon: BookOpen,
      link: "/bachillerato",
      color: "from-secondary/20 to-secondary/5"
    },
    {
      title: "Preuniversitario",
      description: "Prepárate con simulacros y bancos de preguntas de admisión de las universidades más prestigiosas del Perú para alcanzar tu meta universitaria.",
      image: "/images/preuniversitario-card.jpg", 
      icon: Calculator,
      link: "/preuniversitario",
      color: "from-accent/20 to-accent/5"
    }
  ];

  return (
    <>
      <Head title="Bienvenido a EducaPrepLab" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/images/hero-education.jpg" // <-- CAMBIO: Ruta pública
            alt="Estudiantes aprendiendo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
           {/* El resto del contenido del Hero Section se mantiene igual */}
           <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Bienvenido a EducaPrepLab
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
              Tu plataforma educativa personalizada para alcanzar tus metas académicas. 
              Contenido especializado para profesores, estudiantes de bachillerato y preuniversitarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <Button size="lg" variant="secondary" className="text-lg" asChild>
                <a href="#audiencias">
                  Comenzar Ahora
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Audiences Section */}
      <section id="audiencias" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Elige tu camino de aprendizaje
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contenido diseñado específicamente para tus necesidades educativas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <Card 
                  key={audience.title}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-b ${audience.color}`} />
                    <img 
                      src={audience.image} 
                      alt={audience.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <Icon className="h-16 w-16 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{audience.title}</CardTitle>
                    <CardDescription className="text-base">
                      {audience.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      {/* CAMBIO IMPORTANTE: Usamos Link de Inertia */}
                      <Link href={audience.link}>
                        Explorar
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

       {/* Features Section (se mantiene igual) */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              ¿Por qué EducaPrepLab?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contenido Especializado</h3>
              <p className="text-muted-foreground">
                Material diseñado por expertos para cada nivel y objetivo específico
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aprende a tu ritmo</h3>
              <p className="text-muted-foreground">
                Acceso 24/7 para que estudies cuando mejor te convenga
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ejercicios Prácticos</h3>
              <p className="text-muted-foreground">
                Miles de ejercicios resueltos y propuestos para dominar cada tema
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Le decimos a Inertia que esta página debe usar MainLayout por defecto
Welcome.layout = (page: React.ReactNode) => <MainLayout children={page} />;