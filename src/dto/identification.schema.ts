import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createIdentificationSchema = z.object({

    type_identification_id: z
        .uuid('type_identification_id debe ser un uuid válido.'),

    // La columna es varchar(20) y única.
    number: z
        .string('number debe ser una cadena.')
        .min(5, 'number debe tener al menos 5 caracteres.')
        .max(20, 'number no puede superar los 20 caracteres.')
        .regex(/^[0-9a-zA-Z-]+$/, 'number solo admite letras, números y guiones.'),
});


export const updateIdentificationSchema = toUpdateSchema(
    createIdentificationSchema
);
