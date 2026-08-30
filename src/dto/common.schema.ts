import z from "zod";


// ======================================================
// ESQUEMAS COMPARTIDOS
// ======================================================
//
// Piezas que se repiten en todas las entidades: el uuid del
// parámetro :id, los formatos de fecha y hora, y el ayudante
// que arma los esquemas de actualización.
//
// ======================================================


// Parámetro ":id" de las rutas /:id
export const idParamSchema = z.object({
    id: z.uuid('El parámetro id debe ser un uuid válido.'),
});


// Parámetros de la tabla puente coder_clan, que no tiene un
// id propio sino una clave compuesta.
export const coderClanParamsSchema = z.object({
    clan_id: z.uuid('El parámetro clan_id debe ser un uuid válido.'),
    coder_id: z.uuid('El parámetro coder_id debe ser un uuid válido.'),
});


// Fecha en formato YYYY-MM-DD, que es lo que espera el tipo
// DATEONLY de Sequelize.
export const dateOnly = (field: string) =>
    z
        .string(`${field} debe ser una cadena.`)
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            `${field} debe tener el formato YYYY-MM-DD.`
        );


// Hora en formato HH:MM:SS, que es lo que espera el tipo TIME.
export const timeOnly = (field: string) =>
    z
        .string(`${field} debe ser una cadena.`)
        .regex(
            /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
            `${field} debe tener el formato HH:MM:SS.`
        );


// ======================================================
// ESQUEMA DE ACTUALIZACIÓN
// ======================================================
//
// En un PUT no queremos exigir todos los campos: basta con
// los que se van a modificar.
//
// Este ayudante toma el esquema de creación, vuelve
// opcionales todos sus campos y añade una regla extra: el
// cuerpo no puede venir vacío, porque un PUT sin datos no
// tiene nada que actualizar.
//
export const toUpdateSchema = <T extends z.ZodObject<z.ZodRawShape>>(schema: T) =>
    schema
        .partial()
        .refine(
            (data) => Object.keys(data).length > 0,
            'Debe enviar al menos un campo para actualizar.'
        );
