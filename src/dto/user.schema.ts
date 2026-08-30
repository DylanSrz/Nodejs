import z from "zod";
import { dateOnly, toUpdateSchema } from "./common.schema.js";


// ======================================================
// CREACIÓN DE USUARIO
// ======================================================
//
// El cuerpo de POST /user no corresponde a una sola tabla:
// con estos campos el controlador crea tres registros en una
// misma transacción.
//
//   city_id, address
//        -> address_user
//
//   type_identification_id, identification_number
//        -> identification
//
//   el resto
//        -> user
//
export const createUserSchema = z.object({

    first_name: z
        .string('first_name debe ser una cadena.')
        .min(3, 'first_name debe tener al menos 3 caracteres.')
        .max(255, 'first_name no puede superar los 255 caracteres.'),

    last_name: z
        .string('last_name debe ser una cadena.')
        .min(3, 'last_name debe tener al menos 3 caracteres.')
        .max(255, 'last_name no puede superar los 255 caracteres.'),

    // El modelo User valida isEmail, así que aquí exigimos
    // el mismo formato en lugar de una longitud mínima.
    email: z
        .email('email debe ser un correo electrónico válido.'),

    // Llega en claro y se guarda hasheada con bcrypt en la
    // columna password_hash.
    password: z
        .string('password debe ser una cadena.')
        .min(8, 'password debe tener al menos 8 caracteres.')
        .max(72, 'password no puede superar los 72 caracteres.'),

    // La columna es varchar(20).
    phone: z
        .string('phone debe ser una cadena.')
        .min(7, 'phone debe tener al menos 7 caracteres.')
        .max(20, 'phone no puede superar los 20 caracteres.')
        .regex(/^[0-9+\s-]+$/, 'phone solo admite números, espacios, + y -.'),

    birth_date: dateOnly('birth_date'),

    // --- datos que van a address_user ---

    city_id: z
        .uuid('city_id debe ser un uuid válido.'),

    address: z
        .string('address debe ser una cadena.')
        .min(5, 'address debe tener al menos 5 caracteres.')
        .max(255, 'address no puede superar los 255 caracteres.'),

    // --- datos que van a identification ---

    type_identification_id: z
        .uuid('type_identification_id debe ser un uuid válido.'),

    identification_number: z
        .string('identification_number debe ser una cadena.')
        .min(5, 'identification_number debe tener al menos 5 caracteres.')
        .max(20, 'identification_number no puede superar los 20 caracteres.'),

    // --- rol ---

    role_id: z
        .uuid('role_id debe ser un uuid válido.'),
});


// ======================================================
// ACTUALIZACIÓN DE USUARIO
// ======================================================
//
// Solo cubre las columnas de la tabla "user".
//
// La dirección y la identificación tienen sus propios
// endpoints (/address_user y /identification), porque son
// tablas independientes con su propio ciclo de vida.
//
export const updateUserSchema = toUpdateSchema(
    z.object({

        first_name: z
            .string('first_name debe ser una cadena.')
            .min(3, 'first_name debe tener al menos 3 caracteres.')
            .max(255, 'first_name no puede superar los 255 caracteres.'),

        last_name: z
            .string('last_name debe ser una cadena.')
            .min(3, 'last_name debe tener al menos 3 caracteres.')
            .max(255, 'last_name no puede superar los 255 caracteres.'),

        email: z
            .email('email debe ser un correo electrónico válido.'),

        // Si viene, el modelo la vuelve a hashear en su hook
        // beforeUpdate.
        password: z
            .string('password debe ser una cadena.')
            .min(8, 'password debe tener al menos 8 caracteres.')
            .max(72, 'password no puede superar los 72 caracteres.'),

        phone: z
            .string('phone debe ser una cadena.')
            .min(7, 'phone debe tener al menos 7 caracteres.')
            .max(20, 'phone no puede superar los 20 caracteres.')
            .regex(/^[0-9+\s-]+$/, 'phone solo admite números, espacios, + y -.'),

        birth_date: dateOnly('birth_date'),

        role_id: z
            .uuid('role_id debe ser un uuid válido.'),

        is_active: z
            .boolean('is_active debe ser true o false.'),
    })
);
