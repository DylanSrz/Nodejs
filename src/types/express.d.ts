import type { AuthPayload } from "../middlewares/verifyToken.js";


// ======================================================
// AMPLIACIÓN DE LOS TIPOS DE EXPRESS
// ======================================================
//
// verifyToken guarda el contenido del JWT en req.user.
//
// Express no conoce esa propiedad, así que la declaramos
// aquí. Gracias a esto los controladores pueden escribir:
//
//   req.user?.role
//
// con autocompletado y verificación de tipos, en lugar del
// casteo que se usaba antes:
//
//   (req as any).user
//
declare global {

    namespace Express {

        interface Request {
            user?: AuthPayload;
        }
    }
}

export {};
