import express from 'express';
import {
    getCoderClans,
    getCoderClanById,
    createCoderClan,
    updateCoderClan,
    deleteCoderClan,
} from '../controllers/coder_clan.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import {
    createCoderClanSchema,
    updateCoderClanSchema,
} from '../dto/coder_clan.schema.js';
import { coderClanParamsSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /coder_clan:
 *   get:
 *     tags: [Coders por clan]
 *     summary: Lista todas las asignaciones de coders a clanes
 *     description: Cada asignación llega con su clan y con el coder.
 *     security: []
 *     responses:
 *       200:
 *         description: Asignaciones encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Asignaciones encontradas. }
 *                 coder_clans:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CoderClan' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getCoderClans);


/**
 * @openapi
 * /coder_clan/{clan_id}/{coder_id}:
 *   get:
 *     tags: [Coders por clan]
 *     summary: Consulta una asignación por su clave compuesta
 *     description: |
 *       La tabla no tiene un id propio: se identifica por la pareja
 *       (clan_id, coder_id).
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/ClanIdParam'
 *       - $ref: '#/components/parameters/CoderIdParam'
 *     responses:
 *       200:
 *         description: Asignación encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Asignación encontrada. }
 *                 coder_clan: { $ref: '#/components/schemas/CoderClan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get(
    '/:clan_id/:coder_id',
    validateParams(coderClanParamsSchema),
    getCoderClanById
);


/**
 * @openapi
 * /coder_clan:
 *   post:
 *     tags: [Coders por clan]
 *     summary: Asigna un coder a un clan
 *     description: |
 *       Requiere token con rol admin o team leader. Un team leader solo puede
 *       asignar coders al clan que dirige.
 *
 *       Antes de insertar se comprueba que:
 *
 *       - el clan exista
 *       - el usuario exista, esté activo y tenga rol `coder`
 *       - esa pareja no esté ya registrada
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCoderClanRequest' }
 *     responses:
 *       201:
 *         description: Coder asignado al clan con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Coder asignado al clan con éxito. }
 *                 newCoderClan: { $ref: '#/components/schemas/CoderClan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Sin permiso sobre el clan, o el usuario no tiene rol coder.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             example: { message: El usuario indicado no tiene el rol coder. }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409:
 *         description: El coder ya está en el clan, o está inactivo.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             example: { message: Ese coder ya está asignado a este clan. }
 */
router.post(
    '/',
    verifyToken,
    checkRole('admin', 'team leader'),
    validateRequest(createCoderClanSchema),
    createCoderClan
);


/**
 * @openapi
 * /coder_clan/{clan_id}/{coder_id}:
 *   put:
 *     tags: [Coders por clan]
 *     summary: Actualiza las fechas de una asignación
 *     description: |
 *       Requiere token con rol admin o team leader. Un team leader solo puede
 *       tocar asignaciones del clan que dirige.
 *
 *       El clan y el coder no se cambian: eso sería otra asignación distinta.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ClanIdParam'
 *       - $ref: '#/components/parameters/CoderIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateCoderClanRequest' }
 *     responses:
 *       200:
 *         description: Asignación actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Asignación actualizada con éxito. }
 *                 assignment: { $ref: '#/components/schemas/CoderClan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.put(
    '/:clan_id/:coder_id',
    verifyToken,
    checkRole('admin', 'team leader'),
    validateParams(coderClanParamsSchema),
    validateRequest(updateCoderClanSchema),
    updateCoderClan
);


/**
 * @openapi
 * /coder_clan/{clan_id}/{coder_id}:
 *   delete:
 *     tags: [Coders por clan]
 *     summary: Retira a un coder de un clan
 *     description: |
 *       Requiere token con rol admin o team leader. Un team leader solo puede
 *       retirar coders del clan que dirige.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ClanIdParam'
 *       - $ref: '#/components/parameters/CoderIdParam'
 *     responses:
 *       200:
 *         description: Asignación eliminada con éxito.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete(
    '/:clan_id/:coder_id',
    verifyToken,
    checkRole('admin', 'team leader'),
    validateParams(coderClanParamsSchema),
    deleteCoderClan
);


export default router;
