import express from 'express';
import {
    getCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
} from '../controllers/cities.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createCitySchema, updateCitySchema } from '../dto/cities.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /cities:
 *   get:
 *     tags: [Catálogos]
 *     summary: Lista las ciudades
 *     description: Devuelve el catálogo de ciudades ordenado por nombre.
 *     security: []
 *     responses:
 *       200:
 *         description: Ciudades encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ciudades encontradas. }
 *                 cities:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/City' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getCities);


/**
 * @openapi
 * /cities/{id}:
 *   get:
 *     tags: [Catálogos]
 *     summary: Consulta una ciudad por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Ciudad encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ciudad encontrada. }
 *                 city: { $ref: '#/components/schemas/City' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getCityById);


/**
 * @openapi
 * /cities:
 *   post:
 *     tags: [Catálogos]
 *     summary: Crea una ciudad
 *     description: Requiere token con rol admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCityRequest' }
 *     responses:
 *       201:
 *         description: Ciudad creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ciudad creada con éxito. }
 *                 newCity: { $ref: '#/components/schemas/City' }
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
    validateRequest(createCitySchema),
    createCity
);


/**
 * @openapi
 * /cities/{id}:
 *   put:
 *     tags: [Catálogos]
 *     summary: Actualiza una ciudad
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
 *           schema: { $ref: '#/components/schemas/CreateCityRequest' }
 *     responses:
 *       200:
 *         description: Ciudad actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Ciudad actualizada con éxito. }
 *                 city: { $ref: '#/components/schemas/City' }
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
    validateRequest(updateCitySchema),
    updateCity
);


/**
 * @openapi
 * /cities/{id}:
 *   delete:
 *     tags: [Catálogos]
 *     summary: Elimina una ciudad
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Responde 409 si la ciudad tiene direcciones o sedes asociadas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Ciudad eliminada con éxito.
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
    deleteCity
);


export default router;
