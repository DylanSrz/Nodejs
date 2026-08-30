import type { NextFunction, Request, Response } from "express";
import {
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError,
    DatabaseError,
} from "sequelize";
import { HttpError } from "../utils/http_error.js";


// ======================================================
// RUTA NO ENCONTRADA
// ======================================================
//
// Se monta después de todos los routers.
//
// Si una petición llega hasta aquí significa que ninguna
// ruta coincidió, así que respondemos 404 en JSON en lugar
// del HTML por defecto de Express.
//
export function notFoundHandler(req: Request, res: Response) {

    res.status(404).json({
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
}


// ======================================================
// MANEJADOR GLOBAL DE ERRORES
// ======================================================
//
// Express identifica un middleware de error por su firma
// de CUATRO parámetros. El parámetro "next" debe estar
// declarado aunque no se use.
//
// Aquí centralizamos la traducción de un error a una
// respuesta HTTP:
//
//   HttpError               -> el estado que traiga
//   UniqueConstraintError   -> 409
//   ForeignKeyConstraintError -> 409
//   ValidationError         -> 400
//   cualquier otro          -> 500
//
// Gracias a esto los controladores no necesitan repetir
// bloques try/catch para responder errores.
//
export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {

    // Si la respuesta ya empezó a enviarse, delegamos en el
    // manejador por defecto de Express para que cierre la
    // conexión correctamente.
    if (res.headersSent) {
        return next(error);
    }

    console.error(`[${req.method} ${req.originalUrl}]`, error);


    // ==================================================
    // ERRORES LANZADOS A PROPÓSITO
    // ==================================================

    if (error instanceof HttpError) {

        return res.status(error.status).json(
            error.details === undefined
                ? { message: error.message }
                : { message: error.message, details: error.details }
        );
    }


    // ==================================================
    // VALOR DUPLICADO EN UNA COLUMNA ÚNICA
    // ==================================================

    if (error instanceof UniqueConstraintError) {

        const fields = Object.keys(error.fields ?? {});

        return res.status(409).json({
            message: "Ya existe un registro con ese valor único.",
            fields,
        });
    }


    // ==================================================
    // LLAVE FORÁNEA INVÁLIDA
    // ==================================================
    //
    // Ocurre cuando se envía un id que no existe en la
    // tabla referenciada, o cuando se intenta borrar un
    // registro del que todavía dependen otros.
    //
    if (error instanceof ForeignKeyConstraintError) {

        return res.status(409).json({
            message:
                "La operación viola una relación entre tablas: " +
                "el registro referenciado no existe o todavía tiene dependencias.",
            table: error.table,
        });
    }


    // ==================================================
    // VALIDACIÓN DEL MODELO
    // ==================================================
    //
    // Se dispara con las reglas declaradas en los modelos,
    // por ejemplo isIn, isEmail o min.
    //
    if (error instanceof ValidationError) {

        return res.status(400).json({
            message: "Los datos no cumplen las reglas del modelo.",
            errors: error.errors.map((item) => ({
                field: item.path,
                message: item.message,
            })),
        });
    }


    // ==================================================
    // ERROR DE POSTGRESQL
    // ==================================================
    //
    // Un uuid mal formado, por ejemplo, llega hasta aquí.
    //
    if (error instanceof DatabaseError) {

        return res.status(400).json({
            message: "La base de datos rechazó la consulta.",
        });
    }


    // ==================================================
    // CUALQUIER OTRO ERROR
    // ==================================================

    return res.status(500).json({
        message: "Error interno del servidor.",
    });
}
