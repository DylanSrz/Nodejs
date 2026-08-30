import express from 'express'
import { loginController, meController } from '../controllers/auth.controller.js'
import { validateRequest } from '../middlewares/validate_request.js'
import { loginSchema } from '../dto/auth.schema.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Inicia sesión y devuelve un JWT
 *     description: |
 *       Verifica el correo, comprueba que el usuario esté activo, compara la
 *       contraseña con bcrypt y resuelve el rol asociado. Si todo es correcto
 *       firma un JWT con el payload `{ id, role }` y una expiración de 1 hora.
 *
 *       Este endpoint es público.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: Login exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         description: Credenciales inválidas, usuario inactivo o rol inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               correoInexistente:
 *                 value: { message: correo no existe. }
 *               usuarioInactivo:
 *                 value: { message: El usuario está inactivo. }
 *               passwordInvalida:
 *                 value: { message: password no es valida. }
 *               rolInexistente:
 *                 value: { message: Rol no existe }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
// para hacer login y obtener el JWT
router.post('/login', validateRequest(loginSchema), loginController)


/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Autenticación]
 *     summary: Devuelve el perfil del usuario autenticado
 *     description: |
 *       Resuelve el usuario a partir del id que viaja dentro del token, así que
 *       no hace falta conocer su uuid.
 *
 *       Sirve para comprobar rápidamente que un token sigue siendo válido y con
 *       qué rol.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Perfil del usuario autenticado. }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/me', verifyToken, meController)

export default router
