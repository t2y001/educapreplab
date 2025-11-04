import { useState, useEffect } from "react";
// --- CAMBIOS DE INERTIA ---
import { Link, usePage, router, Head } from "@inertiajs/react";
// --------------------------
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, Shield, Plus } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
// Asume que tienes un layout de Admin
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; 
import { User } from "@/types"; // Importa el tipo User de tu archivo de tipos
import { PageProps as InertiaBasePageProps } from '@inertiajs/core';
import { route } from 'ziggy-js';

// --- Tipos de datos (ajusta según tus modelos) ---
interface Inquiry {
  id: number;
  title: string;
  status: 'draft' | 'published';
  area?: { nombre: string };
  tema?: { nombre: string };
  // ...otras propiedades que pases desde Laravel
}

interface PageProps extends InertiaBasePageProps {
  inquiries: Inquiry[];
  auth: {
    user: User; // Define el prop 'auth'
  };
  // ...otros props de Laravel (ej. 'auth', 'flash')
}

const AdminInquiriesIndex = () => {
  const { toast } = useToast();
  // --- CAMBIO DE INERTIA: Recibir datos como props ---
  const { inquiries , auth} = usePage<PageProps>().props;

  // --- El estado local se conserva para filtros y UI ---
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>(inquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteInquiryId, setDeleteInquiryId] = useState<number | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  // --- CAMBIO: useEffect ahora solo filtra (no carga datos) ---
  useEffect(() => {
    const filtered = inquiries.filter((inquiry) => {
      const matchesSearch = inquiry.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredInquiries(filtered);
  }, [searchTerm, filterStatus, inquiries]); // Reacciona si los props de 'inquiries' cambian

  // --- CAMBIO: Usar 'router' de Inertia para eliminar ---
  const handleDelete = () => {
    if (deleteInquiryId) {
      setIsDeleting(true); // Inicia el estado de carga
      router.delete(route('admin.inquiries.destroy', deleteInquiryId), {
        preserveScroll: true,
        onSuccess: () => {
          toast({ title: "Indagación eliminada", description: "La indagación ha sido eliminada exitosamente." });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo eliminar la indagación.",
            variant: "destructive",
          });
        },
        onFinish: () => {
          setDeleteInquiryId(null);
          setIsDeleting(false); // Finaliza el estado de carga
        }
      });
    }
  };

  return (
    // Asume un AdminLayout que recibe el 'header'
    <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin: Indagaciones</h2>}>
      <Head title="Admin: Indagaciones" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestor de Indagaciones</CardTitle>
                  <CardDescription>Crea, edita y administra las indagaciones guiadas.</CardDescription>
                </div>
                {/* --- CAMBIO: Usar <Link> de Inertia en lugar de navigate() --- */}
                <Button asChild>
                  <Link href={route('admin.inquiries.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Nueva
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por título..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredInquiries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No se encontraron indagaciones.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Área/Tema</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">{inquiry.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {inquiry.area?.nombre || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={inquiry.status === 'published' ? 'default' : 'outline'}>
                            {inquiry.status === 'published' ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* --- CAMBIO: Usar <Link> de Inertia --- */}
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={route('admin.inquiries.edit', inquiry.id)}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteInquiryId(inquiry.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!deleteInquiryId} onOpenChange={() => setDeleteInquiryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la indagación y todos sus pasos y opciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {/* --- CAMBIO: El botón de acción llama a handleDelete --- */}
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
};

export default AdminInquiriesIndex;