import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    
    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({message: ' Token no proporcionado'})
    }

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: 'Token not provied'});
    }

    try {
        const secretKey = process.env.JWT_SECRET
        const payload = jwt.verify(token, secretKey!);
        (req as any).user = payload
        next();
    } catch(error) {
        return res.status(403).json({message: 'Token not valid or expired'});
    }
}

// validar que el token tiene el rol solicitado.
export const checkRole = (...Roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user

        if (!user || !Roles.includes(user.role)) {
            return res.status(403).json({message: 'No tiene permiso para esta acción.'})
        }
        next()
    }
}
