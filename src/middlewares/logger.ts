import type { NextFunction, Request, Response } from "express";

export function Logger(req: Request, res: Response, next: NextFunction){

    console.log(`${req.method} - ${req.url}`);

    next();

}