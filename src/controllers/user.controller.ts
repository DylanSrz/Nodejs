import type { Request, Response } from "express";
import User from "../models/user.model.js";
import Address_user from "../models/address_user.model.js";
import Identification from "../models/identification.model.js";
import db from "../config/db.js";

const getUser = async (req:Request, res:Response) => {

    try {

        const users = await User.findAll()
        res.status(200).json({message: 'Usuarios encontrados.', users})
    } catch(error) {
        console.error(error)
        res.status(500).json({message: 'Error en el servidor.'})
    }
}

const createUser = async (req: Request, res: Response) => {

    try {

        const {
            first_name,
            last_name,
            email,
            password,
            phone,
            birth_date,
            city_id,
            address,
            type_identification_id,
            identification_number,
            role_id
        } = req.body

        const transaction = await db.transaction()

        const newAddres = await Address_user.create(
            {
                city_id,
                address
            },
            {transaction}
        )

        const newIdentification = await Identification.create(
            {
                type_identification_id,
                number: identification_number
            },
            {transaction}
        )

        const newUser = await User.create(
            {
                first_name,
                last_name,
                email,
                password_hash: password,
                phone,
                birth_date,
                addres_user_id: newAddres.id,
                identification_id: newIdentification.id,
                role_id
            },
            {transaction}
        )

        await transaction.commit()
        res.status(201).json({message: 'Usuario creado con exito', newUser})

    } catch(error) {
        console.error(error)
        res.status(500).json({message: 'Error en el servidor.'})
    }
}

const updateStatus = async (req: Request, res: Response) => {

    try {

        const id = req.params.id as string
        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        await user.update({is_active: !user.is_active})
        res.status(201).json({message: `User status updated to ${user.is_active}`})

        
    } catch(error) {
        console.error(error)
        res.status(500).json({message: 'Error in the server'})
    }
}

export {getUser, createUser, updateStatus}