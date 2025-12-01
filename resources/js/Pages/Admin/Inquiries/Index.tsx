import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Inquiry {
  id: number;
  title: string;
  description: string;
  steps_count: number;
  created_at: string;
  creator?: {
    name: string;
  };
}

interface Props {
  auth: any;
  inquiries: {
    data: Inquiry[];
    current_page: number;
    last_page: number;
  };
}

export default function Index({ auth, inquiries }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta indagación?')) {
      router.delete(route('admin.inquiries.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Administrar Indagaciones" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Indagaciones Científicas</h1>
              <p className="text-gray-600 mt-1">Gestiona las indagaciones del sistema</p>
            </div>
            <Link href={route('admin.inquiries.create')}>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Indagación
              </Button>
            </Link>
          </div>

          {/* Inquiries List */}
          <div className="grid gap-4">
            {inquiries.data.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{inquiry.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{inquiry.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={route('inquiry.show', inquiry.id)}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={route('admin.inquiries.edit', inquiry.id)}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>📚 {inquiry.steps_count} pasos</span>
                    <span>👤 {inquiry.creator?.name || 'Sistema'}</span>
                    <span>📅 {new Date(inquiry.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {inquiries.data.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">No hay indagaciones creadas aún</p>
                  <Link href={route('admin.inquiries.create')}>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primera Indagación
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {inquiries.last_page > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: inquiries.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === inquiries.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => router.get(route('admin.inquiries.index', { page }))}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}