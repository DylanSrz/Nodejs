import z from "zod";

export const createRutaSchema = z.object({
    name: z.string('name must be string').min(3, 'name must be have more 3 characters'),
    dificultad: z.string().min(5).max(7),
    tl: z.string().min(2).max(2)
});