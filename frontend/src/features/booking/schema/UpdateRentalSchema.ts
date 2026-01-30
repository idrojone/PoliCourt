import { z } from "zod";

/**
 * Schema de validación para actualizar RENTAL.
 * Solo permite modificar startTime y endTime.
 */
export const updateRentalSchema = z
  .object({
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

export type UpdateRentalFormValues = z.infer<typeof updateRentalSchema>;
