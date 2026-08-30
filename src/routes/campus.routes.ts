import express, { type Request, type Response } from 'express';
import Campus from '../models/campus.model.js';

const router = express.Router();

/**
 * @openapi
 * /campus:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las sedes
 *     description: Devuelve las sedes registradas junto con la ciudad a la que pertenecen.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de sedes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campus'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req: Request, res: Response) => {

    try {

        const campus = await Campus.findAll()

        res.json(campus)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});

export default router;
