import { z } from "zod";

const CourtSurfaceEnum = z.enum([
    "HARD",
    "CLAY",
    "GRASS",
    "SYNTHETIC",
    "WOOD",
    "OTHER",
]);

export const courtSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    locationDetails: z
        .string()
        .min(5, "La ubicación debe tener al menos 5 caracteres"),
    imgUrl: z
        .string()
        .url("Debe ser una URL válida")
        .or(z.literal(""))
        .or(z.string().startsWith("/src/assets/"))
        .or(z.string().startsWith("/assets/")),
    priceH: z.coerce
        .number()
        .min(0, "El precio no puede ser negativo")
        .positive("El precio debe ser un número positivo"),
    capacity: z.coerce
        .number()
        .int()
        .min(0, "La capacidad no puede ser negativa"),
    isIndoor: z.boolean().default(false),
    surface: CourtSurfaceEnum,
    sportSlugs: z
        .array(z.string())
        .min(1, "Debe seleccionar al menos un deporte para la pista"),
});
