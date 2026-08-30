import express from 'express';
import {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
} from '../controllers/room.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createRoomSchema, updateRoomSchema } from '../dto/room.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /room:
 *   get:
 *     tags: [Sedes y salones]
 *     summary: Lista los salones
 *     description: Devuelve cada salón con su capacidad y la sede a la que pertenece.
 *     security: []
 *     responses:
 *       200:
 *         description: Salones encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Salones encontrados. }
 *                 rooms:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Room' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getRooms);


/**
 * @openapi
 * /room/{id}:
 *   get:
 *     tags: [Sedes y salones]
 *     summary: Consulta un salón por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Salón encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Salón encontrado. }
 *                 room: { $ref: '#/components/schemas/Room' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getRoomById);


/**
 * @openapi
 * /room:
 *   post:
 *     tags: [Sedes y salones]
 *     summary: Crea un salón
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRoomRequest' }
 *     responses:
 *       201:
 *         description: Salón creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Salón creado con éxito. }
 *                 newRoom: { $ref: '#/components/schemas/Room' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post(
    '/',
    verifyToken,
    checkRole('admin'),
    validateRequest(createRoomSchema),
    createRoom
);


/**
 * @openapi
 * /room/{id}:
 *   put:
 *     tags: [Sedes y salones]
 *     summary: Actualiza un salón
 *     description: |
 *       Requiere token con rol admin.
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
 *           schema: { $ref: '#/components/schemas/CreateRoomRequest' }
 *     responses:
 *       200:
 *         description: Salón actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Salón actualizado con éxito. }
 *                 room: { $ref: '#/components/schemas/Room' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.put(
    '/:id',
    verifyToken,
    checkRole('admin'),
    validateParams(idParamSchema),
    validateRequest(updateRoomSchema),
    updateRoom
);


/**
 * @openapi
 * /room/{id}:
 *   delete:
 *     tags: [Sedes y salones]
 *     summary: Elimina un salón
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si algún clan tiene ese salón asignado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Salón eliminado con éxito.
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
    deleteRoom
);


export default router;
