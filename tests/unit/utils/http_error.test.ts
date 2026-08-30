import {
    HttpError,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    conflict,
} from '../../../src/utils/http_error.js';


describe('HttpError', () => {

    it('guarda el estado y el mensaje recibidos', () => {

        const error = new HttpError(418, 'soy una tetera');

        expect(error.status).toBe(418);
        expect(error.message).toBe('soy una tetera');
        expect(error.name).toBe('HttpError');
    });


    it('es un Error, para que Express lo capture', () => {

        expect(new HttpError(500, 'x')).toBeInstanceOf(Error);
    });


    it('deja details en undefined cuando no se envía', () => {

        expect(new HttpError(404, 'x').details).toBeUndefined();
    });


    it('conserva los details cuando se envían', () => {

        const details = [{ label: 'sedes', count: 2 }];

        expect(new HttpError(409, 'x', details).details).toEqual(details);
    });
});


describe('atajos por código', () => {

    // Cada atajo debe producir su código, ni uno más.
    it.each([
        ['badRequest', badRequest, 400],
        ['unauthorized', unauthorized, 401],
        ['forbidden', forbidden, 403],
        ['notFound', notFound, 404],
        ['conflict', conflict, 409],
    ])('%s devuelve un HttpError %i', (_nombre, atajo, esperado) => {

        const error = (atajo as (m: string) => HttpError)('mensaje');

        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(esperado);
        expect(error.message).toBe('mensaje');
    });


    it('badRequest y conflict aceptan details', () => {

        expect(badRequest('x', { campo: 'email' }).details).toEqual({ campo: 'email' });
        expect(conflict('x', [1, 2]).details).toEqual([1, 2]);
    });
});
