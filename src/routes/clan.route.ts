import express, { type Request, type Response } from 'express'
import { Clan } from '../models/clan.model.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createClanSchema } from '../dto/create-clan.schema.js'

const router = express.Router()

// GET // consultar todos los clanes.
router.get('/', async (req: Request, res: Response) => {

    const clanes = await Clan.find().populate('ruta')

    res.status(200).json({message: 'Listado de todos los clanes', clanes})

})

// GET // consultar un clan por ID
router.get('/:id', async (req: Request, res: Response) => {

    const clanes = await Clan.findById(req.params.id).populate('ruta')

    res.status(200).json({message: 'Clan encontrado.', clanes})

})

// POST // crear un clan
router.post('/', validateRequest(createClanSchema),async ( req: Request, res: Response) => {

    const {name, sala, jornada, ruta} = req.body

    const newClan = await Clan.create(
        {
            name,
            sala,
            jornada,
            ruta
        }
    )

    res.json(201).json({message: 'clan creado exitosamente', newClan})

})

export default router