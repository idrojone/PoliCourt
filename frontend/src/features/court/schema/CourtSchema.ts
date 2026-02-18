import { z } from "zod";
import { CourtSurface } from "@/features/types/court/Court";

export const courtSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    locationDetails: z.string().min(3, "La ubicación debe tener al menos 3 caracteres").optional().or(z.literal("")),
    imgUrl: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
            (val) => {
                if (!val) return true;
                try {
                    const u = new URL(val);
                    return u.protocol === "http:" || u.protocol === "https:";
                } catch {
                    return true; // Allow local paths or invalid URLs if that's the pattern
                }
            },
            {
                message:
                    "Debe ser una URL válida",
            }
        ),
    priceH: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
    capacity: z.coerce.number().int().min(1, "La capacidad debe ser al menos 1"),
    isIndoor: z.boolean().default(false),
    surface: z.enum([
        CourtSurface.HARD,
        CourtSurface.CLAY,
        CourtSurface.GRASS,
        CourtSurface.SYNTHETIC,
        CourtSurface.WOOD,
        CourtSurface.OTHER,
    ]),
    sportSlugs: z.array(z.string()).optional(),
});
