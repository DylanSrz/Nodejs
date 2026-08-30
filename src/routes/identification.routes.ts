import express, { type Request, type Response } from 'express';
import Identification from '../models/identification.model.js';

const router = express.Router();

/**
 * @openapi
 * /identification:
 *   get:
 *     tags: [En construcción]
 *     summary: (Pendiente) Lista las identificaciones
 *     description: |
 *       Ruta registrada pero todavía sin implementar: actualmente devuelve
 *       una respuesta estática en lugar de consultar la tabla `identification`.
 *     security: []
 *     responses:
 *       200:
 *         description: Respuesta estática.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: identification
 */
router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'identification' });
});

export default router;
