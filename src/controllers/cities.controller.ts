import type { Request, Response } from "express";
import Cities from "../models/cities.model.js";
import Address_user from "../models/address_user.model.js";
import Campus from "../models/campus.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// listamos todas las ciudades.
const getCities = async (req: Request, res: Response) => {

    const cities = await Cities.findAll({ order: [['name', 'ASC']] });

    res.status(200).json({ message: 'Ciudades encontradas.', cities });
};


// consultamos una ciudad por su id.
const getCityById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const city = await findByPkOrFail(Cities, id, 'La ciudad');

    res.status(200).json({ message: 'Ciudad encontrada.', city });
};


// creamos una ciudad.
const createCity = async (req: Request, res: Response) => {

    const newCity = await Cities.create(req.body);

    res.status(201).json({ message: 'Ciudad creada con éxito.', newCity });
};


// actualizamos una ciudad.
const updateCity = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const city = await findByPkOrFail(Cities, id, 'La ciudad');

    await city.update(req.body);

    res.status(200).json({ message: 'Ciudad actualizada con éxito.', city });
};


// eliminamos una ciudad.
//
// La referencian address_user y campus, así que revisamos
// ambas tablas antes de borrar.
const deleteCity = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const city = await findByPkOrFail(Cities, id, 'La ciudad');

    await ensureNoDependencies('La ciudad', [
        { model: Address_user, where: { city_id: id }, label: 'direcciones' },
        { model: Campus, where: { city_id: id }, label: 'sedes' },
    ]);

    await city.destroy();

    res.status(200).json({ message: 'Ciudad eliminada con éxito.' });
};


export { getCities, getCityById, createCity, updateCity, deleteCity };
