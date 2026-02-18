import { z } from "zod";

export const clubSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().optional(),
    imgUrl: z.string().optional(),
    sportSlug: z.string().optional(),
});

export type ClubFormValues = z.infer<typeof clubSchema>;
