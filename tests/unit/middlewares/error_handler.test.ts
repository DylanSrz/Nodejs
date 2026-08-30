import { jest } from '@jest/globals';
import {
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError,
    ValidationErrorItem,
    DatabaseError,
} from 'sequelize';
import {
    errorHandler,
    notFoundHandler,
} from '../../../src/middlewares/error_handler.js';
import { HttpError, conflict, notFound } from '../../../src/utils/http_error.js';
import {
    mockRequest,
    mockResponse,
    mockNext,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


// El manejador registra cada error por consola; en las
// pruebas se silencia para no ensuciar la salida.
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});


describe('notFoundHandler', () => {

    it('responde 404', () => {

        const res = mockResponse();

        notFoundHandler(mockRequest(), res);

        expect(statusOf(res)).toBe(404);
    });


    it('indica el método y la ruta que no existen', () => {

        const res = mockResponse();

        notFoundHandler(
            mockRequest({ method: 'POST', originalUrl: '/no-existe' }),
            res
        );

        expect(bodyOf(res).message).toBe('Ruta no encontrada: POST /no-existe');
    });
});


describe('errorHandler', () => {

    describe('HttpError', () => {

        it('respeta el código que trae el error', () => {

            const res = mockResponse();

            errorHandler(notFound('La ciudad no encontrada.'), mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(404);
            expect(bodyOf(res)).toEqual({ message: 'La ciudad no encontrada.' });
        });


        it('omite details cuando no los hay', () => {

            const res = mockResponse();

            errorHandler(new HttpError(400, 'mal'), mockRequest(), res, mockNext());

            expect(bodyOf(res)).not.toHaveProperty('details');
        });


        it('incluye details cuando los hay', () => {

            const res = mockResponse();
            const detalle = [{ label: 'sedes', count: 2 }];

            errorHandler(conflict('bloqueado', detalle), mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(409);
            expect(bodyOf(res).details).toEqual(detalle);
        });
    });


    describe('errores de Sequelize', () => {

        it('traduce UniqueConstraintError a 409', () => {

            const error = new UniqueConstraintError({
                fields: { email: 'a@b.co' },
            });
            const res = mockResponse();

            errorHandler(error, mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(409);
            expect(bodyOf(res).fields).toEqual(['email']);
        });


        it('traduce ForeignKeyConstraintError a 409', () => {

            const error = new ForeignKeyConstraintError({ table: 'clan' });
            const res = mockResponse();

            errorHandler(error, mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(409);
            expect(bodyOf(res).table).toBe('clan');
        });


        it('traduce ValidationError a 400 con el detalle por campo', () => {

            // Solo se rellenan los campos que lee el manejador.
            const error = new ValidationError('falló', [
                { path: 'name', message: 'name debe ser am o pm' } as ValidationErrorItem,
            ]);
            const res = mockResponse();

            errorHandler(error, mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(400);
            expect(bodyOf(res).errors[0]).toMatchObject({ field: 'name' });
        });


        it('traduce DatabaseError a 400', () => {

            // Un uuid mal formado que llega hasta PostgreSQL
            // acaba aquí.
            const error = new DatabaseError({
                message: 'invalid input syntax for type uuid',
                sql: 'SELECT 1',
            } as never);
            const res = mockResponse();

            errorHandler(error, mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(400);
        });
    });


    describe('errores no previstos', () => {

        it('responde 500 ante un Error cualquiera', () => {

            const res = mockResponse();

            errorHandler(new Error('algo se rompió'), mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(500);
            expect(bodyOf(res)).toEqual({ message: 'Error interno del servidor.' });
        });


        it('no filtra el mensaje interno al cliente', () => {

            const res = mockResponse();

            errorHandler(new Error('password=admin1234'), mockRequest(), res, mockNext());

            expect(JSON.stringify(bodyOf(res))).not.toContain('admin1234');
        });


        it('responde 500 ante un valor que no es un Error', () => {

            const res = mockResponse();

            errorHandler('un string suelto', mockRequest(), res, mockNext());

            expect(statusOf(res)).toBe(500);
        });
    });


    describe('respuesta ya iniciada', () => {

        it('delega en Express en lugar de responder dos veces', () => {

            const res = mockResponse();
            res.headersSent = true;

            const next = mockNext();
            const error = new Error('tarde');

            errorHandler(error, mockRequest(), res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
        });
    });


    it('registra el error con el método y la ruta', () => {

        const consoleError = jest.spyOn(console, 'error');

        errorHandler(
            new Error('x'),
            mockRequest({ method: 'DELETE', originalUrl: '/cities/1' }),
            mockResponse(),
            mockNext()
        );

        expect(consoleError).toHaveBeenCalledWith(
            '[DELETE /cities/1]',
            expect.any(Error)
        );
    });
});
