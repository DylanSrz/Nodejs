import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


// Las rutas que carga el seeder 005-type_route.seed.ts.
//
// El modelo Type_route valida exactamente estos mismos
// valores con isIn.
export const createTypeRouteSchema = z.object({

    name: z.enum(
        ['ruta básica', 'ruta avanzada'],
        'name debe ser "ruta básica" o "ruta avanzada".'
    ),
});


export const updateTypeRouteSchema = toUpdateSchema(createTypeRouteSchema);
