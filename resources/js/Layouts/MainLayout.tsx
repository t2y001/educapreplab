import Header from '@/Components/Header';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {children}
      </main>
      
      {/* Footer extraído de tu archivo Index.tsx */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 EducaPrepLab. Transformando la educación en Perú.
          </p>
        </div>
      </footer>
    </div>
  );
}