import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from '@inertiajs/react'; // <-- CAMBIO: Usamos Link de Inertia
import {route} from 'ziggy-js'; // <-- AÑADIDO: Importamos route

const navLinks = [
  // A futuro, estas rutas vendrán de tu archivo web.php
  { href: "/bachillerato", label: "Bachillerato" },
  { href: "/preuniversitario", label: "Preuniversitario" },
  { href: "/profesores", label: "Profesores" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* CAMBIO: Usamos Link de Inertia y una ruta pública para la imagen */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <img src="/images/logo-horizontal-transparent.png" alt="EducaPrepLab logo" className="h-9 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              // CAMBIO: Usamos Link de Inertia
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {/* CAMBIO: Usamos Link de Inertia y la función route() */}
            <Button variant="outline" asChild>
              <Link href={route('login')}>Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href={route('register')}>Registrarse</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 p-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <img src="/images/logo-horizontal-transparent.png" alt="EducaPrepLab logo" className="h-9 w-auto" />
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-4 mt-4 border-t pt-4">
                    <Button variant="outline" asChild>
                       <Link href={route('login')} onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                    </Button>
                    <Button asChild>
                       <Link href={route('register')} onClick={() => setIsOpen(false)}>Registrarse</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};