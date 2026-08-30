import type { Request, Response } from "express";
import Campus from "../models/campus.model.js";
import Cities from "../models/cities.model.js";
import Room from "../models/room.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// Cada sede se devuelve junto con su ciudad.
const includeCity = [
    {
        model: Cities,
        as: 'city',
    },
];


// listamos todas las sedes.
const getCampuses = async (req: Request, res: Response) => {

    const campuses = await Campus.findAll({
        include: includeCity,
        order: [['name', 'ASC']],
    });

    res.status(200).json({ message: 'Sedes encontradas.', campuses });
};


// consultamos una sede por su id.
const getCampusById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const campus = await Campus.findByPk(id, { include: includeCity });

    if (!campus) {
        return res.status(404).json({ message: 'La sede no encontrada.' });
    }

    res.status(200).json({ message: 'Sede encontrada.', campus });
};


// creamos una sede.
const createCampus = async (req: Request, res: Response) => {

    const { city_id } = req.body;

    await findByPkOrFail(Cities, city_id, 'La ciudad');

    const newCampus = await Campus.create(req.body);

    res.status(201).json({ message: 'Sede creada con éxito.', newCampus });
};


// actualizamos una sede.
const updateCampus = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const campus = await findByPkOrFail(Campus, id, 'La sede');

    const { city_id } = req.body;

    if (city_id) {
        await findByPkOrFail(Cities, city_id, 'La ciudad');
    }

    await campus.update(req.body);

    res.status(200).json({ message: 'Sede actualizada con éxito.', campus });
};


// eliminamos una sede, si no tiene salones registrados.
const deleteCampus = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const campus = await findByPkOrFail(Campus, id, 'La sede');

    await ensureNoDependencies('La sede', [
        { model: Room, where: { campus_id: id }, label: 'salones' },
    ]);

    await campus.destroy();

    res.status(200).json({ message: 'Sede eliminada con éxito.' });
};


export {
    getCampuses,
    getCampusById,
    createCampus,
    updateCampus,
    deleteCampus,
};
