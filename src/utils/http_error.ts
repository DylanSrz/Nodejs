// ======================================================
// ERROR HTTP
// ======================================================
//
// Error con un código de estado asociado.
//
// Permite que un controlador corte su ejecución sin tener
// que armar la respuesta a mano:
//
//   throw new HttpError(404, 'Ciudad no encontrada.')
//
// Express 5 captura las promesas rechazadas de los
// controladores async y las envía al middleware de error,
// que es quien traduce este objeto a una respuesta JSON.
//
// Flujo:
//
//   controlador
//       |
//       | throw new HttpError(...)
//       v
//   Express 5
//       |
//       v
//   errorHandler  ->  res.status(...).json({ message })
//
// ======================================================

export class HttpError extends Error {

    // Código HTTP con el que se responderá.
    declare status: number;

    // Información adicional opcional (por ejemplo, qué
    // registros dependientes impiden un borrado).
    declare details: unknown;

    constructor(status: number, message: string, details?: unknown) {

        super(message);

        this.name = "HttpError";
        this.status = status;
        this.details = details;

        // Mantiene limpio el stack trace en V8.
        Error.captureStackTrace?.(this, HttpError);
    }
}


// Atajos para los casos más frecuentes.

export const badRequest = (message: string, details?: unknown) =>
    new HttpError(400, message, details);

export const unauthorized = (message: string) =>
    new HttpError(401, message);

export const forbidden = (message: string) =>
    new HttpError(403, message);

export const notFound = (message: string) =>
    new HttpError(404, message);

export const conflict = (message: string, details?: unknown) =>
    new HttpError(409, message, details);
