import z from "zod";

export const createBookSchema = z.object({
    name: z.string('name must be string').min(3, 'name must be have more 3 characters'),
    author: z.string().min(3)
});