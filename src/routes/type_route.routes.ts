import express, { type Request, type Response } from 'express';
import Type_route from '../models/type_route.model.js';

const router = express.Router();

/**
 * @openapi
 * /type_route:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las rutas de formación
 *     description: |
 *       Devuelve las rutas disponibles; básica y avanzada. El `id` de una ruta
 *       es el valor que se envía como `type_route_id` al crear un clan.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de rutas de formación.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TypeRoute'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async (req: Request, res: Response) => {

    try {

        const type_routes = await Type_route.findAll()

        res.json(type_routes)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }

});

export default router;
