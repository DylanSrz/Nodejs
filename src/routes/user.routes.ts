import express from 'express';
import { createUser, getUser, updateStatus } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validate_request.js';
import { createUserSchema } from '../dto/user.schema.js';
import { checkRole, verifyToken} from '../middlewares/verifyToken.js';

const router = express.Router();

/**
 * @openapi
 * /user:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista todos los usuarios
 *     security: []
 *     responses:
 *       200:
 *         description: Usuarios encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuarios encontrados.
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// GET // listar todos los usuarios...
router.get('/', getUser);

/**
 * @openapi
 * /user:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crea un usuario con su dirección e identificación
 *     description: |
 *       Inserta la dirección, la identificación y el usuario dentro de una
 *       única transacción: si algo falla se revierte todo.
 *
 *       La contraseña llega en el campo `password` y se persiste hasheada
 *       con bcrypt en `password_hash` mediante el hook `beforeCreate` del
 *       modelo `User`.
 *
 *       Cadena de middlewares:
 *       `validateRequest(createUserSchema)` → `verifyToken` → `checkRole("admin")`.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado con exito
 *                 newUser:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: El cuerpo no supera la validación de Zod.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: El número de identificación o el correo ya están registrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               identificacionDuplicada:
 *                 value:
 *                   message: El número de identificación ya existe.
 *               emailDuplicado:
 *                 value:
 *                   message: El correo electrónico ya está registrado.
 */
// POST // crear un nuevo usuario...
router.post('/', validateRequest(createUserSchema), verifyToken, checkRole("admin"),createUser)

/**
 * @openapi
 * /user/status/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Alterna el estado activo de un usuario
 *     description: Invierte el valor del campo `is_active` del usuario indicado.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del usuario.
 *     responses:
 *       201:
 *         description: Estado actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: User status updated to false
 *       404:
 *         description: El usuario no existe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: User not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// PUT // cambiar el estado de un usuario (is_active)
router.put('/status/:id', updateStatus)

export default router;
