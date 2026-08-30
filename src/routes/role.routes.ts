import express, { type Request, type Response } from 'express';
import Roles from '../models/role.model.js';

const router = express.Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista los roles disponibles
 *     description: Devuelve los roles del sistema; admin, team leader y coder.
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', async(req: Request, res: Response) => {

    try{

        const roles = await Roles.findAll();

        res.json(roles);

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error en el servidor'});
    }
});



export default router;
