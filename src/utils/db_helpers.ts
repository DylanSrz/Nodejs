import type { Model, ModelStatic, WhereOptions } from "sequelize";
import { conflict, notFound } from "./http_error.js";


// ======================================================
// BUSCAR POR ID O FALLAR
// ======================================================
//
// Evita repetir en cada controlador el bloque:
//
//   const registro = await Modelo.findByPk(id)
//   if (!registro) {
//       return res.status(404).json({ message: '...' })
//   }
//
// Si no encuentra el registro lanza un HttpError 404 que
// el manejador global convierte en respuesta.
//
export async function findByPkOrFail<M extends Model>(
    model: ModelStatic<M>,
    id: string,
    label: string
): Promise<M> {

    const record = await model.findByPk(id);

    if (!record) {
        throw notFound(`${label} no encontrado.`);
    }

    return record;
}


// Descripción de una tabla que podría estar apuntando al
// registro que se quiere borrar.
interface DependencyCheck {

    // Modelo de la tabla dependiente.
    model: ModelStatic<Model>;

    // Condición que identifica a los dependientes,
    // por ejemplo: { city_id: id }
    where: WhereOptions;

    // Nombre legible que se muestra en el mensaje de error.
    label: string;
}


// ======================================================
// VERIFICAR QUE NO QUEDEN DEPENDENCIAS
// ======================================================
//
// Casi todas las tablas del proyecto son referenciadas por
// otras. Si borramos un registro que todavía está en uso,
// PostgreSQL responde con un error de llave foránea que se
// traduciría en un 500 poco informativo.
//
// Esta función se adelanta a ese caso: cuenta los registros
// dependientes y, si existen, lanza un 409 explicando
// exactamente qué está bloqueando el borrado.
//
// Ejemplo:
//
//   await ensureNoDependencies('La ciudad', [
//       { model: Address_user, where: { city_id: id }, label: 'direcciones' },
//       { model: Campus,       where: { city_id: id }, label: 'sedes' },
//   ])
//
// Respuesta si hay dependencias:
//
//   409
//   {
//     "message": "La ciudad no se puede eliminar porque tiene registros asociados.",
//     "details": [{ "label": "sedes", "count": 2 }]
//   }
//
export async function ensureNoDependencies(
    subject: string,
    checks: DependencyCheck[]
): Promise<void> {

    const blockers: Array<{ label: string; count: number }> = [];

    for (const check of checks) {

        const count = await check.model.count({ where: check.where });

        if (count > 0) {
            blockers.push({ label: check.label, count });
        }
    }

    if (blockers.length > 0) {

        throw conflict(
            `${subject} no se puede eliminar porque tiene registros asociados.`,
            blockers
        );
    }
}


// ======================================================
// VERIFICAR QUE UN VALOR ÚNICO ESTÉ LIBRE
// ======================================================
//
// Se usa antes de crear o actualizar, para devolver un 409
// con un mensaje propio en lugar de dejar que estalle la
// restricción UNIQUE de PostgreSQL.
//
// "excludeId" permite ignorar el propio registro cuando la
// verificación ocurre durante una actualización.
//
export async function ensureUniqueValue<M extends Model>(
    model: ModelStatic<M>,
    where: WhereOptions,
    message: string
): Promise<void> {

    const existing = await model.findOne({ where });

    if (existing) {
        throw conflict(message);
    }
}
