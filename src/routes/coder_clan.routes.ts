import express, { type Request, type Response } from 'express';
import Coder_clan from '../models/coder_clan.model.js';

const router = express.Router();

/**
 * @openapi
 * /coder_clan:
 *   get:
 *     tags: [En construcción]
 *     summary: (Pendiente) Lista la asignación de coders a clanes
 *     description: |
 *       Ruta registrada pero todavía sin implementar: actualmente devuelve
 *       una respuesta estática en lugar de consultar la tabla puente
 *       `coder_clan`.
 *     security: []
 *     responses:
 *       200:
 *         description: Respuesta estática.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: coderClan
 */
router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'coderClan' });
});

export default router;
