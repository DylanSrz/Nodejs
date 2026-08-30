import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { verifyToken, checkRole } from '../../../src/middlewares/verifyToken.js';
import {
    mockRequest,
    mockResponse,
    mockNext,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


const SECRETO = 'secreto-solo-para-pruebas';

// Los tokens se firman de verdad con jsonwebtoken: así se
// prueba el middleware contra la misma librería que usa en
// producción, no contra un doble.
const firmar = (payload: object, options: jwt.SignOptions = {}) =>
    jwt.sign(payload, SECRETO, { expiresIn: '1h', ...options });


describe('verifyToken', () => {

    const originalSecret = process.env.JWT_SECRET;

    beforeEach(() => {
        process.env.JWT_SECRET = SECRETO;
    });

    afterAll(() => {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }
    });


    it('deja pasar un token válido', () => {

        const req = mockRequest({
            headers: { authorization: `Bearer ${firmar({ id: 'u1', role: 'admin' })}` },
        });
        const next = mockNext();

        verifyToken(req, mockResponse(), next);

        expect(next).toHaveBeenCalled();
    });


    it('deja el payload en req.user', () => {

        const req = mockRequest({
            headers: { authorization: `Bearer ${firmar({ id: 'u1', role: 'admin' })}` },
        });

        verifyToken(req, mockResponse(), mockNext());

        expect(req.user).toMatchObject({ id: 'u1', role: 'admin' });
    });


    it('responde 401 si no llega el encabezado', () => {

        const res = mockResponse();

        verifyToken(mockRequest(), res, mockNext());

        expect(statusOf(res)).toBe(401);
    });


    it('responde 401 si el encabezado no empieza por "Bearer "', () => {

        const res = mockResponse();

        verifyToken(
            mockRequest({ headers: { authorization: 'Basic abc123' } }),
            res,
            mockNext()
        );

        expect(statusOf(res)).toBe(401);
    });


    it('responde 401 si viene "Bearer" sin token', () => {

        const res = mockResponse();

        verifyToken(mockRequest({ headers: { authorization: 'Bearer ' } }), res, mockNext());

        expect(statusOf(res)).toBe(401);
    });


    it('responde 403 ante un token con firma inválida', () => {

        const ajeno = jwt.sign({ id: 'u1', role: 'admin' }, 'otro-secreto');
        const res = mockResponse();
        const next = mockNext();

        verifyToken(mockRequest({ headers: { authorization: `Bearer ${ajeno}` } }), res, next);

        expect(statusOf(res)).toBe(403);
        expect(next).not.toHaveBeenCalled();
    });


    it('responde 403 ante un token expirado', () => {

        const vencido = firmar({ id: 'u1', role: 'admin' }, { expiresIn: '-1s' });
        const res = mockResponse();

        verifyToken(mockRequest({ headers: { authorization: `Bearer ${vencido}` } }), res, mockNext());

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('Token not valid or expired');
    });


    it('responde 403 ante un token que no es un JWT', () => {

        const res = mockResponse();

        verifyToken(
            mockRequest({ headers: { authorization: 'Bearer esto-no-es-un-jwt' } }),
            res,
            mockNext()
        );

        expect(statusOf(res)).toBe(403);
    });


    it('responde 500 si falta JWT_SECRET en el entorno', () => {

        // Es un fallo de configuración del servidor, no de la
        // petición: no debe confundirse con un 401.
        delete process.env.JWT_SECRET;

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const res = mockResponse();

        verifyToken(
            mockRequest({ headers: { authorization: `Bearer ${firmar({ id: 'u1' })}` } }),
            res,
            mockNext()
        );

        expect(statusOf(res)).toBe(500);
        expect(consoleError).toHaveBeenCalled();
    });
});


describe('checkRole', () => {

    const conRol = (role: string) => mockRequest({ user: { id: 'u1', role } } as never);


    it('deja pasar al rol permitido', () => {

        const next = mockNext();

        checkRole('admin')(conRol('admin'), mockResponse(), next);

        expect(next).toHaveBeenCalled();
    });


    it('acepta cualquiera de los roles de la lista', () => {

        const next = mockNext();

        checkRole('admin', 'team leader')(conRol('team leader'), mockResponse(), next);

        expect(next).toHaveBeenCalled();
    });


    it('responde 403 a un rol no permitido', () => {

        const res = mockResponse();
        const next = mockNext();

        checkRole('admin')(conRol('coder'), res, next);

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('No tiene permiso para esta acción.');
        expect(next).not.toHaveBeenCalled();
    });


    it('responde 403 si req.user no está cargado', () => {

        // Ocurriría si se montara sin verifyToken delante.
        const res = mockResponse();

        checkRole('admin')(mockRequest(), res, mockNext());

        expect(statusOf(res)).toBe(403);
    });


    it('distingue mayúsculas: "Admin" no es "admin"', () => {

        const res = mockResponse();

        checkRole('admin')(conRol('Admin'), res, mockNext());

        expect(statusOf(res)).toBe(403);
    });


    it('sin roles permitidos no deja pasar a nadie', () => {

        const res = mockResponse();

        checkRole()(conRol('admin'), res, mockNext());

        expect(statusOf(res)).toBe(403);
    });
});
