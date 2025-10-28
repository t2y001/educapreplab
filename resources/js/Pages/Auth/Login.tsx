import { useEffect, FormEventHandler, ReactNode } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox'; // Usaremos el checkbox de shadcn
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { route } from 'ziggy-js';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <Label htmlFor="email">Correo Electrónico</Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="password">Contraseña</Label>

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" checked={data.remember} onCheckedChange={(checked) => setData('remember', !!checked)} />
                        <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Recordarme
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-muted-foreground hover:text-foreground"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <Button className="ms-4" disabled={processing}>
                        Iniciar Sesión
                    </Button>
                </div>
            </form>
        </>
    );
}

Login.layout = (page: ReactNode) => (
    <GuestLayout children={page} />
);
