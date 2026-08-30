import type { Request, Response } from "express";
import Coder_clan from "../models/coder_clan.model.js";
import Clan from "../models/clan.model.js";
import User from "../models/user.model.js";
import Roles from "../models/role.model.js";
import { findByPkOrFail } from "../utils/db_helpers.js";
import { conflict, notFound } from "../utils/http_error.js";
import { ensureCanManageClan } from "./clan.controller.js";


// Cada asignación se lee con su clan y con el coder.
const includeCoderClan = [
    { model: Clan, as: 'clan' },
    {
        model: User,
        as: 'coder',
        attributes: { exclude: ['password_hash'] },
    },
];


// ======================================================
// BUSCAR POR CLAVE COMPUESTA
// ======================================================
//
// coder_clan no tiene un id propio: se identifica por la
// pareja (clan_id, coder_id).
//
const findAssignmentOrFail = async (clan_id: string, coder_id: string) => {

    const assignment = await Coder_clan.findOne({
        where: { clan_id, coder_id },
    });

    if (!assignment) {
        throw notFound('La asignación no encontrada.');
    }

    return assignment;
};


// listamos todas las asignaciones.
const getCoderClans = async (req: Request, res: Response) => {

    const coder_clans = await Coder_clan.findAll({
        include: includeCoderClan,
        order: [['start_date', 'DESC']],
    });

    res.status(200).json({ message: 'Asignaciones encontradas.', coder_clans });
};


// consultamos una asignación por su clave compuesta.
const getCoderClanById = async (req: Request, res: Response) => {

    const clan_id = req.params.clan_id as string;
    const coder_id = req.params.coder_id as string;

    const coder_clan = await Coder_clan.findOne({
        where: { clan_id, coder_id },
        include: includeCoderClan,
    });

    if (!coder_clan) {
        return res.status(404).json({ message: 'La asignación no encontrada.' });
    }

    res.status(200).json({ message: 'Asignación encontrada.', coder_clan });
};


// ======================================================
// ASIGNAR UN CODER A UN CLAN
// ======================================================
//
// Reglas que se verifican antes de insertar:
//
//   - el clan existe
//   - el usuario existe, está activo y tiene rol "coder"
//   - esa pareja no está registrada ya
//   - quien hace la petición puede gestionar ese clan
//
const createCoderClan = async (req: Request, res: Response) => {

    const { clan_id, coder_id, start_date, end_date } = req.body;

    const clan = await findByPkOrFail(Clan, clan_id, 'El clan');

    ensureCanManageClan(req, clan);

    const coder = await findByPkOrFail(User, coder_id, 'El coder');

    const rol_coder = await Roles.findOne({ where: { name: 'coder' } });

    if (coder.role_id !== rol_coder?.id) {
        return res.status(403).json({
            message: 'El usuario indicado no tiene el rol coder.',
        });
    }

    if (!coder.is_active) {
        throw conflict('El coder está inactivo.');
    }

    const existing = await Coder_clan.findOne({ where: { clan_id, coder_id } });

    if (existing) {
        throw conflict('Ese coder ya está asignado a este clan.');
    }

    const newCoderClan = await Coder_clan.create({
        clan_id,
        coder_id,
        start_date,
        end_date: end_date ?? null,
    });

    res.status(201).json({
        message: 'Coder asignado al clan con éxito.',
        newCoderClan,
    });
};


// actualizamos las fechas de una asignación.
const updateCoderClan = async (req: Request, res: Response) => {

    const clan_id = req.params.clan_id as string;
    const coder_id = req.params.coder_id as string;

    const clan = await findByPkOrFail(Clan, clan_id, 'El clan');

    ensureCanManageClan(req, clan);

    const assignment = await findAssignmentOrFail(clan_id, coder_id);

    // Si solo llega una de las dos fechas, la comparación se
    // hace contra la que ya está guardada.
    const start = req.body.start_date ?? assignment.start_date;
    const end = req.body.end_date ?? assignment.end_date;

    if (start && end && String(start) > String(end)) {
        throw conflict('end_date no puede ser anterior a start_date.');
    }

    await assignment.update(req.body);

    res.status(200).json({
        message: 'Asignación actualizada con éxito.',
        assignment,
    });
};


// eliminamos una asignación.
const deleteCoderClan = async (req: Request, res: Response) => {

    const clan_id = req.params.clan_id as string;
    const coder_id = req.params.coder_id as string;

    const clan = await findByPkOrFail(Clan, clan_id, 'El clan');

    ensureCanManageClan(req, clan);

    const assignment = await findAssignmentOrFail(clan_id, coder_id);

    await assignment.destroy();

    res.status(200).json({ message: 'Asignación eliminada con éxito.' });
};


export {
    getCoderClans,
    getCoderClanById,
    createCoderClan,
    updateCoderClan,
    deleteCoderClan,
};
