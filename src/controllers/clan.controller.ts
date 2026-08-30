import type { Request, Response } from "express";
import Clan from "../models/clan.model.js";
import User from "../models/user.model.js";
import Roles from "../models/role.model.js";
import Schedule from "../models/schedule.model.js";
import Type_route from "../models/type_route.model.js";
import Room from "../models/room.model.js";
import Coder_clan from "../models/coder_clan.model.js";
import {
    ensureNoDependencies,
    ensureUniqueValue,
    findByPkOrFail,
} from "../utils/db_helpers.js";
import { forbidden } from "../utils/http_error.js";


// Un clan se lee siempre con su jornada, su ruta, su salón y
// su team leader.
const includeClan = [
    { model: Schedule, as: 'schedule' },
    { model: Type_route, as: 'type_route' },
    { model: Room, as: 'room' },
    {
        model: User,
        as: 'team_leader',
        attributes: { exclude: ['password_hash'] },
    },
];


// ======================================================
// VALIDAR EL TEAM LEADER
// ======================================================
//
// El usuario indicado en tl_id debe existir y tener el rol
// "team leader". Además la columna es única, así que no
// puede estar ya al frente de otro clan.
//
// "currentClanId" permite que una actualización conserve su
// propio team leader sin que se lo tome como duplicado.
//
const validateTeamLeader = async (tl_id: string, currentClanId?: string) => {

    const tl = await User.findByPk(tl_id);

    if (!tl) {
        return { error: 'TL not found.' as const, status: 404 };
    }

    const rol_tl = await Roles.findOne({ where: { name: "team leader" } });

    if (tl.role_id !== rol_tl?.id) {
        return { error: 'El rol no cumple los requisitos' as const, status: 403 };
    }

    if (!tl.is_active) {
        return { error: 'El team leader está inactivo.' as const, status: 409 };
    }

    const existing = await Clan.findOne({ where: { tl_id } });

    if (existing && existing.id !== currentClanId) {
        return {
            error: 'Ese team leader ya está asignado a otro clan.' as const,
            status: 409,
        };
    }

    return { error: null, status: 200 };
};


// ======================================================
// PERMISO SOBRE UN CLAN
// ======================================================
//
// Un admin gestiona cualquier clan.
//
// Un team leader solo puede tocar el clan que dirige.
//
const ensureCanManageClan = (req: Request, clan: Clan) => {

    const user = req.user;

    if (!user) {
        throw forbidden('No tiene permiso para esta acción.');
    }

    if (user.role === 'admin') {
        return;
    }

    if (user.role === 'team leader' && clan.tl_id === user.id) {
        return;
    }

    throw forbidden('Solo puede gestionar el clan que usted dirige.');
};


// consultamos todos los clanes registrados.
const getClan = async (req: Request, res: Response) => {

    const clans = await Clan.findAll({
        include: includeClan,
        order: [['name', 'ASC']],
    });

    res.status(200).json({message: 'Clanes encontrados:', clans})
}


// consultamos un clan por su id.
const getClanById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const clan = await Clan.findByPk(id, { include: includeClan });

    if (!clan) {
        return res.status(404).json({ message: 'El clan no encontrado.' });
    }

    res.status(200).json({ message: 'Clan encontrado.', clan });
};


// creamos un clan
const createClan = async (req: Request, res: Response) => {

    const {
        name,
        schedule_id,
        type_route_id,
        room_id,
        tl_id
    } = req.body

    const check = await validateTeamLeader(tl_id);

    if (check.error) {
        return res.status(check.status).json({ message: check.error });
    }

    // Las demás llaves foráneas también deben existir.
    await findByPkOrFail(Schedule, schedule_id, 'La jornada');
    await findByPkOrFail(Type_route, type_route_id, 'La ruta');
    await findByPkOrFail(Room, room_id, 'El salón');

    // La columna name es única.
    await ensureUniqueValue(
        Clan,
        { name },
        'Ya existe un clan con ese nombre.'
    );

    const newClan = await Clan.create(
        {
            name,
            schedule_id,
            type_route_id,
            room_id,
            tl_id
        }
    )

    res.status(201).json({message: 'Clan creado con exito,', newClan})
}


// actualizamos un clan.
const updateClan = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const clan = await findByPkOrFail(Clan, id, 'El clan');

    ensureCanManageClan(req, clan);

    const { name, schedule_id, type_route_id, room_id, tl_id } = req.body;

    if (tl_id && tl_id !== clan.tl_id) {

        const check = await validateTeamLeader(tl_id, id);

        if (check.error) {
            return res.status(check.status).json({ message: check.error });
        }
    }

    if (schedule_id) {
        await findByPkOrFail(Schedule, schedule_id, 'La jornada');
    }

    if (type_route_id) {
        await findByPkOrFail(Type_route, type_route_id, 'La ruta');
    }

    if (room_id) {
        await findByPkOrFail(Room, room_id, 'El salón');
    }

    if (name && name !== clan.name) {
        await ensureUniqueValue(
            Clan,
            { name },
            'Ya existe un clan con ese nombre.'
        );
    }

    await clan.update(req.body);

    res.status(200).json({ message: 'Clan actualizado con éxito.', clan });
};


// eliminamos un clan, si no tiene coders asignados.
const deleteClan = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const clan = await findByPkOrFail(Clan, id, 'El clan');

    await ensureNoDependencies('El clan', [
        {
            model: Coder_clan,
            where: { clan_id: id },
            label: 'coders asignados',
        },
    ]);

    await clan.destroy();

    res.status(200).json({ message: 'Clan eliminado con éxito.' });
};


// ======================================================
// CODERS DE UN CLAN
// ======================================================
//
// Atajo de lectura: quiénes están asignados a este clan.
//
const getClanCoders = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    await findByPkOrFail(Clan, id, 'El clan');

    const members = await Coder_clan.findAll({
        where: { clan_id: id },
        include: [
            {
                model: User,
                as: 'coder',
                attributes: { exclude: ['password_hash'] },
            },
        ],
        order: [['start_date', 'ASC']],
    });

    res.status(200).json({ message: 'Coders del clan.', members });
};


export {
    getClan,
    getClanById,
    createClan,
    updateClan,
    deleteClan,
    getClanCoders,
    ensureCanManageClan,
};
