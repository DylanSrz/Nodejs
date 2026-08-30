import express, { type Request, type Response } from 'express';
import Room from '../models/room.model.js';

const router = express.Router();

/**
 * @openapi
 * /room:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista los salones
 *     description: |
 *       Devuelve los salones con su capacidad y la sede a la que pertenecen.
 *       El `id` de un salón es el valor que se envía como `room_id` al crear
 *       un clan.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de salones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req: Request, res: Response) => {

    try {

        const rooms = await Room.findAll()

        res.json(rooms)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
    ;

});

export default router;
