import express, { type Request, type Response } from 'express';
import Address_user from '../models/address_user.model.js';

const router = express.Router();

/**
 * @openapi
 * /address_user:
 *   get:
 *     tags: [En construcción]
 *     summary: (Pendiente) Lista las direcciones de usuario
 *     description: |
 *       Ruta registrada pero todavía sin implementar: actualmente devuelve
 *       una respuesta estática en lugar de consultar la tabla `address_user`.
 *     security: []
 *     responses:
 *       200:
 *         description: Respuesta estática.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: address
 */
router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'address' });
});

export default router;
