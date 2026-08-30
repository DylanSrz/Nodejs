import express from 'express';
import {
    getIdentifications,
    getIdentificationById,
    createIdentification,
    updateIdentification,
    deleteIdentification,
} from '../controllers/identification.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createIdentificationSchema, updateIdentificationSchema } from '../dto/identification.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /identification:
 *   get:
 *     tags: [Identificaciones y direcciones]
 *     summary: Lista las identificaciones
 *     description: Devuelve cada documento junto con su tipo de identificación.
 *     security: []
 *     responses:
 *       200:
 *         description: Identificaciones encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Identificaciones encontradas. }
 *                 identifications:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Identification' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getIdentifications);


/**
 * @openapi
 * /identification/{id}:
 *   get:
 *     tags: [Identificaciones y direcciones]
 *     summary: Consulta una identificación por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Identificación encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Identificación encontrada. }
 *                 identification: { $ref: '#/components/schemas/Identification' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getIdentificationById);


/**
 * @openapi
 * /identification:
 *   post:
 *     tags: [Identificaciones y direcciones]
 *     summary: Crea una identificación
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateIdentificationRequest' }
 *     responses:
 *       201:
 *         description: Identificación creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Identificación creada con éxito. }
 *                 newIdentification: { $ref: '#/components/schemas/Identification' }
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
    validateRequest(createIdentificationSchema),
    createIdentification
);


/**
 * @openapi
 * /identification/{id}:
 *   put:
 *     tags: [Identificaciones y direcciones]
 *     summary: Actualiza una identificación
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
 *           schema: { $ref: '#/components/schemas/CreateIdentificationRequest' }
 *     responses:
 *       200:
 *         description: Identificación actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Identificación actualizada con éxito. }
 *                 identification: { $ref: '#/components/schemas/Identification' }
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
    validateRequest(updateIdentificationSchema),
    updateIdentification
);


/**
 * @openapi
 * /identification/{id}:
 *   delete:
 *     tags: [Identificaciones y direcciones]
 *     summary: Elimina una identificación
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si algún usuario usa esa identificación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Identificación eliminada con éxito.
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
    deleteIdentification
);


export default router;
