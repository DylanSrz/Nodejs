import express from 'express';
import { createClan, getClan } from '../controllers/clan.controller.js';

const router = express.Router();

/**
 * @openapi
 * /clan:
 *   get:
 *     tags: [Clanes]
 *     summary: Lista todos los clanes
 *     security: []
 *     responses:
 *       200:
 *         description: Clanes encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clanes encontrados:'
 *                 clans:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Clan'
 */
router.get('/', getClan);

/**
 * @openapi
 * /clan:
 *   post:
 *     tags: [Clanes]
 *     summary: Crea un clan
 *     description: |
 *       Antes de insertar valida que `tl_id` corresponda a un usuario existente
 *       y que su rol sea `team leader`.
 *
 *       La columna `tl_id` es única: un team leader solo puede estar asignado
 *       a un clan.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClanRequest'
 *     responses:
 *       201:
 *         description: Clan creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clan creado con exito,'
 *                 newClan:
 *                   $ref: '#/components/schemas/Clan'
 *       403:
 *         description: El usuario indicado no tiene el rol 'team leader'.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: El rol no cumple los requisitos
 *       404:
 *         description: El tl_id no corresponde a ningún usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: TL not found.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Bug in the server.
 */
router.post('/', createClan)

export default router;
