import express, { type Request, type Response } from 'express'
import { Tl } from '../models/tl.model.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createTlSchema } from '../dto/create-tl.schema.js'

const router = express.Router()


// GET // consultar todos los TL's
router.get('/', async (req: Request, res: Response) => {

    const tls = await Tl.find()

    res.json(tls)
})


// GET // consultar un TL por ID
router.get('/:id', async (req: Request, res: Response) => {

    const tl = await Tl.findById(req.params.id)

    res.json(tl)
})

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Crear una tarea
 *     tags:
 *       - Task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nueva tarea
 *               status:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: tarea creado
 *       400:
 *         description: Datos inválidos
 */
// POST // crear un TL
router.post('/', validateRequest(createTlSchema), async (req: Request, res: Response) => {

    const {name, email, jornada} = req.body

    const tl = await Tl.create(
        {
            name,
            email,
            jornada
        }
    )

    res.status(201).json({message: 'TL creado', tl})
})

export default router