import type { Request, Response } from "express";
import Type_route from "../models/type_route.model.js";
import Clan from "../models/clan.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// listamos todas las rutas de formación.
const getTypeRoutes = async (req: Request, res: Response) => {

    const type_routes = await Type_route.findAll({ order: [['name', 'ASC']] });

    res.status(200).json({ message: 'Rutas encontradas.', type_routes });
};


// consultamos una ruta por su id.
const getTypeRouteById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const type_route = await findByPkOrFail(Type_route, id, 'La ruta');

    res.status(200).json({ message: 'Ruta encontrada.', type_route });
};


// creamos una ruta.
const createTypeRoute = async (req: Request, res: Response) => {

    const newTypeRoute = await Type_route.create(req.body);

    res.status(201).json({ message: 'Ruta creada con éxito.', newTypeRoute });
};


// actualizamos una ruta.
const updateTypeRoute = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const type_route = await findByPkOrFail(Type_route, id, 'La ruta');

    await type_route.update(req.body);

    res.status(200).json({ message: 'Ruta actualizada con éxito.', type_route });
};


// eliminamos una ruta, si ningún clan la tiene asignada.
const deleteTypeRoute = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const type_route = await findByPkOrFail(Type_route, id, 'La ruta');

    await ensureNoDependencies('La ruta', [
        { model: Clan, where: { type_route_id: id }, label: 'clanes' },
    ]);

    await type_route.destroy();

    res.status(200).json({ message: 'Ruta eliminada con éxito.' });
};


export {
    getTypeRoutes,
    getTypeRouteById,
    createTypeRoute,
    updateTypeRoute,
    deleteTypeRoute,
};
