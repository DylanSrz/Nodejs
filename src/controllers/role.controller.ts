import type { Request, Response } from "express";
import Roles from "../models/role.model.js";
import User from "../models/user.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// Los errores que se lancen aquí los recoge Express 5 y los
// entrega al middleware errorHandler, que arma la respuesta.


// listamos todos los roles.
const getRoles = async (req: Request, res: Response) => {

    const roles = await Roles.findAll({ order: [['name', 'ASC']] });

    res.status(200).json({ message: 'Roles encontrados.', roles });
};


// consultamos un rol por su id.
const getRoleById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const role = await findByPkOrFail(Roles, id, 'El rol');

    res.status(200).json({ message: 'Rol encontrado.', role });
};


// creamos un rol.
const createRole = async (req: Request, res: Response) => {

    const newRole = await Roles.create(req.body);

    res.status(201).json({ message: 'Rol creado con éxito.', newRole });
};


// actualizamos un rol.
const updateRole = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const role = await findByPkOrFail(Roles, id, 'El rol');

    await role.update(req.body);

    res.status(200).json({ message: 'Rol actualizado con éxito.', role });
};


// eliminamos un rol, siempre que ningún usuario lo tenga asignado.
const deleteRole = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const role = await findByPkOrFail(Roles, id, 'El rol');

    await ensureNoDependencies('El rol', [
        { model: User, where: { role_id: id }, label: 'usuarios' },
    ]);

    await role.destroy();

    res.status(200).json({ message: 'Rol eliminado con éxito.' });
};


export { getRoles, getRoleById, createRole, updateRole, deleteRole };
