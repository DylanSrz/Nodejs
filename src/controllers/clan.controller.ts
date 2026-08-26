import type { Request, Response } from "express";
import Clan from "../models/clan.model.js";
import User from "../models/user.model.js";
import Roles from "../models/role.model.js";

// consultamos todos los clanes registrados.
const getClan = async (req:Request, res: Response) => {

    const clans = await Clan.findAll()

    res.status(200).json({message: 'Clanes encontrados:', clans})
}

// creamos un clan
const createClan = async (req: Request, res: Response) => {

    try {
        const {
            name,
            schedule_id,
            type_route_id,
            room_id,
            tl_id
        } = req.body

        const tl = await User.findByPk(tl_id)

        if (!tl) {
            return res.status(404).json({message: 'TL not found.'})
        }

        const rol_tl = await Roles.findOne({where: {name: "team leader"}})

        if (tl.role_id !== rol_tl?.id) {
            return res.status(403).json({message: 'El rol no cumple los requisitos'})
        }

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
    } catch(error) {
        console.error(error)
        return res.status(500).json({message: 'Bug in the server.', error})
    }
}

export {getClan, createClan}