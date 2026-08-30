import express from 'express';
import {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
} from '../controllers/role.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createRoleSchema, updateRoleSchema } from '../dto/role.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista los roles disponibles
 *     description: Devuelve los roles del sistema; admin, team leader y coder.
 *     security: []
 *     responses:
 *       200:
 *         description: Roles encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Roles encontrados. }
 *                 roles:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Role' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getRoles);


/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     tags: [Catálogos]
 *     summary: Consulta un rol por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Rol encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Rol encontrado. }
 *                 role: { $ref: '#/components/schemas/Role' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getRoleById);


/**
 * @openapi
 * /roles:
 *   post:
 *     tags: [Catálogos]
 *     summary: Crea un rol
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRoleRequest' }
 *     responses:
 *       201:
 *         description: Rol creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Rol creado con éxito. }
 *                 newRole: { $ref: '#/components/schemas/Role' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post(
    '/',
    verifyToken,
    checkRole('admin'),
    validateRequest(createRoleSchema),
    createRole
);


/**
 * @openapi
 * /roles/{id}:
 *   put:
 *     tags: [Catálogos]
 *     summary: Actualiza un rol
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRoleRequest' }
 *     responses:
 *       200:
 *         description: Rol actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Rol actualizado con éxito. }
 *                 role: { $ref: '#/components/schemas/Role' }
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
    validateRequest(updateRoleSchema),
    updateRole
);


/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     tags: [Catálogos]
 *     summary: Elimina un rol
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si algún usuario todavía tiene ese rol asignado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Rol eliminado con éxito.
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
    deleteRole
);


export default router;
