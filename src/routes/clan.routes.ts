import express from 'express';
import {
    createClan,
    getClan,
    getClanById,
    updateClan,
    deleteClan,
    getClanCoders,
} from '../controllers/clan.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createClanSchema, updateClanSchema } from '../dto/clan.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /clan:
 *   get:
 *     tags: [Clanes]
 *     summary: Lista todos los clanes
 *     description: Cada clan llega con su jornada, su ruta, su salón y su team leader.
 *     security: []
 *     responses:
 *       200:
 *         description: Clanes encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Clanes encontrados:' }
 *                 clans:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Clan' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getClan);


/**
 * @openapi
 * /clan/{id}:
 *   get:
 *     tags: [Clanes]
 *     summary: Consulta un clan por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Clan encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Clan encontrado. }
 *                 clan: { $ref: '#/components/schemas/Clan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getClanById);


/**
 * @openapi
 * /clan/{id}/coders:
 *   get:
 *     tags: [Clanes]
 *     summary: Lista los coders asignados a un clan
 *     description: Atajo de lectura sobre la tabla puente coder_clan.
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Coders del clan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Coders del clan. }
 *                 members:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CoderClan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id/coders', validateParams(idParamSchema), getClanCoders);


/**
 * @openapi
 * /clan:
 *   post:
 *     tags: [Clanes]
 *     summary: Crea un clan
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Antes de insertar se comprueba que:
 *
 *       - `tl_id` corresponda a un usuario existente y activo con rol `team leader`
 *       - ese team leader no dirija ya otro clan (la columna es única)
 *       - la jornada, la ruta y el salón existan
 *       - el nombre del clan esté libre
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateClanRequest' }
 *     responses:
 *       201:
 *         description: Clan creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Clan creado con exito,' }
 *                 newClan: { $ref: '#/components/schemas/Clan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Sin permiso, o el usuario indicado no es team leader.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             example: { message: El rol no cumple los requisitos }
 *       404:
 *         description: El team leader, la jornada, la ruta o el salón no existen.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             example: { message: TL not found. }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post(
    '/',
    verifyToken,
    checkRole('admin'),
    validateRequest(createClanSchema),
    createClan
);


/**
 * @openapi
 * /clan/{id}:
 *   put:
 *     tags: [Clanes]
 *     summary: Actualiza un clan
 *     description: |
 *       Requiere token con rol admin o team leader.
 *
 *       Un team leader solo puede modificar el clan que dirige; sobre
 *       cualquier otro recibe 403.
 *
 *       Todos los campos son opcionales, pero el cuerpo no puede estar vacío.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateClanRequest' }
 *     responses:
 *       200:
 *         description: Clan actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Clan actualizado con éxito. }
 *                 clan: { $ref: '#/components/schemas/Clan' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403:
 *         description: Sin permiso sobre este clan, o el tl_id no es team leader.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             example: { message: Solo puede gestionar el clan que usted dirige. }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.put(
    '/:id',
    verifyToken,
    checkRole('admin', 'team leader'),
    validateParams(idParamSchema),
    validateRequest(updateClanSchema),
    updateClan
);


/**
 * @openapi
 * /clan/{id}:
 *   delete:
 *     tags: [Clanes]
 *     summary: Elimina un clan
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si el clan todavía tiene coders asignados: hay que
 *       retirarlos antes desde `/coder_clan`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Clan eliminado con éxito.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.delete(
    '/:id',
    verifyToken,
    checkRole('admin'),
    validateParams(idParamSchema),
    deleteClan
);


export default router;
