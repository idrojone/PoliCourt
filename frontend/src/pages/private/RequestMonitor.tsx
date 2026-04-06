import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/layout/dashboard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getToken } from "@/lib/token";

const SERVER_BASE_URL = "http://localhost:4002";

const getUploadUrl = (path: string) => {
  const normalized = path.replace(/\\/g, "/");
  if (normalized.startsWith("http")) return normalized;
  // If the backend returned an absolute filesystem path, try to extract the uploads folder path
  const uploadsIndex = normalized.toLowerCase().indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    const relative = normalized.slice(uploadsIndex + 1); // remove leading '/'
    return `${SERVER_BASE_URL}/${relative}`;
  }

  return `${SERVER_BASE_URL}/${normalized}`;
};

type MonitorApplication = {
  email: string;
  description: string;
  documents: string[];
  status: "pending" | "approved" | "rejected" | string;
  uuid: string;
  createdAt: string;
};

export const RequestMonitorDashboard = () => {
  const [applications, setApplications] = useState<MonitorApplication[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró token. Por favor inicia sesión como administrador.");
      }

      const response = await axios.get("http://localhost:4002/monitor/all-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        params: {
          // if filteredStatus is 'all' don't send the param
          status: filteredStatus === "all" ? undefined : filteredStatus,
        },
      });

      // El endpoint puede devolver varias formas, por ejemplo:
      // []
      // { data: [] }
      // { applications: [] }
      // { status: 'success', data: { items: [], pagination: { total } } }
      const payload = response.data;
      let apps: MonitorApplication[] = [];
      let total: number | null = null;
      if (Array.isArray(payload)) {
        apps = payload;
      } else if (Array.isArray(payload?.data)) {
        apps = payload.data;
      } else if (Array.isArray(payload?.data?.items)) {
        apps = payload.data.items;
        total = typeof payload.data?.pagination?.total === 'number' ? payload.data.pagination.total : null;
      } else if (Array.isArray(payload?.applications)) {
        apps = payload.applications;
      } else if (Array.isArray(payload?.rows)) {
        apps = payload.rows;
      } else {
        apps = [];
      }
      setApplications(apps);
      setTotalCount(total);
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("No autorizado. Inicia sesión como admin para ver las solicitudes.");
      } else {
        setError("Error cargando solicitudes. Intenta nuevamente.");
      }
      toast.error(error || "Error al obtener las solicitudes.");
    } finally {
      setIsLoading(false);
    }
  };

  const changeStatus = async (uuid: string, status: "approved" | "rejected") => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No se encontró token. Por favor inicia sesión como administrador.");
      }

      await axios.post(
        "http://localhost:4002/monitor/change-status",
        { uuid, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(`Solicitud ${uuid} actualizada a '${status}'.`);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error("No autorizado. Inicia sesión como admin.");
      } else {
        toast.error("No se pudo actualizar el estado. Intenta nuevamente.");
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filteredStatus]);

  return (
    <DashboardLayout
      title="Solicitudes de monitores"
      actionLabel="Refrescar"
      onAction={fetchApplications}
    >      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium">Filtrar por estado:</span>
        <Select
          value={filteredStatus}
          onValueChange={(value) => setFilteredStatus(value as "all" | "pending" | "approved" | "rejected")}
        >
          <SelectTrigger size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">pending</SelectItem>
            <SelectItem value="approved">approved</SelectItem>
            <SelectItem value="rejected">rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>      {isLoading ? (
        <div className="p-6">Cargando solicitudes...</div>
      ) : error ? (
        <div className="p-6 text-red-500">{error}</div>
      ) : applications.length === 0 ? (
        <div className="p-6">No hay solicitudes por el momento.</div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableCaption>
              Mostrando {applications.length}{totalCount ? ` de ${totalCount}` : ""} solicitudes
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.uuid}>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.description}</TableCell>
                  <TableCell>
                    {app.documents.map((doc) => (
                      <div key={doc}>
                        <a
                          className="text-blue-600 hover:underline"
                          href={getUploadUrl(doc)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver documento
                        </a>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={app.status === "approved" ? "secondary" : app.status === "pending" ? "default" : "destructive"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(app.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={app.status}
                      onValueChange={(value) => {
                        const validValue = value as "pending" | "approved" | "rejected";
                        changeStatus(app.uuid, validValue);
                      }}
                    >
                      <SelectTrigger size="sm" className="w-36">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">pending</SelectItem>
                        <SelectItem value="approved">approved</SelectItem>
                        <SelectItem value="rejected">rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
};