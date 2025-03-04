import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.number().min(1, "Debe seleccionar un producto"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
});

export const saleSchema = z.object({
  clientId: z.number().min(1, "Debe seleccionar un cliente"),
  items: z.array(saleItemSchema).min(1, "Debe agregar al menos un producto"),
  total: z.number().optional(),
});