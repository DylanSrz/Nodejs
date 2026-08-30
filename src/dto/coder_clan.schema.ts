import z from "zod";
import { dateOnly } from "./common.schema.js";


// ======================================================
// ASIGNACIÓN DE UN CODER A UN CLAN
// ======================================================
//
// coder_clan es la tabla puente entre user y clan.
//
// No tiene id propio: su identidad es la pareja
// (clan_id, coder_id).
//
export const createCoderClanSchema = z
    .object({

        clan_id: z
            .uuid('clan_id debe ser un uuid válido.'),

        // Debe ser un usuario con rol "coder".
        coder_id: z
            .uuid('coder_id debe ser un uuid válido.'),

        start_date: dateOnly('start_date'),

        // Null mientras el coder siga activo en el clan.
        end_date: dateOnly('end_date').nullable().optional(),
    })
    .refine(
        (data) =>
            !data.end_date || data.start_date <= data.end_date,
        {
            message: 'end_date no puede ser anterior a start_date.',
            path: ['end_date'],
        }
    );


// En la actualización el clan y el coder no cambian: eso
// sería otra asignación distinta. Solo se ajustan las fechas.
export const updateCoderClanSchema = z
    .object({

        start_date: dateOnly('start_date').optional(),

        end_date: dateOnly('end_date').nullable().optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        'Debe enviar al menos un campo para actualizar.'
    )
    .refine(
        (data) =>
            !data.start_date ||
            !data.end_date ||
            data.start_date <= data.end_date,
        {
            message: 'end_date no puede ser anterior a start_date.',
            path: ['end_date'],
        }
    );
