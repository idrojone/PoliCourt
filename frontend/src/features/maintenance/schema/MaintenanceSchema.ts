import { z } from "zod";

export const maintenanceSchema = z.object({
  courtSlug: z.string().min(1, "Debes seleccionar una pista"),
  createdByUsername: z.string().min(1, "Debes seleccionar un usuario"),
  title: z.string().min(1, "El título es obligatorio").max(150, "El título no puede exceder 150 caracteres"),
  description: z.string().optional(),
  startTime: z.string().min(1, "La fecha de inicio es obligatoria"),
  endTime: z.string().min(1, "La fecha de fin es obligatoria"),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endTime"],
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
