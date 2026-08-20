import express, { type Request, type Response } from 'express'
import { Tl } from '../models/tl.model.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createTlSchema } from '../dto/create-tl.schema.js'

const router = express.Router()

/**
  * @swagger
  * /tl:
  *   get:
  *     summary: Consultar TLs existentes
  *     tags:
  *       - TL
  *     responses:
  *       200:
  *         description: TLs consultados correctamente
  *       500:
  *         description: Error interno del servidor
  */

// GET // consultar todos los TLs
router.get('/', async (req: Request, res: Response) => {
    try {
        const tls = await Tl.find()

        res.status(200).json(tls)

    } catch (error) {
        res.status(500).json({
            message: 'Error al consultar los TLs'
        })
    }
})

/**
 * @swagger
 * /tl/{id}:
 *   get:
 *     summary: Buscar un TL por su ID
 *     tags:
 *       - TL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del TL
 *     responses:
 *       200:
 *         description: TL encontrado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: TL no encontrado
 */

// GET // consultar un TL por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const tl = await Tl.findById(req.params.id)

        if (!tl) {
            return res.status(404).json({
                message: 'TL no encontrado'
            })
        }

        res.status(200).json(tl)

    } catch (error) {
        res.status(400).json({
            message: 'ID inválido'
        })
    }
})

/**
 * @swagger
 * /tl:
 *   post:
 *     summary: Crear un TL
 *     tags:
 *       - TL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - jornada
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dylan Suárez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dylan@example.com
 *               jornada:
 *                 type: string
 *                 example: am
 *     responses:
 *       201:
 *         description: TL creado correctamente
 *       409:
 *         description: El TL ya existe
 *       500:
 *         description: Error interno del servidor
 */

// POST // crear un TL
router.post('/', validateRequest(createTlSchema), async (req: Request, res: Response) => {
    try {
        const { name, email, jornada } = req.body

        const tlExist = await Tl.findOne({ email })

        if (tlExist) {
            return res.status(409).json({
                message: 'TL ya existe.'
            })
        }

        const tl = await Tl.create({
            name,
            email,
            jornada
        })

        res.status(201).json({
            message: 'TL creado',
            tl
        })

    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el TL'
        })
    }
})

export default router