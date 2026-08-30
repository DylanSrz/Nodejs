import express from 'express'
import {loginController } from '../controllers/auth.controller.js'

const router = express.Router()

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Inicia sesión y devuelve un JWT
 *     description: |
 *       Verifica el correo, compara la contraseña con bcrypt y resuelve el rol
 *       asociado al usuario. Si todo es correcto firma un JWT con el payload
 *       `{ id, role }` y una expiración de 1 hora.
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
 *       401:
 *         description: Error inesperado al procesar las credenciales.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Credential invalidddd
 *       403:
 *         description: El correo no existe, la contraseña no es válida o el rol no existe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               correoInexistente:
 *                 value:
 *                   message: correo no existe.
 *               passwordInvalida:
 *                 value:
 *                   message: password no es valida.
 *               rolInexistente:
 *                 value:
 *                   message: Rol no existe
 */
// para hacer login y obtener el JWT
router.post('/login', loginController)

export default router
