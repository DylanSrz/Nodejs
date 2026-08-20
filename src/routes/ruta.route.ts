import express, { type Request, type Response } from 'express'
import { Ruta } from '../models/ruta.model.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createRutaSchema } from '../dto/create-ruta.schema.js'
import { Tl } from '../models/tl.model.js'

const router = express.Router()

// GET // consultar todas las rutas.
/**
 * @swagger
 * /ruta:
 *   get:
 *     summary: Consultar todas las rutas
 *     tags:
 *       - Ruta
 *     responses:
 *       200:
 *         description: Lista de rutas consultadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 665f1a2b3c4d5e6f78901234
 *                   name:
 *                     type: string
 *                     example: Ruta Norte
 *                   dificultad:
 *                     type: string
 *                     enum:
 *                       - facil
 *                       - dificil
 *                     example: facil
 *                   tl:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665f1a2b3c4d5e6f78901235
 *                       name:
 *                         type: string
 *                         example: Dylan Suárez
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: dylan@example.com
 *                       jornada:
 *                         type: string
 *                         example: am
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const rutas = await Ruta.find().populate('tl')

        res.status(200).json(rutas)

    } catch (error) {
        res.status(500).json({
            message: 'Error al consultar las rutas'
        })
    }
})


// GET // consultar una ruta por ID
/**
 * @swagger
 * /ruta/{id}:
 *   get:
 *     summary: Buscar una ruta por su ID
 *     tags:
 *       - Ruta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la ruta
 *         schema:
 *           type: string
 *           example: 665f1a2b3c4d5e6f78901234
 *     responses:
 *       200:
 *         description: Ruta encontrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 665f1a2b3c4d5e6f78901234
 *                 name:
 *                   type: string
 *                   example: Ruta Norte
 *                 dificultad:
 *                   type: string
 *                   enum:
 *                     - facil
 *                     - dificil
 *                   example: facil
 *                 tl:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f78901235
 *                     name:
 *                       type: string
 *                       example: Dylan Suárez
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: dylan@example.com
 *                     jornada:
 *                       type: string
 *                       example: am
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID de ruta inválido
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const ruta = await Ruta.findById(req.params.id).populate('tl')

        if (!ruta) {
            return res.status(404).json({
                message: 'Ruta no encontrada'
            })
        }

        res.status(200).json(ruta)

    } catch (error) {
        res.status(400).json({
            message: 'ID de ruta inválido'
        })
    }
})

// POST // crear una ruta.
/**
 * @swagger
 * /ruta:
 *   post:
 *     summary: Crear una ruta
 *     tags:
 *       - Ruta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - dificultad
 *               - tl
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ruta Norte
 *               dificultad:
 *                 type: string
 *                 enum:
 *                   - facil
 *                   - dificil
 *                 example: facil
 *               tl:
 *                 type: string
 *                 description: ID del TL encargado de la ruta
 *                 example: 665f1a2b3c4d5e6f78901235
 *     responses:
 *       201:
 *         description: Ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ruta creada
 *                 ruta:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f78901234
 *                     name:
 *                       type: string
 *                       example: Ruta Norte
 *                     dificultad:
 *                       type: string
 *                       example: facil
 *                     tl:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f78901235
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', validateRequest(createRutaSchema), async(req: Request, res: Response) => {

        try {
            const { name, dificultad, tl } = req.body

            const tlExist = await Tl.findById(tl)

            if (!tlExist) {
                return res.status(404).json({
                    message: 'El TL no existe'
                })
            }

            const ruta = await Ruta.create({
                name,
                dificultad,
                tl
            })

            res.status(201).json({
                message: 'Ruta creada',
                ruta
            })

        } catch (error) {
            res.status(500).json({
                message: 'Error al crear la ruta'
            })
        }
    }
)

export default router