import z from "zod";

export const createClanSchema = z.object({
    name: z.string('name must be string').min(3, 'name must be have more 3 characters'),
    sala: z.number('tiene que ser un numero entero.'),
    jornada: z.string('solo se permite "am" o "pm"').min(2).max(2),
    ruta: z.string('solo se permite el ID de la ruta "string".')
});