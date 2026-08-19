import z from "zod";

export const createTlSchema = z.object({
    name: z.string('name must be string').min(3, 'name must be have more 3 characters'),
    email: z.string().min(6),
    jornada: z.string().min(2).max(2)
});