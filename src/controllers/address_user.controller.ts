import type { Request, Response } from "express";
import Address_user from "../models/address_user.model.js";
import Cities from "../models/cities.model.js";
import User from "../models/user.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// Cada dirección se devuelve junto con su ciudad.
const includeCity = [
    {
        model: Cities,
        as: 'city',
    },
];


// listamos todas las direcciones.
const getAddresses = async (req: Request, res: Response) => {

    const addresses = await Address_user.findAll({
        include: includeCity,
        order: [['address', 'ASC']],
    });

    res.status(200).json({ message: 'Direcciones encontradas.', addresses });
};


// consultamos una dirección por su id.
const getAddressById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const address = await Address_user.findByPk(id, { include: includeCity });

    if (!address) {
        return res.status(404).json({ message: 'La dirección no encontrada.' });
    }

    res.status(200).json({ message: 'Dirección encontrada.', address });
};


// creamos una dirección.
const createAddress = async (req: Request, res: Response) => {

    const { city_id } = req.body;

    // La ciudad debe existir antes de enlazarla.
    await findByPkOrFail(Cities, city_id, 'La ciudad');

    const newAddress = await Address_user.create(req.body);

    res.status(201).json({
        message: 'Dirección creada con éxito.',
        newAddress,
    });
};


// actualizamos una dirección.
const updateAddress = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const address = await findByPkOrFail(Address_user, id, 'La dirección');

    const { city_id } = req.body;

    if (city_id) {
        await findByPkOrFail(Cities, city_id, 'La ciudad');
    }

    await address.update(req.body);

    res.status(200).json({ message: 'Dirección actualizada con éxito.', address });
};


// eliminamos una dirección, si ningún usuario la tiene asignada.
const deleteAddress = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const address = await findByPkOrFail(Address_user, id, 'La dirección');

    await ensureNoDependencies('La dirección', [
        { model: User, where: { address_user_id: id }, label: 'usuarios' },
    ]);

    await address.destroy();

    res.status(200).json({ message: 'Dirección eliminada con éxito.' });
};


export {
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};
