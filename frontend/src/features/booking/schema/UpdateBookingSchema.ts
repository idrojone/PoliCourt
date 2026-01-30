import { z } from "zod";

/**
 * Schema de validación para actualizar CLASS o TRAINING.
 * Permite modificar título, descripción, startTime, endTime y attendeePrice.
 */
export const updateBookingSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    startTime: z.string().min(1, "La fecha de inicio es requerida"),
    endTime: z.string().min(1, "La fecha de fin es requerida"),
    attendeePrice: z.coerce.number().min(0, "El precio no puede ser negativo").optional(),
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
    }
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
    }
  );

export type UpdateBookingFormValues = z.infer<typeof updateBookingSchema>;
