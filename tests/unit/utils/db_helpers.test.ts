import { jest } from '@jest/globals';
import {
    findByPkOrFail,
    ensureNoDependencies,
    ensureUniqueValue,
} from '../../../src/utils/db_helpers.js';
import { HttpError } from '../../../src/utils/http_error.js';


// Estas utilidades reciben el modelo como parámetro, así que
// no hace falta interceptar módulos: basta con pasarles un
// doble que se comporte como un modelo de Sequelize.

const modelWith = (overrides: Record<string, unknown>) =>
    overrides as never;


describe('findByPkOrFail', () => {

    it('devuelve el registro cuando existe', async () => {

        const registro = { id: 'abc', name: 'medellín' };

        const model = modelWith({
            findByPk: jest.fn(async () => registro),
        });

        await expect(findByPkOrFail(model, 'abc', 'La ciudad'))
            .resolves.toBe(registro);
    });


    it('consulta por el id recibido', async () => {

        const findByPk = jest.fn(async () => ({ id: 'abc' }));

        await findByPkOrFail(modelWith({ findByPk }), 'abc', 'La ciudad');

        expect(findByPk).toHaveBeenCalledWith('abc');
    });


    it('lanza 404 cuando no existe', async () => {

        const model = modelWith({ findByPk: jest.fn(async () => null) });

        await expect(findByPkOrFail(model, 'abc', 'La ciudad'))
            .rejects.toMatchObject({ status: 404 });
    });


    it('usa la etiqueta recibida en el mensaje', async () => {

        const model = modelWith({ findByPk: jest.fn(async () => null) });

        await expect(findByPkOrFail(model, 'abc', 'El salón'))
            .rejects.toThrow('El salón no encontrado.');
    });
});


describe('ensureNoDependencies', () => {

    it('no lanza nada cuando ninguna tabla depende del registro', async () => {

        const checks = [
            { model: modelWith({ count: jest.fn(async () => 0) }), where: {}, label: 'sedes' },
            { model: modelWith({ count: jest.fn(async () => 0) }), where: {}, label: 'direcciones' },
        ];

        await expect(ensureNoDependencies('La ciudad', checks))
            .resolves.toBeUndefined();
    });


    it('lanza 409 cuando alguna tabla tiene dependencias', async () => {

        const checks = [
            { model: modelWith({ count: jest.fn(async () => 3) }), where: {}, label: 'sedes' },
        ];

        await expect(ensureNoDependencies('La ciudad', checks))
            .rejects.toMatchObject({ status: 409 });
    });


    it('detalla qué tablas bloquean y con cuántas filas', async () => {

        const checks = [
            { model: modelWith({ count: jest.fn(async () => 3) }), where: {}, label: 'sedes' },
            { model: modelWith({ count: jest.fn(async () => 0) }), where: {}, label: 'salones' },
            { model: modelWith({ count: jest.fn(async () => 1) }), where: {}, label: 'clanes' },
        ];

        // Solo deben aparecer las que realmente tienen filas.
        await expect(ensureNoDependencies('La ciudad', checks)).rejects.toMatchObject({
            details: [
                { label: 'sedes', count: 3 },
                { label: 'clanes', count: 1 },
            ],
        });
    });


    it('nombra el sujeto en el mensaje', async () => {

        const checks = [
            { model: modelWith({ count: jest.fn(async () => 1) }), where: {}, label: 'x' },
        ];

        await expect(ensureNoDependencies('El salón', checks))
            .rejects.toThrow('El salón no se puede eliminar porque tiene registros asociados.');
    });


    it('traslada el where a la consulta de conteo', async () => {

        const count = jest.fn(async () => 0);
        const where = { city_id: 'abc' };

        await ensureNoDependencies('La ciudad', [
            { model: modelWith({ count }), where, label: 'sedes' },
        ]);

        expect(count).toHaveBeenCalledWith({ where });
    });


    it('acepta una lista vacía de comprobaciones', async () => {

        await expect(ensureNoDependencies('X', [])).resolves.toBeUndefined();
    });
});


describe('ensureUniqueValue', () => {

    it('no lanza nada cuando el valor está libre', async () => {

        const model = modelWith({ findOne: jest.fn(async () => null) });

        await expect(ensureUniqueValue(model, { email: 'a@b.c' }, 'duplicado'))
            .resolves.toBeUndefined();
    });


    it('lanza 409 cuando el valor ya existe', async () => {

        const model = modelWith({ findOne: jest.fn(async () => ({ id: 'x' })) });

        await expect(ensureUniqueValue(model, { email: 'a@b.c' }, 'El correo ya existe.'))
            .rejects.toBeInstanceOf(HttpError);
    });


    it('usa el mensaje recibido', async () => {

        const model = modelWith({ findOne: jest.fn(async () => ({ id: 'x' })) });

        await expect(ensureUniqueValue(model, {}, 'El correo ya existe.'))
            .rejects.toThrow('El correo ya existe.');
    });
});
