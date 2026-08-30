import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createAddressUserSchema = z.object({

    city_id: z
        .uuid('city_id debe ser un uuid válido.'),

    address: z
        .string('address debe ser una cadena.')
        .min(5, 'address debe tener al menos 5 caracteres.')
        .max(255, 'address no puede superar los 255 caracteres.'),
});


export const updateAddressUserSchema = toUpdateSchema(createAddressUserSchema);
