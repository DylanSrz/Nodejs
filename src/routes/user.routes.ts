import express, { type Request, type Response } from 'express';
import User from '../models/user.model.js';
import * as bcrypt from 'bcrypt'
import Address_user from '../models/address_user.model.js';
import db from '../config/db.js';
import { json } from 'sequelize';
import Identification from '../models/identification.model.js';
import { number } from 'zod';

const router = express.Router();


// GET // listar todos los usuarios...
router.get('/', async (req: Request, res: Response) => {
    
    try {

        const users = await User.findAll()

        res.json(users)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});


// POST // crear un nuevo usuario...
router.post('/', async (req:Request, res:Response) => {

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


    // Aqui iniciamos la transaccion. Si algo falla se va ejecutando transaction.rollback()
    // y si todo funciona se hace transaction.commit()

    const transaction = await db.transaction()

    try {

        const newAddress = await Address_user.create(
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
                address_user_id: newAddress.id,
                identification_id: newIdentification.id,
                role_id
            },
            {transaction}
        )

        await transaction.commit()

        res.status(201).json({message: 'Usuario creado con exito', newUser})

    } catch(error) {
        
        //Deshacemos la transacción.

        await transaction.rollback()

        console.error(error)

        return res.status(500),json({message: 'Error al crear el usuario.'})
    }



})


export default router;
