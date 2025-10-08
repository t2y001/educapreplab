import { Link } from '@inertiajs/react'; // <-- CAMBIO: Usamos Link de Inertia
import { Card, CardContent } from "@/Components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

interface SubjectCardProps {
  title: string;
  description: string;
  topics: string[];
  problemCount: number;
  link: string;
  icon: React.ElementType;
}

export default function SubjectCard({ title, description, topics, problemCount, link, icon: Icon }: SubjectCardProps) {
  const safeTopics = topics || [];
  
  return (
    // CAMBIO: Reemplazamos <Link to={link}> por <Link href={link}>
    <Link href={link} className="block">
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-border/50 bg-card overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="bg-primary/10 rounded-lg w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <Icon className="w-10 h-10 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>

              <p className="text-sm text-muted-foreground mb-4">{description}</p>

              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 mb-4">
                {safeTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ol>
              
              <Badge variant="secondary">{problemCount} problemas</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};