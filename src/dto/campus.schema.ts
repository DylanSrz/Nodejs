import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createCampusSchema = z.object({

    // La columna es única: no puede haber dos sedes con el
    // mismo nombre.
    name: z
        .string('name debe ser una cadena.')
        .min(3, 'name debe tener al menos 3 caracteres.')
        .max(255, 'name no puede superar los 255 caracteres.'),

    city_id: z
        .uuid('city_id debe ser un uuid válido.'),

    address: z
        .string('address debe ser una cadena.')
        .min(5, 'address debe tener al menos 5 caracteres.')
        .max(255, 'address no puede superar los 255 caracteres.'),
});


export const updateCampusSchema = toUpdateSchema(createCampusSchema);
