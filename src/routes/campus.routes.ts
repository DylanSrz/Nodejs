import express from 'express';
import {
    getCampuses,
    getCampusById,
    createCampus,
    updateCampus,
    deleteCampus,
} from '../controllers/campus.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createCampusSchema, updateCampusSchema } from '../dto/campus.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /campus:
 *   get:
 *     tags: [Sedes y salones]
 *     summary: Lista las sedes
 *     description: Devuelve cada sede junto con su ciudad.
 *     security: []
 *     responses:
 *       200:
 *         description: Sedes encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Sedes encontradas. }
 *                 campuses:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Campus' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getCampuses);


/**
 * @openapi
 * /campus/{id}:
 *   get:
 *     tags: [Sedes y salones]
 *     summary: Consulta una sede por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Sede encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Sede encontrada. }
 *                 campus: { $ref: '#/components/schemas/Campus' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getCampusById);


/**
 * @openapi
 * /campus:
 *   post:
 *     tags: [Sedes y salones]
 *     summary: Crea una sede
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCampusRequest' }
 *     responses:
 *       201:
 *         description: Sede creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Sede creada con éxito. }
 *                 newCampus: { $ref: '#/components/schemas/Campus' }
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
    validateRequest(createCampusSchema),
    createCampus
);


/**
 * @openapi
 * /campus/{id}:
 *   put:
 *     tags: [Sedes y salones]
 *     summary: Actualiza una sede
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
 *           schema: { $ref: '#/components/schemas/CreateCampusRequest' }
 *     responses:
 *       200:
 *         description: Sede actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Sede actualizada con éxito. }
 *                 campus: { $ref: '#/components/schemas/Campus' }
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
    validateRequest(updateCampusSchema),
    updateCampus
);


/**
 * @openapi
 * /campus/{id}:
 *   delete:
 *     tags: [Sedes y salones]
 *     summary: Elimina una sede
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si la sede tiene salones registrados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Sede eliminada con éxito.
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
    deleteCampus
);


export default router;
