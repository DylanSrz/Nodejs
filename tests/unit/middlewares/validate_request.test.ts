import z from 'zod';
import {
    validateRequest,
    validateParams,
} from '../../../src/middlewares/validate_request.js';
import {
    mockRequest,
    mockResponse,
    mockNext,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


const schema = z.object({
    name: z.string().min(3, 'name debe tener al menos 3 caracteres.'),
    age: z.number().int(),
});


describe('validateRequest', () => {

    it('deja pasar un cuerpo válido', () => {

        const req = mockRequest({ body: { name: 'juan', age: 30 } });
        const res = mockResponse();
        const next = mockNext();

        validateRequest(schema)(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });


    it('responde 400 ante un cuerpo inválido', () => {

        const req = mockRequest({ body: { name: 'ab' } });
        const res = mockResponse();
        const next = mockNext();

        validateRequest(schema)(req, res, next);

        expect(statusOf(res)).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });


    it('devuelve la lista de problemas que reportó Zod', () => {

        const req = mockRequest({ body: { name: 'ab', age: 'treinta' } });
        const res = mockResponse();

        validateRequest(schema)(req, res, mockNext());

        const cuerpo = bodyOf(res);

        expect(cuerpo.message).toBe('datos invalidos o incompletos');
        expect(Array.isArray(cuerpo.errors)).toBe(true);
        expect(cuerpo.errors.map((e: any) => e.path[0]))
            .toEqual(expect.arrayContaining(['name', 'age']));
    });


    it('reemplaza req.body por los datos ya parseados', () => {

        // A partir de aquí el controlador trabaja con valores
        // validados, no con lo que llegó en crudo.
        const req = mockRequest({ body: { name: 'juan', age: 30, sobra: 'x' } });

        validateRequest(schema)(req, mockResponse(), mockNext());

        expect(req.body).toEqual({ name: 'juan', age: 30 });
        expect(req.body).not.toHaveProperty('sobra');
    });


    it('trata un cuerpo ausente como inválido', () => {

        const req = mockRequest({ body: undefined });
        const res = mockResponse();

        validateRequest(schema)(req, res, mockNext());

        expect(statusOf(res)).toBe(400);
    });
});


describe('validateParams', () => {

    const idSchema = z.object({
        id: z.uuid('El parámetro id debe ser un uuid válido.'),
    });

    const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';


    it('deja pasar un parámetro válido', () => {

        const req = mockRequest({ params: { id: UUID } });
        const next = mockNext();

        validateParams(idSchema)(req, mockResponse(), next);

        expect(next).toHaveBeenCalled();
    });


    it('responde 400 cuando el id no es un uuid', () => {

        const res = mockResponse();
        const next = mockNext();

        validateParams(idSchema)(mockRequest({ params: { id: 'x' } }), res, next);

        expect(statusOf(res)).toBe(400);
        expect(bodyOf(res).message).toBe('parametros de ruta invalidos');
        expect(next).not.toHaveBeenCalled();
    });


    it('no reasigna req.params', () => {

        // En Express 5 conviene tratarlos como solo lectura.
        const params = { id: UUID };
        const req = mockRequest({ params });

        validateParams(idSchema)(req, mockResponse(), mockNext());

        expect(req.params).toBe(params);
    });


    it('valida claves compuestas', () => {

        const compuesto = z.object({ clan_id: z.uuid(), coder_id: z.uuid() });
        const res = mockResponse();

        validateParams(compuesto)(
            mockRequest({ params: { clan_id: UUID, coder_id: 'malo' } }),
            res,
            mockNext()
        );

        expect(statusOf(res)).toBe(400);
    });
});
