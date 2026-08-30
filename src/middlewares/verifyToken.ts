import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'


// Contenido que el login guarda dentro del token.
//
// Ver src/controllers/auth.controller.ts:
//
//   jwt.sign({ id: user.id, role: role.name }, ...)
//
export interface AuthPayload {
    id: string;
    role: string;
    iat?: number;
    exp?: number;
}


// ======================================================
// VERIFICAR EL TOKEN
// ======================================================
//
// Exige el encabezado:
//
//   Authorization: Bearer <token>
//
// Si el token es válido, deja el payload en req.user para
// que los middlewares y controladores siguientes sepan
// quién está haciendo la petición.
//
//   401  ->  no llegó token
//   403  ->  el token es inválido o ya expiró
//
export function verifyToken(req: Request, res: Response, next: NextFunction) {

    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({message: ' Token no proporcionado'})
    }

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: 'Token not provied'});
    }

    const secretKey = process.env.JWT_SECRET

    // Sin secreto no se puede verificar nada: es un fallo de
    // configuración del servidor, no de la petición.
    if (!secretKey) {
        console.error('JWT_SECRET no está definido en las variables de entorno.')
        return res.status(500).json({message: 'Error interno del servidor.'})
    }

    try {
        const payload = jwt.verify(token, secretKey) as AuthPayload
        req.user = payload
        next();
    } catch(error) {
        return res.status(403).json({message: 'Token not valid or expired'});
    }
}


// ======================================================
// VERIFICAR EL ROL
// ======================================================
//
// Se monta siempre DESPUÉS de verifyToken, porque depende
// de que req.user ya esté cargado.
//
// Uso:
//
//   router.post('/', verifyToken, checkRole('admin'), crear)
//   router.put('/:id', verifyToken, checkRole('admin', 'team leader'), editar)
//
export const checkRole = (...allowedRoles: string[]) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const user = req.user

        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({message: 'No tiene permiso para esta acción.'})
        }
        next()
    }
}
