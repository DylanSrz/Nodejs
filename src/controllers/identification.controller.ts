import type { Request, Response } from "express";
import Identification from "../models/identification.model.js";
import Type_identification from "../models/type_identification.model.js";
import User from "../models/user.model.js";
import {
    ensureNoDependencies,
    ensureUniqueValue,
    findByPkOrFail,
} from "../utils/db_helpers.js";


// Cada identificación se devuelve junto con su tipo de
// documento, que es el dato que realmente interesa leer.
const includeType = [
    {
        model: Type_identification,
        as: 'type_identification',
    },
];


// listamos todas las identificaciones.
const getIdentifications = async (req: Request, res: Response) => {

    const identifications = await Identification.findAll({
        include: includeType,
        order: [['number', 'ASC']],
    });

    res.status(200).json({
        message: 'Identificaciones encontradas.',
        identifications,
    });
};


// consultamos una identificación por su id.
const getIdentificationById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const identification = await Identification.findByPk(id, {
        include: includeType,
    });

    if (!identification) {
        return res.status(404).json({ message: 'La identificación no encontrada.' });
    }

    res.status(200).json({
        message: 'Identificación encontrada.',
        identification,
    });
};


// creamos una identificación.
const createIdentification = async (req: Request, res: Response) => {

    const { type_identification_id, number } = req.body;

    // El tipo de documento debe existir.
    await findByPkOrFail(
        Type_identification,
        type_identification_id,
        'El tipo de identificación'
    );

    // La columna number es única.
    await ensureUniqueValue(
        Identification,
        { number },
        'El número de identificación ya existe.'
    );

    const newIdentification = await Identification.create({
        type_identification_id,
        number,
    });

    res.status(201).json({
        message: 'Identificación creada con éxito.',
        newIdentification,
    });
};


// actualizamos una identificación.
const updateIdentification = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const identification = await findByPkOrFail(
        Identification,
        id,
        'La identificación'
    );

    const { type_identification_id, number } = req.body;

    if (type_identification_id) {
        await findByPkOrFail(
            Type_identification,
            type_identification_id,
            'El tipo de identificación'
        );
    }

    // Solo verificamos duplicados si el número realmente cambia.
    if (number && number !== identification.number) {
        await ensureUniqueValue(
            Identification,
            { number },
            'El número de identificación ya existe.'
        );
    }

    await identification.update(req.body);

    res.status(200).json({
        message: 'Identificación actualizada con éxito.',
        identification,
    });
};


// eliminamos una identificación, si ningún usuario la usa.
const deleteIdentification = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const identification = await findByPkOrFail(
        Identification,
        id,
        'La identificación'
    );

    await ensureNoDependencies('La identificación', [
        { model: User, where: { identification_id: id }, label: 'usuarios' },
    ]);

    await identification.destroy();

    res.status(200).json({ message: 'Identificación eliminada con éxito.' });
};


export {
    getIdentifications,
    getIdentificationById,
    createIdentification,
    updateIdentification,
    deleteIdentification,
};
