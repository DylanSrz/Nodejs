import express, { type Request, type Response } from 'express';
import Type_identification from '../models/type_identification.model.js';

const router = express.Router();

/**
 * @openapi
 * /type_identification:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista los tipos de identificación
 *     description: Devuelve los tipos de documento; cc, ti, ce, pa y ppt.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de tipos de identificación.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TypeIdentification'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req: Request, res: Response) => {

    try {

        const type_identification = await Type_identification.findAll()

        res.json(type_identification)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor.'})
    }
});

export default router;
