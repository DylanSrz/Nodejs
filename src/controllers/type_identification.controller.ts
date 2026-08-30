import type { Request, Response } from "express";
import Type_identification from "../models/type_identification.model.js";
import Identification from "../models/identification.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// listamos todos los tipos de identificación.
const getTypeIdentifications = async (req: Request, res: Response) => {

    const type_identifications = await Type_identification.findAll({
        order: [['name', 'ASC']],
    });

    res.status(200).json({
        message: 'Tipos de identificación encontrados.',
        type_identifications,
    });
};


// consultamos un tipo de identificación por su id.
const getTypeIdentificationById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const type_identification = await findByPkOrFail(
        Type_identification,
        id,
        'El tipo de identificación'
    );

    res.status(200).json({
        message: 'Tipo de identificación encontrado.',
        type_identification,
    });
};


// creamos un tipo de identificación.
const createTypeIdentification = async (req: Request, res: Response) => {

    const newTypeIdentification = await Type_identification.create(req.body);

    res.status(201).json({
        message: 'Tipo de identificación creado con éxito.',
        newTypeIdentification,
    });
};


// actualizamos un tipo de identificación.
const updateTypeIdentification = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const type_identification = await findByPkOrFail(
        Type_identification,
        id,
        'El tipo de identificación'
    );

    await type_identification.update(req.body);

    res.status(200).json({
        message: 'Tipo de identificación actualizado con éxito.',
        type_identification,
    });
};


// eliminamos un tipo de identificación, si ningún documento lo usa.
const deleteTypeIdentification = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const type_identification = await findByPkOrFail(
        Type_identification,
        id,
        'El tipo de identificación'
    );

    await ensureNoDependencies('El tipo de identificación', [
        {
            model: Identification,
            where: { type_identification_id: id },
            label: 'identificaciones',
        },
    ]);

    await type_identification.destroy();

    res.status(200).json({
        message: 'Tipo de identificación eliminado con éxito.',
    });
};


export {
    getTypeIdentifications,
    getTypeIdentificationById,
    createTypeIdentification,
    updateTypeIdentification,
    deleteTypeIdentification,
};
