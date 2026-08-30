import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';


// ======================================================
// DOBLES DE EXPRESS
// ======================================================
//
// Los controladores y middlewares reciben (req, res, next).
//
// En una prueba unitaria no hay servidor HTTP, así que se
// les pasan estos objetos: guardan lo que se hizo sobre
// ellos para poder afirmarlo después.
//
// ======================================================


// Se declara como intersección y no como "interface ... extends":
// el status() de Express devuelve "this", y una interfaz que lo
// redefine para devolver MockResponse no sería compatible.
export type MockResponse = Response & {
    status: jest.Mock;
    json: jest.Mock;
};


/**
 * Petición de mentira.
 *
 * Trae ya vacíos los campos que suelen consultarse
 * (body, params, headers) para no repetirlos en cada prueba.
 */
export const mockRequest = (overrides: Partial<Request> = {}): Request => {

    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        method: 'GET',
        originalUrl: '/',
        ...overrides,
    } as unknown as Request;
};


/**
 * Respuesta de mentira.
 *
 * status() devuelve la propia respuesta para que el
 * encadenado habitual siga funcionando:
 *
 *     res.status(404).json({ ... })
 */
export const mockResponse = (): MockResponse => {

    const res = {} as Record<string, unknown>;

    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    res.headersSent = false;

    return res as unknown as MockResponse;
};


/** Siguiente middleware de la cadena. */
export const mockNext = (): NextFunction =>
    jest.fn() as unknown as NextFunction;


/**
 * Código de estado con el que se respondió.
 *
 * Atajo para no escribir res.status.mock.calls[0][0] en cada
 * afirmación.
 */
export const statusOf = (res: MockResponse): number | undefined =>
    res.status.mock.calls[0]?.[0] as number | undefined;


/** Cuerpo JSON con el que se respondió. */
export const bodyOf = (res: MockResponse): any =>
    res.json.mock.calls[0]?.[0];
