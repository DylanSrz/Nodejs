import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createCitySchema = z.object({

    name: z
        .string('name debe ser una cadena.')
        .min(3, 'name debe tener al menos 3 caracteres.')
        .max(255, 'name no puede superar los 255 caracteres.'),

    // Código corto de la ciudad, por ejemplo "mde".
    // La columna es única.
    code_name: z
        .string('code_name debe ser una cadena.')
        .min(2, 'code_name debe tener al menos 2 caracteres.')
        .max(255, 'code_name no puede superar los 255 caracteres.'),
});


export const updateCitySchema = toUpdateSchema(createCitySchema);
