import { useEffect, FormEventHandler, ReactNode, useState } from 'react'; // <-- AÑADIDO: useState
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/Components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/Components/ui/select';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/Components/ui/accordion';
import { Checkbox } from '@/Components/ui/checkbox';
import { Progress } from '@/Components/ui/progress'; // <-- AÑADIDO: Barra de Progreso
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { route } from 'ziggy-js';

// --- Interfaces (igual que antes) ---
interface Area {
  id: number;
  nombre: string;
}
interface RegisterProps {
  areas: Area[];
}

export default function Register({ areas }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        prioritized_area_id: '',
        institutional_code: '',
        terms_accepted: false,
    });

    // --- NUEVO: Estado para errores del cliente ---
    const [clientErrors, setClientErrors] = useState({
        password: '',
        password_confirmation: ''
    });

    // --- NUEVO: Estado para la fuerza de la contraseña ---
    const [strength, setStrength] = useState({
        score: 0,
        label: 'Débil',
        color: 'bg-red-500'
    });

    // --- NUEVO: Lógica para validar en tiempo real ---
    useEffect(() => {
        // 1. Validar longitud de la contraseña
        if (data.password.length > 0 && data.password.length < 4) {
            setClientErrors(prev => ({ ...prev, password: 'La contraseña debe tener al menos 4 caracteres.' }));
        } else {
            setClientErrors(prev => ({ ...prev, password: '' }));
        }

        // 2. Validar que las contraseñas coincidan
        if (data.password_confirmation.length > 0 && data.password !== data.password_confirmation) {
            setClientErrors(prev => ({ ...prev, password_confirmation: 'Las contraseñas no coinciden.' }));
        } else {
            setClientErrors(prev => ({ ...prev, password_confirmation: '' }));
        }

        // 3. Calcular la fuerza de la contraseña
        let score = 0;
        if (data.password.length >= 4) score++;
        if (data.password.length >= 8) score++;
        if (/[A-Z]/.test(data.password)) score++; // Mayúscula
        if (/[0-9]/.test(data.password)) score++; // Número
        if (/[^A-Za-z0-9]/.test(data.password)) score++; // Símbolo
        
        let label = 'Débil';
        let color = 'bg-red-500';
        if (score > 4) { label = 'Muy Fuerte'; color = 'bg-emerald-500'; }
        else if (score > 3) { label = 'Fuerte'; color = 'bg-green-500'; }
        else if (score > 1) { label = 'Media'; color = 'bg-yellow-500'; }
        setStrength({ score, label, color });

    }, [data.password, data.password_confirmation]);


    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // --- NUEVO: Doble chequeo antes de enviar ---
        if (clientErrors.password || clientErrors.password_confirmation) {
            return; // Detiene el envío si hay errores del cliente
        }
        
        post(route('register'));
    };

    return (
        <>
            <Head title="Registrarse" />

            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Crea tu cuenta</CardTitle>
                    <CardDescription>
                        El primer paso para tu éxito académico.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="grid gap-4">
                            {/* --- Nombre --- */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoFocus
                                    required
                                />
                                {/* Muestra error del backend (errors) o del cliente (clientErrors) */}
                                <InputError message={errors.name} />
                            </div>

                            {/* --- Correo --- */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* --- Área Priorizada --- */}
                            <div className="grid gap-2">
                                <Label htmlFor="area">Área Priorizada</Label>
                                <Select onValueChange={(value) => setData('prioritized_area_id', value)} required>
                                    <SelectTrigger id="area">
                                        <SelectValue placeholder="Selecciona tu área de interés" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areas?.map((area) => (
                                            <SelectItem key={area.id} value={String(area.id)}>
                                                {area.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.prioritized_area_id} />
                            </div>

                            {/* --- CAMBIO DE LAYOUT: Contraseñas en filas separadas --- */}
                            
                            {/* --- Contraseña --- */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {/* Muestra error del backend (errors) o del cliente (clientErrors) */}
                                <InputError message={errors.password || clientErrors.password} />
                                
                                {/* --- NUEVO: Indicador de Fuerza --- */}
                                {data.password.length > 0 && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Progress value={strength.score * 20} className={`h-2 ${strength.color}`} />
                                        <span className="text-xs text-muted-foreground w-20 text-right">
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* --- Confirmar Contraseña --- */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {/* Muestra error del backend (errors) o del cliente (clientErrors) */}
                                <InputError message={errors.password_confirmation || clientErrors.password_confirmation} />
                            </div>
                            
                            {/* --- Código Institucional --- */}
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1" className="border-b-0">
                                <AccordionTrigger className="text-sm text-muted-foreground py-2 hover:no-underline">
                                  ¿Tienes un código de convenio institucional?
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid gap-2">
                                    <Label htmlFor="institutional_code">Código de Convenio</Label>
                                    <Input
                                      id="institutional_code"
                                      value={data.institutional_code}
                                      onChange={(e) => setData('institutional_code', e.target.value)}
                                      placeholder="Ej: XYZ-2025"
                                    />
                                    <InputError message={errors.institutional_code} />
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* --- Términos y Condiciones --- */}
                            <div className="flex items-start space-x-2 pt-2">
                                <Checkbox 
                                    id="terms_accepted" 
                                    checked={data.terms_accepted}
                                    onCheckedChange={(checked) => setData('terms_accepted', Boolean(checked))}
                                />
                                <label
                                    htmlFor="terms_accepted"
                                    className="text-sm text-muted-foreground"
                                >
                                    Acepto los{' '}
                                    <Link href={route('home')} className="underline hover:text-primary">
                                        Términos de Servicio
                                    </Link>{' '}
                                    y la{' '}
                                    <Link href={route('home')} className="underline hover:text-primary">
                                        Política de Privacidad
                                    </Link>
                                    .
                                </label>
                            </div>
                            <InputError message={errors.terms_accepted} />

                            {/* --- Botón de Envío --- */}
                            <div className="flex items-center justify-between mt-4">
                                <Link
                                    href={route('login')}
                                    className="underline text-sm text-muted-foreground hover:text-foreground"
                                >
                                    ¿Ya tienes una cuenta?
                                </Link>

                                <Button 
                                    className="ms-4" 
                                    // Deshabilitado si hay errores del cliente o del backend
                                    disabled={
                                        processing || 
                                        !data.terms_accepted || 
                                        Boolean(clientErrors.password) ||
                                        Boolean(clientErrors.password_confirmation)
                                    }
                                >
                                    Crear Cuenta
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

// Asignar el layout
Register.layout = (page: ReactNode) => (
    <GuestLayout children={page} />
);