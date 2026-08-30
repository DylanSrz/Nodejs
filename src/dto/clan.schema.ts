import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


export const createClanSchema = z.object({

    // La columna es única.
    name: z
        .string('name debe ser una cadena.')
        .min(3, 'name debe tener al menos 3 caracteres.')
        .max(255, 'name no puede superar los 255 caracteres.'),

    schedule_id: z
        .uuid('schedule_id debe ser un uuid válido.'),

    type_route_id: z
        .uuid('type_route_id debe ser un uuid válido.'),

    room_id: z
        .uuid('room_id debe ser un uuid válido.'),

    // Debe ser un usuario con rol "team leader".
    // La columna es única: un team leader por clan.
    tl_id: z
        .uuid('tl_id debe ser un uuid válido.'),
});


export const updateClanSchema = toUpdateSchema(createClanSchema);
