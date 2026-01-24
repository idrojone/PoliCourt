import { z } from "zod";

export const sportSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().default(""),
  imgUrl: z
    .string()
    .default("")
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const u = new URL(val);
          return u.protocol === "http:" || u.protocol === "https:";
        } catch {
          return /^\/?src\/assets\/.+/.test(val) || /^\/?assets\/.+/.test(val);
        }
      },
      {
        message:
          "Debe ser una URL válida (https://...) o un path local en /src/assets/...",
      },
    ),
});
