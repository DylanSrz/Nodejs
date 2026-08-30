import express, { type Request, type Response } from 'express';
import Schedule from '../models/schedule.model.js';

const router = express.Router();

/**
 * @openapi
 * /schedule:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las jornadas
 *     description: |
 *       Devuelve las jornadas disponibles; am (06:00 a 12:59) y pm (13:00 a 21:00).
 *       El `id` de una jornada es el valor que se envía como `schedule_id`
 *       al crear un clan.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de jornadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req: Request, res: Response) => {

    try {

        const schedule = await Schedule.findAll()

        res.json(schedule)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});

export default router;
