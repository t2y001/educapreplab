import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InquiryForm from '@/Pages/Admin/Inquiries/Partials/InquiryForm'; // <-- Importa el formulario
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaBasePageProps } from '@inertiajs/core';
import { User, Area, Tema, Subtema } from '@/types'; // (Asegúrate de tener estos tipos)

// Definimos los props que Laravel nos envía desde el método 'create'
interface PageProps extends InertiaBasePageProps {
  auth: { user: User };
  areas: Area[];
  temas: Tema[];
  subtemas: Subtema[];
}

export default function AdminCreateInquiry() {
  const { auth } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nueva Indagación</h2>}
    >
      <Head title="Crear Indagación" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* El formulario se encarga de todo, recibe los props de usePage() automáticamente */}
          <InquiryForm /> 
        </div>
      </div>
    </AuthenticatedLayout>
  );
}