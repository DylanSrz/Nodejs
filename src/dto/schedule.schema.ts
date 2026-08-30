import z from "zod";
import { timeOnly, toUpdateSchema } from "./common.schema.js";


export const createScheduleSchema = z
    .object({

        // El modelo Schedule solo admite estas dos jornadas.
        name: z.enum(['am', 'pm'], 'name debe ser am o pm.'),

        start_time: timeOnly('start_time'),

        end_time: timeOnly('end_time'),
    })
    // Una jornada que termina antes de empezar no tiene sentido.
    .refine(
        (data) => data.start_time < data.end_time,
        {
            message: 'start_time debe ser anterior a end_time.',
            path: ['end_time'],
        }
    );


// El esquema de creación lleva un refine, así que para el
// update partimos de la forma base sin esa regla cruzada:
// en un PUT puede llegar una sola de las dos horas.
export const updateScheduleSchema = toUpdateSchema(
    z.object({
        name: z.enum(['am', 'pm'], 'name debe ser am o pm.'),
        start_time: timeOnly('start_time'),
        end_time: timeOnly('end_time'),
    })
);
