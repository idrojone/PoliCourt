import React from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MonitorApplication } from "@/features/monitor/service/monitor.service";
import { getUploadUrl } from "@/features/monitor/service/monitor.service";

type Props = {
  applications: MonitorApplication[];
  totalCount: number | null;
  onChangeStatus: (uuid: string, status: "approved" | "rejected") => void;
};

export const MonitorTable: React.FC<Props> = ({ applications, totalCount, onChangeStatus }) => {
  return (
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
                    <a className="text-blue-600 hover:underline" href={getUploadUrl(doc)} target="_blank" rel="noreferrer">
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
                <Select defaultValue={app.status} onValueChange={(value) => onChangeStatus(app.uuid, value as any)}>
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
  );
};

export default MonitorTable;
