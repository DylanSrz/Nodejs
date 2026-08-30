import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createTypeIdentificationSchema = z.object({

    name: z
        .string('name debe ser una cadena.')
        .min(3, 'name debe tener al menos 3 caracteres.')
        .max(255, 'name no puede superar los 255 caracteres.'),

    // Abreviatura del documento: cc, ti, ce, pa, ppt.
    // La columna admite null, así que aquí es opcional.
    code_name: z
        .string('code_name debe ser una cadena.')
        .min(2, 'code_name debe tener al menos 2 caracteres.')
        .max(255, 'code_name no puede superar los 255 caracteres.')
        .optional(),
});


export const updateTypeIdentificationSchema = toUpdateSchema(
    createTypeIdentificationSchema
);
