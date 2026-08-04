import type { NextFunction, Request, Response } from "express";

export function ValidateToken(req: Request, res: Response, next:NextFunction){
    if(!req.headers.authorization){
        return res.status(401).json({message: 'unauthorized'});
    }

    next();
}