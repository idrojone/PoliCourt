import { z } from "zod";
/**
 * Schema de validación específico para RENTAL.
 * No incluye title, description ni type.
 */
export const rentalSchema = z
  .object({
    courtSlug: z.string().min(1, "Debe seleccionar una pista"),
    organizerUsername: z.string().min(1, "Debe seleccionar un usuario"),
    startTime: z.string().min(1, "La fecha de inicio es requerida"),
    endTime: z.string().min(1, "La fecha de fin es requerida"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const now = new Date();
      return start >= now;
    },
    {
      message: "La fecha de inicio no puede ser en el pasado",
      path: ["startTime"],
    },
  );
