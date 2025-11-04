import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InquiryForm from '@/Pages/Admin/Inquiries/Partials/InquiryForm'; // <-- Importa el mismo formulario
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaBasePageProps } from '@inertiajs/core';
import { User, Area, Tema, Subtema, Inquiry } from '@/types'; // (Asegúrate de tener estos tipos)

// Definimos los props que Laravel nos envía desde el método 'edit'
interface PageProps extends InertiaBasePageProps {
  auth: { user: User };
  inquiry: Inquiry; // <-- La indagación a editar
  areas: Area[];
  temas: Tema[];
  subtemas: Subtema[];
}

export default function AdminEditInquiry() {
  const { auth, inquiry } = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar: {inquiry.title}</h2>}
    >
      <Head title={`Editar Indagación`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* El formulario detectará el prop 'inquiry' y se pondrá en modo edición */}
          <InquiryForm />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}