import { z } from "zod";

export const productSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  precio: z
    .number()
    .min(0, "El precio no puede ser negativo")
    .max(1000000, "El precio es demasiado alto"),
  detalle: z
    .string()
    .min(1, "El detalle es requerido")
    .max(500, "El detalle no puede exceder 500 caracteres"),
});

export type ProductFormValues = z.infer<typeof productSchema>;