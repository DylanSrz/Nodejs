import express from 'express';
import {
    createUser,
    getUser,
    getUserById,
    updateUser,
    updateStatus,
    deleteUser,
} from '../controllers/user.controller.js';
import { validateParams, validateRequest } from '../middlewares/validate_request.js';
import { createUserSchema, updateUserSchema } from '../dto/user.schema.js';
import { idParamSchema } from '../dto/common.schema.js';
import { checkRole, verifyToken} from '../middlewares/verifyToken.js';

const router = express.Router();


/**
 * @openapi
 * /user:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista todos los usuarios
 *     description: |
 *       Cada usuario llega con su rol, su dirección y su identificación.
 *
 *       La columna password_hash nunca se incluye.
 *     security: []
 *     responses:
 *       200:
 *         description: Usuarios encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Usuarios encontrados. }
 *                 users:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// GET // listar todos los usuarios...
router.get('/', getUser);


/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Consulta un usuario por su id
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Usuario encontrado. }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validateParams(idParamSchema), getUserById);


/**
 * @openapi
 * /user:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crea un usuario con su dirección e identificación
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Inserta la dirección, la identificación y el usuario dentro de una
 *       única transacción: si algo falla no queda nada a medias.
 *
 *       La contraseña llega en el campo `password` y se persiste hasheada
 *       con bcrypt en `password_hash`.
 *
 *       Antes de abrir la transacción se comprueba que existan la ciudad,
 *       el tipo de identificación y el rol, y que el correo y el número de
 *       documento estén libres.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateUserRequest' }
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Usuario creado con exito }
 *                 newUser: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404:
 *         description: La ciudad, el tipo de identificación o el rol no existen.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *       409:
 *         description: El correo o el número de identificación ya están registrados.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             examples:
 *               identificacionDuplicada:
 *                 value: { message: El número de identificación ya existe. }
 *               emailDuplicado:
 *                 value: { message: El correo electrónico ya está registrado. }
 */
// POST // crear un nuevo usuario...
router.post(
    '/',
    verifyToken,
    checkRole("admin"),
    validateRequest(createUserSchema),
    createUser
);


/**
 * @openapi
 * /user/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualiza un usuario
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Solo toca columnas de la tabla user. La dirección y la identificación
 *       se editan por `/address_user` y `/identification`.
 *
 *       Si se envía `password`, se vuelve a hashear antes de guardarla.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUserRequest' }
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Usuario actualizado con éxito. }
 *                 user: { $ref: '#/components/schemas/User' }
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
    validateRequest(updateUserSchema),
    updateUser
);


/**
 * @openapi
 * /user/status/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Alterna el estado activo de un usuario
 *     description: |
 *       Requiere token con rol admin.
 *
 *       Invierte el valor de `is_active`, así que sirve tanto para dar de baja
 *       como para reactivar.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Estado actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User status updated to false }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
// PUT // cambiar el estado de un usuario (is_active)
router.put(
    '/status/:id',
    verifyToken,
    checkRole('admin'),
    validateParams(idParamSchema),
    updateStatus
);


/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Da de baja a un usuario (borrado lógico)
 *     description: |
 *       Requiere token con rol admin.
 *
 *       No borra la fila: marca `is_active` en false. Un usuario está
 *       referenciado por `clan.tl_id` y por `coder_clan.coder_id`, así que
 *       borrarlo de verdad destruiría el historial de esos clanes.
 *
 *       Un usuario inactivo no puede iniciar sesión.
 *
 *       Responde 409 si el usuario ya está inactivo, o si es team leader de
 *       un clan: en ese caso hay que reasignar el clan primero.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Usuario desactivado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Usuario desactivado con éxito. }
 *                 user: { $ref: '#/components/schemas/User' }
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
    deleteUser
);


export default router;
