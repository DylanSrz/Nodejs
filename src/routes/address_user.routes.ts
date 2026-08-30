import express from 'express';
import {
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
} from '../controllers/address_user.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createAddressUserSchema, updateAddressUserSchema } from '../dto/address_user.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /address_user:
 *   get:
 *     tags: [Identificaciones y direcciones]
 *     summary: Lista las direcciones de usuario
 *     description: Devuelve cada dirección junto con su ciudad.
 *     security: []
 *     responses:
 *       200:
 *         description: Direcciones encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Direcciones encontradas. }
 *                 addresses:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/AddressUser' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getAddresses);


/**
 * @openapi
 * /address_user/{id}:
 *   get:
 *     tags: [Identificaciones y direcciones]
 *     summary: Consulta una dirección por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Dirección encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Dirección encontrada. }
 *                 address: { $ref: '#/components/schemas/AddressUser' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getAddressById);


/**
 * @openapi
 * /address_user:
 *   post:
 *     tags: [Identificaciones y direcciones]
 *     summary: Crea una dirección
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateAddressUserRequest' }
 *     responses:
 *       201:
 *         description: Dirección creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Dirección creada con éxito. }
 *                 newAddress: { $ref: '#/components/schemas/AddressUser' }
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
    validateRequest(createAddressUserSchema),
    createAddress
);


/**
 * @openapi
 * /address_user/{id}:
 *   put:
 *     tags: [Identificaciones y direcciones]
 *     summary: Actualiza una dirección
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
 *           schema: { $ref: '#/components/schemas/CreateAddressUserRequest' }
 *     responses:
 *       200:
 *         description: Dirección actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Dirección actualizada con éxito. }
 *                 address: { $ref: '#/components/schemas/AddressUser' }
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
    validateRequest(updateAddressUserSchema),
    updateAddress
);


/**
 * @openapi
 * /address_user/{id}:
 *   delete:
 *     tags: [Identificaciones y direcciones]
 *     summary: Elimina una dirección
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si algún usuario tiene esa dirección asignada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Dirección eliminada con éxito.
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
    deleteAddress
);


export default router;
