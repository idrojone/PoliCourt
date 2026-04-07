import { useClasessesQuery } from "@/features/bookings/queries/UseClassesQuery";
import { DashboardLayout } from "@/layout/dashboard";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import CreateClassDialog from "@/features/bookings/components/CreateClassDialog";
import ClassItem from "@/features/bookings/components/ClassItem";

export const DashboardMonitor = () => {

  const { user, isInitializing } = useAuth();
  const username = user?.username;
  const clases = useClasessesQuery({ username });
  const [createOpen, setCreateOpen] = useState(false);

  console.log(clases.data);
  console.log(username);

  if (isInitializing) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar para pantallas md+ */}
      <aside className="hidden md:block w-64 shrink-0 border-r p-4">
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
            <Home className="h-4 w-4" />
            <span>Ir al Inicio</span>
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Link de regreso visible solo en móviles */}
          <div className="md:hidden mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
              <Home className="h-4 w-4" />
              <span>Ir al Inicio</span>
            </Link>
          </div>

          <DashboardLayout
            title="Dashboard de Monitores"
            actionLabel="Nueva Clase"
            onAction={() => setCreateOpen(true)}>
            <p className="text-sm text-muted-foreground">
              Aquí encontrarás tus clases y métricas.
            </p>
          </DashboardLayout>
          <CreateClassDialog open={createOpen} onOpenChange={setCreateOpen} />
          <div className="mt-6">
            {clases.data?.content?.length ? (
              clases.data.content.map((c: any) => (
                <ClassItem key={c.uuid} item={c} />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No hay clases creadas.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
