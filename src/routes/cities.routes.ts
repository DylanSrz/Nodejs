import express, { type Request, type Response } from 'express';
import Cities from '../models/cities.model.js';

const router = express.Router();

/**
 * @openapi
 * /cities:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las ciudades
 *     description: |
 *       Devuelve el catálogo de ciudades. El `id` de una ciudad es el valor
 *       que se envía como `city_id` al crear un usuario.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de ciudades.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req: Request, res: Response) => {

    try {

        const cities = await Cities.findAll()

        res.json(cities)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});

export default router;
