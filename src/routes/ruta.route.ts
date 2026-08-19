import express, { type Request, type Response } from 'express'
import { Ruta } from '../models/ruta.model.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createRutaSchema } from '../dto/create-ruta.schema.js'

const router = express.Router()

// GET // consultar todas las rutas.
router.get('/', async (req: Request, res: Response) => {

    const rutas = await Ruta.find().populate('tl')

    res.json(rutas)

})


// GET // consultar una ruta por ID
router.get('/:id', async (req: Request, res: Response) => {

    const ruta = await Ruta.findById(req.params.id).populate('tl')

    res.json(ruta)

})

// POST // crear una ruta.
router.post('/', validateRequest(createRutaSchema), async (req: Request, res: Response) => {

    const {name, dificultad, tl} =  req.body

    const ruta = await Ruta.create(
        {
            name,
            dificultad,
            tl
        }
    )

    res.json({message: 'ruta creada', ruta})

})

export default router