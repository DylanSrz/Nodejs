import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validateRequest = (schema: ZodType) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body)

        if (!result.success) {

            return res.status(400).json({
                message: 'datos invalidos o incompletos',
                errors: result.error.issues
            })

        }

        req.body = result.data

        next()

    }
}