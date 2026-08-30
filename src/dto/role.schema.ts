import z from "zod";
import { toUpdateSchema } from "./common.schema.js";


// Los tres roles son los mismos que valida el modelo Roles
// con isIn, y los que carga el seeder 001-role.seed.ts.
export const createRoleSchema = z.object({

    name: z.enum(
        ['admin', 'team leader', 'coder'],
        'name debe ser admin, team leader o coder.'
    ),
});


export const updateRoleSchema = toUpdateSchema(createRoleSchema);
