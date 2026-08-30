import express from 'express';
import {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
} from '../controllers/schedule.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createScheduleSchema, updateScheduleSchema } from '../dto/schedule.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /schedule:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las jornadas
 *     description: Devuelve las jornadas disponibles; am (06:00 a 12:59) y pm (13:00 a 21:00).
 *     security: []
 *     responses:
 *       200:
 *         description: Jornadas encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Jornadas encontradas. }
 *                 schedules:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Schedule' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getSchedules);


/**
 * @openapi
 * /schedule/{id}:
 *   get:
 *     tags: [Catálogos]
 *     summary: Consulta una jornada por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Jornada encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Jornada encontrada. }
 *                 schedule: { $ref: '#/components/schemas/Schedule' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getScheduleById);


/**
 * @openapi
 * /schedule:
 *   post:
 *     tags: [Catálogos]
 *     summary: Crea una jornada
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateScheduleRequest' }
 *     responses:
 *       201:
 *         description: Jornada creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Jornada creada con éxito. }
 *                 newSchedule: { $ref: '#/components/schemas/Schedule' }
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
    validateRequest(createScheduleSchema),
    createSchedule
);


/**
 * @openapi
 * /schedule/{id}:
 *   put:
 *     tags: [Catálogos]
 *     summary: Actualiza una jornada
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
 *           schema: { $ref: '#/components/schemas/CreateScheduleRequest' }
 *     responses:
 *       200:
 *         description: Jornada actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Jornada actualizada con éxito. }
 *                 schedule: { $ref: '#/components/schemas/Schedule' }
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
    validateRequest(updateScheduleSchema),
    updateSchedule
);


/**
 * @openapi
 * /schedule/{id}:
 *   delete:
 *     tags: [Catálogos]
 *     summary: Elimina una jornada
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si algún clan tiene esa jornada asignada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Jornada eliminada con éxito.
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
    deleteSchedule
);


export default router;
