import express from 'express';
import {
    getTypeRoutes,
    getTypeRouteById,
    createTypeRoute,
    updateTypeRoute,
    deleteTypeRoute,
} from '../controllers/type_route.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createTypeRouteSchema, updateTypeRouteSchema } from '../dto/type_route.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /type_route:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las rutas de formación
 *     description: Devuelve las rutas disponibles; ruta básica y ruta avanzada.
 *     security: []
 *     responses:
 *       200:
 *         description: Rutas encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Rutas encontradas. }
 *                 type_routes:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/TypeRoute' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getTypeRoutes);


/**
 * @openapi
 * /type_route/{id}:
 *   get:
 *     tags: [Catálogos]
 *     summary: Consulta una ruta por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Ruta encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ruta encontrada. }
 *                 type_route: { $ref: '#/components/schemas/TypeRoute' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getTypeRouteById);


/**
 * @openapi
 * /type_route:
 *   post:
 *     tags: [Catálogos]
 *     summary: Crea una ruta de formación
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTypeRouteRequest' }
 *     responses:
 *       201:
 *         description: Ruta creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ruta creada con éxito. }
 *                 newTypeRoute: { $ref: '#/components/schemas/TypeRoute' }
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
    validateRequest(createTypeRouteSchema),
    createTypeRoute
);


/**
 * @openapi
 * /type_route/{id}:
 *   put:
 *     tags: [Catálogos]
 *     summary: Actualiza una ruta de formación
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
 *           schema: { $ref: '#/components/schemas/CreateTypeRouteRequest' }
 *     responses:
 *       200:
 *         description: Ruta actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ruta actualizada con éxito. }
 *                 type_route: { $ref: '#/components/schemas/TypeRoute' }
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
    validateRequest(updateTypeRouteSchema),
    updateTypeRoute
);


/**
 * @openapi
 * /type_route/{id}:
 *   delete:
 *     tags: [Catálogos]
 *     summary: Elimina una ruta de formación
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si algún clan tiene esa ruta asignada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Ruta eliminada con éxito.
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
    deleteTypeRoute
);


export default router;
