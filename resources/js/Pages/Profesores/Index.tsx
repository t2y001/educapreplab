import { Head, Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { FlaskConical, Sigma } from "lucide-react";
import SubjectCard from "@/Components/SubjectCard";
import MainLayout from '@/Layouts/MainLayout'; // Usaremos el layout principal

// --- TIPOS ---
interface Subject {
  id: string;
  title: string;
  description: string;
  problemCount: number;
  link: string;
}
interface SubjectWithAssets extends Subject {
  image: string;
  icon: React.ElementType;
  topics: string[];
}

// --- ASSETS LOCALES ---
// Esto se mantiene, es una buena forma de mapear assets que solo existen en el frontend
const subjectAssets: Record<string, { image: string; icon: React.ElementType; topics: string[] }> = {
    "ciencia-y-tecnologia": {
      image: "/images/ciencia-tecnologia.png", // CAMBIO: Rutas públicas
      icon: FlaskConical,
      topics: [ "Principios y teorías pedagógicas", "Indagación científica", "Explicación del mundo físico", "Soluciones tecnológicas" ],
    },
    "matematica": {
      image: "/images/matematica-card.jpg", // CAMBIO: Rutas públicas
      icon: Sigma,
      topics: [ "Problemas de cantidad", "Regularidad, equivalencia y cambio", "Forma, movimiento y localización", "Gestión de datos e incertidumbre" ],
    },
};

// --- EL COMPONENTE DE LA PÁGINA ---
// CAMBIO: Recibe 'subjects' como prop desde el controlador de Laravel
export default function ProfesoresPage({ subjects }: { subjects: Subject[] }) {
    
    // CAMBIO: Ya no usamos useEffect/useState para fetching.
    // Combinamos los datos del backend con los assets del frontend.
    const subjectsWithAssets: SubjectWithAssets[] = subjects
        .filter(subject => subject.id in subjectAssets) // Filtra para evitar errores si un subject no tiene assets
        .map(subject => ({
            ...subject,
            ...subjectAssets[subject.id] // Combina con los assets locales
        }));

	return (
		<>
            <Head title="Portal para Docentes" />

			{/* Carousel Section */}
			<section className="relative h-[50vh] bg-gray-800 text-white flex items-center justify-center">
				<img
					src="/images/teacher-carousel.png" // CAMBIO: Ruta pública
					alt="Docentes colaborando"
					className="absolute inset-0 w-full h-full object-cover opacity-40"
				/>
				<div className="relative text-center p-4">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Potencia tu Carrera Docente
					</h1>
					<p className="text-lg md:text-xl max-w-3xl mx-auto">
						Herramientas y recursos para tu nombramiento, ascenso y desarrollo profesional continuo.
					</p>
				</div>
			</section>

			{/* Subjects Section */}
			<section id="subjects" className="py-16 md:py-24 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							Explora por Área Curricular
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Elige tu área y sumérgete en un mundo de aprendizaje con problemas estructurados y soluciones guiadas.
						</p>
					</div>

					<div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
                        {/* CAMBIO: Usamos los datos combinados */}
						{subjectsWithAssets.map((subject) => (
							// CAMBIO: Link de Inertia no necesita estar dentro de otro
                            <SubjectCard {...subject} key={subject.id} />
						))}
					</div>
				</div>
			</section>
		</>
	);
};

// Le decimos a Inertia que esta página debe usar el Layout Principal
ProfesoresPage.layout = (page: ReactNode) => <MainLayout children={page} />;