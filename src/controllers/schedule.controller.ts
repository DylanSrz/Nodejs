import type { Request, Response } from "express";
import Schedule from "../models/schedule.model.js";
import Clan from "../models/clan.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// listamos todas las jornadas.
const getSchedules = async (req: Request, res: Response) => {

    const schedules = await Schedule.findAll({ order: [['start_time', 'ASC']] });

    res.status(200).json({ message: 'Jornadas encontradas.', schedules });
};


// consultamos una jornada por su id.
const getScheduleById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const schedule = await findByPkOrFail(Schedule, id, 'La jornada');

    res.status(200).json({ message: 'Jornada encontrada.', schedule });
};


// creamos una jornada.
const createSchedule = async (req: Request, res: Response) => {

    const newSchedule = await Schedule.create(req.body);

    res.status(201).json({ message: 'Jornada creada con éxito.', newSchedule });
};


// actualizamos una jornada.
const updateSchedule = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const schedule = await findByPkOrFail(Schedule, id, 'La jornada');

    await schedule.update(req.body);

    res.status(200).json({ message: 'Jornada actualizada con éxito.', schedule });
};


// eliminamos una jornada, si ningún clan la tiene asignada.
const deleteSchedule = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const schedule = await findByPkOrFail(Schedule, id, 'La jornada');

    await ensureNoDependencies('La jornada', [
        { model: Clan, where: { schedule_id: id }, label: 'clanes' },
    ]);

    await schedule.destroy();

    res.status(200).json({ message: 'Jornada eliminada con éxito.' });
};


export {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
};
