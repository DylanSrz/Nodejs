import type { Request, Response } from "express";
import Room from "../models/room.model.js";
import Campus from "../models/campus.model.js";
import Clan from "../models/clan.model.js";
import { ensureNoDependencies, findByPkOrFail } from "../utils/db_helpers.js";


// Cada salón se devuelve junto con la sede a la que pertenece.
const includeCampus = [
    {
        model: Campus,
        as: 'campus',
    },
];


// listamos todos los salones.
const getRooms = async (req: Request, res: Response) => {

    const rooms = await Room.findAll({
        include: includeCampus,
        order: [['name', 'ASC']],
    });

    res.status(200).json({ message: 'Salones encontrados.', rooms });
};


// consultamos un salón por su id.
const getRoomById = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const room = await Room.findByPk(id, { include: includeCampus });

    if (!room) {
        return res.status(404).json({ message: 'El salón no encontrado.' });
    }

    res.status(200).json({ message: 'Salón encontrado.', room });
};


// creamos un salón.
const createRoom = async (req: Request, res: Response) => {

    const { campus_id } = req.body;

    await findByPkOrFail(Campus, campus_id, 'La sede');

    const newRoom = await Room.create(req.body);

    res.status(201).json({ message: 'Salón creado con éxito.', newRoom });
};


// actualizamos un salón.
const updateRoom = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const room = await findByPkOrFail(Room, id, 'El salón');

    const { campus_id } = req.body;

    if (campus_id) {
        await findByPkOrFail(Campus, campus_id, 'La sede');
    }

    await room.update(req.body);

    res.status(200).json({ message: 'Salón actualizado con éxito.', room });
};


// eliminamos un salón, si ningún clan lo tiene asignado.
const deleteRoom = async (req: Request, res: Response) => {

    const id = req.params.id as string;

    const room = await findByPkOrFail(Room, id, 'El salón');

    await ensureNoDependencies('El salón', [
        { model: Clan, where: { room_id: id }, label: 'clanes' },
    ]);

    await room.destroy();

    res.status(200).json({ message: 'Salón eliminado con éxito.' });
};


export { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
