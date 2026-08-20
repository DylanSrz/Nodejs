import express, { type Request, type Response } from 'express'
import { Clan } from '../models/clan.model.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { createClanSchema } from '../dto/create-clan.schema.js'
import { Ruta } from '../models/ruta.model.js'

const router = express.Router()


// GET // consultar todos los clanes
/**
 * @swagger
 * /clan:
 *   get:
 *     summary: Consultar todos los clanes
 *     tags:
 *       - Clan
 *     responses:
 *       200:
 *         description: Listado de todos los clanes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Listado de todos los clanes
 *                 clanes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665f1a2b3c4d5e6f78901234
 *                       name:
 *                         type: string
 *                         example: Clan Alpha
 *                       sala:
 *                         type: integer
 *                         example: 101
 *                       jornada:
 *                         type: string
 *                         enum:
 *                           - am
 *                           - pm
 *                         example: am
 *                       ruta:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 665f1a2b3c4d5e6f78901235
 *                           name:
 *                             type: string
 *                             example: Ruta Norte
 *                           dificultad:
 *                             type: string
 *                             enum:
 *                               - facil
 *                               - dificil
 *                             example: facil
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const clanes = await Clan.find().populate('ruta')

        res.status(200).json({
            message: 'Listado de todos los clanes',
            clanes
        })

    } catch (error) {
        res.status(500).json({
            message: 'Error al consultar los clanes'
        })
    }
})

// GET // consultar un clan por ID
/**
 * @swagger
 * /clan/{id}:
 *   get:
 *     summary: Buscar un clan por su ID
 *     tags:
 *       - Clan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del clan
 *         schema:
 *           type: string
 *           example: 665f1a2b3c4d5e6f78901234
 *     responses:
 *       200:
 *         description: Clan encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clan encontrado.
 *                 clan:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f78901234
 *                     name:
 *                       type: string
 *                       example: Clan Alpha
 *                     sala:
 *                       type: integer
 *                       example: 101
 *                     jornada:
 *                       type: string
 *                       enum:
 *                         - am
 *                         - pm
 *                       example: am
 *                     ruta:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 665f1a2b3c4d5e6f78901235
 *                         name:
 *                           type: string
 *                           example: Ruta Norte
 *                         dificultad:
 *                           type: string
 *                           enum:
 *                             - facil
 *                             - dificil
 *                           example: facil
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ID de clan inválido
 *       404:
 *         description: Clan no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const clan = await Clan.findById(req.params.id).populate('ruta')

        if (!clan) {
            return res.status(404).json({
                message: 'Clan no encontrado.'
            })
        }

        res.status(200).json({
            message: 'Clan encontrado.',
            clan
        })

    } catch (error) {
        res.status(400).json({
            message: 'ID de clan inválido.'
        })
    }
})

// POST // crear un clan
/**
 * @swagger
 * /clan:
 *   post:
 *     summary: Crear un clan
 *     tags:
 *       - Clan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sala
 *               - jornada
 *               - ruta
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clan Alpha
 *               sala:
 *                 type: integer
 *                 example: 101
 *               jornada:
 *                 type: string
 *                 enum:
 *                   - am
 *                   - pm
 *                 example: am
 *               ruta:
 *                 type: string
 *                 description: ID de la ruta asignada al clan
 *                 example: 665f1a2b3c4d5e6f78901235
 *     responses:
 *       201:
 *         description: Clan creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clan creado exitosamente
 *                 newClan:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f78901234
 *                     name:
 *                       type: string
 *                       example: Clan Alpha
 *                     sala:
 *                       type: integer
 *                       example: 101
 *                     jornada:
 *                       type: string
 *                       example: am
 *                     ruta:
 *                       type: string
 *                       example: 665f1a2b3c4d5e6f78901235
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: La ruta no existe
 *       409:
 *         description: El clan ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', validateRequest(createClanSchema), async (req: Request, res: Response) => {

        try {
            
            const { name, sala, jornada, ruta } = req.body

            const rutaExist = await Ruta.findById(ruta)

            if (!rutaExist) {
                return res.status(404).json({
                    message: 'La ruta no existe.'
                })
            }

            const clanExist = await Clan.findOne({ name })

            if (clanExist) {
                return res.status(409).json({
                    message: 'El clan ya existe.'
                })
            }

            const newClan = await Clan.create({
                name,
                sala,
                jornada,
                ruta
            })

            res.status(201).json({
                message: 'Clan creado exitosamente',
                newClan
            })

        } catch (error) {
            res.status(500).json({
                message: 'Error al crear el clan'
            })
        }
    }
)

export default router