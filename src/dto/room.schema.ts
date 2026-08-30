import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createRoomSchema = z.object({

    name: z
        .string('name debe ser una cadena.')
        .min(1, 'name es obligatorio.')
        .max(255, 'name no puede superar los 255 caracteres.'),

    // El modelo Room exige capacidad mínima de 1.
    capacity: z
        .number('capacity debe ser un número.')
        .int('capacity debe ser un número entero.')
        .min(1, 'capacity debe ser al menos 1.'),

    campus_id: z
        .uuid('campus_id debe ser un uuid válido.'),
});


export const updateRoomSchema = toUpdateSchema(createRoomSchema);
