import type { Request, Response } from "express";
import User from "../models/user.model.js";
import Address_user from "../models/address_user.model.js";
import Identification from "../models/identification.model.js";
import Type_identification from "../models/type_identification.model.js";
import Cities from "../models/cities.model.js";
import Roles from "../models/role.model.js";
import Clan from "../models/clan.model.js";
import db from "../config/db.js";
import {
    ensureUniqueValue,
    findByPkOrFail,
} from "../utils/db_helpers.js";
import { conflict } from "../utils/http_error.js";


// ======================================================
// LECTURA SEGURA
// ======================================================
//
// La columna password_hash nunca debe salir en una
// respuesta, así que la excluimos en todas las consultas.
//
const safeAttributes = {
    exclude: ['password_hash'],
};


// Relaciones que acompañan a un usuario: su rol, su
// dirección con la ciudad, y su identificación con el tipo
// de documento.
const includeUser = [
    {
        model: Roles,
        as: 'role',
    },
    {
        model: Address_user,
        as: 'address_user',
        include: [{ model: Cities, as: 'city' }],
    },
    {
        model: Identification,
        as: 'identification',
        include: [{ model: Type_identification, as: 'type_identification' }],
    },
];


// Quita password_hash de una instancia recién creada, que
// todavía conserva el valor en memoria.
const toSafeUser = (user: User) => {

    const data = user.toJSON() as Record<string, unknown>;

    delete data.password_hash;

    return data;
};


// listamos todos los usuarios.
const getUser = async (req: Request, res: Response) => {

    const users = await User.findAll({
        attributes: safeAttributes,
        include: includeUser,
        order: [['first_name', 'ASC']],
    });

    res.status(200).json({ message: 'Usuarios encontrados.', users });
};


// consultamos un usuario por su id.
const getUserById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const user = await User.findByPk(id, {
        attributes: safeAttributes,
        include: includeUser,
    });

    if (!user) {
        return res.status(404).json({ message: 'El usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario encontrado.', user });
};


// ======================================================
// CREAR USUARIO
// ======================================================
//
// Un usuario necesita tres registros en tres tablas, así
// que todo ocurre dentro de una transacción: si cualquiera
// de los tres inserts falla, no queda nada a medias.
//
//   address_user   <- city_id, address
//   identification <- type_identification_id, number
//   user           <- el resto + las dos llaves anteriores
//
const createUser = async (req: Request, res: Response) => {

    const {
        first_name,
        last_name,
        email,
        password,
        phone,
        birth_date,
        city_id,
        address,
        type_identification_id,
        identification_number,
        role_id
    } = req.body


    // Comprobamos las llaves foráneas antes de abrir la
    // transacción, para devolver un 404 claro en lugar de un
    // error de PostgreSQL.
    await findByPkOrFail(Cities, city_id, 'La ciudad');
    await findByPkOrFail(
        Type_identification,
        type_identification_id,
        'El tipo de identificación'
    );
    await findByPkOrFail(Roles, role_id, 'El rol');


    // El modelo pasa el correo a minúsculas antes de
    // guardarlo, así que buscamos duplicados con el mismo
    // criterio.
    await ensureUniqueValue(
        User,
        { email: String(email).toLowerCase() },
        'El correo electrónico ya está registrado.'
    );

    await ensureUniqueValue(
        Identification,
        { number: identification_number },
        'El número de identificación ya existe.'
    );


    const transaction = await db.transaction()

    try {

        const newAddress = await Address_user.create(
            {
                city_id,
                address
            },
            {transaction}
        )

        const newIdentification = await Identification.create(
            {
                type_identification_id,
                number: identification_number
            },
            {transaction}
        )

        const newUser = await User.create(
            {
                first_name,
                last_name,
                email,
                // El hook beforeCreate del modelo la hashea.
                password_hash: password,
                phone,
                birth_date,
                address_user_id: newAddress.id,
                identification_id: newIdentification.id,
                role_id
            },
            {transaction}
        )

        await transaction.commit()

        res.status(201).json({
            message: 'Usuario creado con exito',
            newUser: toSafeUser(newUser),
        })

    } catch(error) {

        await transaction.rollback();

        // Se relanza para que el manejador global lo traduzca
        // a una respuesta. Antes este bloque terminaba sin
        // responder cuando el error no era de unicidad, y la
        // petición quedaba abierta hasta agotar el tiempo.
        throw error;
    }
}


// ======================================================
// ACTUALIZAR USUARIO
// ======================================================
//
// Solo toca las columnas de la tabla "user". La dirección y
// la identificación se editan por sus propios endpoints.
//
const updateUser = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const user = await findByPkOrFail(User, id, 'El usuario');

    const { email, password, role_id } = req.body;

    if (role_id) {
        await findByPkOrFail(Roles, role_id, 'El rol');
    }

    if (email) {

        const normalized = String(email).toLowerCase();

        if (normalized !== user.email) {
            await ensureUniqueValue(
                User,
                { email: normalized },
                'El correo electrónico ya está registrado.'
            );
        }
    }

    // La contraseña viaja en "password" pero la columna se
    // llama password_hash. El hook beforeUpdate del modelo
    // se encarga de hashearla.
    const changes: Record<string, unknown> = { ...req.body };

    if (password) {
        changes.password_hash = password;
    }

    delete changes.password;

    await user.update(changes);

    res.status(200).json({
        message: 'Usuario actualizado con éxito.',
        user: toSafeUser(user),
    });
};


// ======================================================
// CAMBIAR EL ESTADO
// ======================================================
//
// Invierte is_active. Sirve tanto para desactivar como para
// reactivar a un usuario.
//
const updateStatus = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const user = await findByPkOrFail(User, id, 'El usuario');

    await user.update({ is_active: !user.is_active });

    res.status(200).json({
        message: `User status updated to ${user.is_active}`,
        user: toSafeUser(user),
    });
};


// ======================================================
// ELIMINAR USUARIO (BORRADO LÓGICO)
// ======================================================
//
// No se borra la fila: se marca is_active en false.
//
// Un usuario está referenciado por clan.tl_id y por
// coder_clan.coder_id; borrarlo de verdad destruiría el
// historial de esos clanes.
//
// Un usuario inactivo tampoco puede iniciar sesión, así que
// el efecto práctico es el de una baja.
//
const deleteUser = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const user = await findByPkOrFail(User, id, 'El usuario');

    if (!user.is_active) {
        throw conflict('El usuario ya se encuentra inactivo.');
    }

    // Un team leader con clan a cargo no puede darse de baja
    // sin reasignar antes ese clan.
    const leadingClans = await Clan.count({ where: { tl_id: id } });

    if (leadingClans > 0) {
        throw conflict(
            'El usuario no se puede desactivar porque es team leader de un clan. ' +
            'Asigna otro team leader antes de continuar.'
        );
    }

    await user.update({ is_active: false });

    res.status(200).json({
        message: 'Usuario desactivado con éxito.',
        user: toSafeUser(user),
    });
};


export {
    getUser,
    getUserById,
    createUser,
    updateUser,
    updateStatus,
    deleteUser,
};
