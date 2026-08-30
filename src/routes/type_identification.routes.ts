import express from 'express';
import {
    getTypeIdentifications,
    getTypeIdentificationById,
    createTypeIdentification,
    updateTypeIdentification,
    deleteTypeIdentification,
} from '../controllers/type_identification.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createTypeIdentificationSchema, updateTypeIdentificationSchema } from '../dto/type_identification.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /type_identification:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista los tipos de identificación
 *     description: Devuelve los tipos de documento; cc, ti, ce, pa y ppt.
 *     security: []
 *     responses:
 *       200:
 *         description: Tipos de identificación encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Tipos de identificación encontrados. }
 *                 type_identifications:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/TypeIdentification' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getTypeIdentifications);


/**
 * @openapi
 * /type_identification/{id}:
 *   get:
 *     tags: [Catálogos]
 *     summary: Consulta un tipo de identificación por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Tipo de identificación encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Tipo de identificación encontrado. }
 *                 type_identification: { $ref: '#/components/schemas/TypeIdentification' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getTypeIdentificationById);


/**
 * @openapi
 * /type_identification:
 *   post:
 *     tags: [Catálogos]
 *     summary: Crea un tipo de identificación
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTypeIdentificationRequest' }
 *     responses:
 *       201:
 *         description: Tipo de identificación creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Tipo de identificación creado con éxito. }
 *                 newTypeIdentification: { $ref: '#/components/schemas/TypeIdentification' }
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
    validateRequest(createTypeIdentificationSchema),
    createTypeIdentification
);


/**
 * @openapi
 * /type_identification/{id}:
 *   put:
 *     tags: [Catálogos]
 *     summary: Actualiza un tipo de identificación
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
 *           schema: { $ref: '#/components/schemas/CreateTypeIdentificationRequest' }
 *     responses:
 *       200:
 *         description: Tipo de identificación actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Tipo de identificación actualizado con éxito. }
 *                 type_identification: { $ref: '#/components/schemas/TypeIdentification' }
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
    validateRequest(updateTypeIdentificationSchema),
    updateTypeIdentification
);


/**
 * @openapi
 * /type_identification/{id}:
 *   delete:
 *     tags: [Catálogos]
 *     summary: Elimina un tipo de identificación
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si alguna identificación usa ese tipo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Tipo de identificación eliminado con éxito.
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
    deleteTypeIdentification
);


export default router;
