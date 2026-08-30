import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";


// ======================================================
// VALIDACIÓN DEL CUERPO DE LA PETICIÓN
// ======================================================
//
// Recibe un esquema de Zod y devuelve un middleware.
//
// Si el cuerpo no cumple el esquema responde 400 con la
// lista de problemas que reportó Zod.
//
// Si lo cumple, reemplaza req.body por los datos ya
// parseados: a partir de ese punto el controlador trabaja
// con valores validados y con el tipo correcto.
//
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


// ======================================================
// VALIDACIÓN DE LOS PARÁMETROS DE RUTA
// ======================================================
//
// Comprueba que los valores de req.params cumplan el
// esquema recibido.
//
// El caso típico es el ":id" de las rutas: si llega algo
// que no es un uuid, respondemos 400 en lugar de dejar que
// PostgreSQL falle al comparar el tipo.
//
// A diferencia de validateRequest, aquí NO se reasigna
// req.params: en Express 5 conviene tratarlo como solo
// lectura y los parámetros siempre son cadenas.
//
export const validateParams = (schema: ZodType) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.params)

        if (!result.success) {

            return res.status(400).json({
                message: 'parametros de ruta invalidos',
                errors: result.error.issues
            })
        }

        next()
    }
}
