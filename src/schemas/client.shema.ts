import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  lastName: z
    .string()
    .min(0, "Apellido es requerido")
    .max(100, "El apellido no puede exceder los 100 caracteres"),
  email: z
    .string()
    .email()
    .min(1, "El email es requerido")
    .max(500, "El email no puede exceder 500 caracteres"),
});