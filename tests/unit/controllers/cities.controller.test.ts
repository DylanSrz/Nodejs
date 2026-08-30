import { jest } from '@jest/globals';
import {
    getCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
} from '../../../src/controllers/cities.controller.js';
import Cities from '../../../src/models/cities.model.js';
import Address_user from '../../../src/models/address_user.model.js';
import Campus from '../../../src/models/campus.model.js';
import {
    mockRequest,
    mockResponse,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


// Los cinco catálogos comparten el mismo patrón de
// controlador. Se prueba a fondo el de ciudades, que además
// es el único con dos tablas dependientes.

const instancia = (datos: Record<string, unknown>) => ({
    ...datos,
    update: jest.fn(async function (this: any, cambios: Record<string, unknown>) {
        Object.assign(this, cambios);
        return this;
    }),
    destroy: jest.fn(async () => undefined),
});


describe('getCities', () => {

    it('responde 200 con la lista', async () => {

        jest.spyOn(Cities, 'findAll')
            .mockResolvedValue([{ id: 'c1', name: 'medellín' }] as never);

        const res = mockResponse();
        await getCities(mockRequest(), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res)).toEqual({
            message: 'Ciudades encontradas.',
            cities: [{ id: 'c1', name: 'medellín' }],
        });
    });


    it('ordena por nombre', async () => {

        const findAll = jest.spyOn(Cities, 'findAll').mockResolvedValue([] as never);

        await getCities(mockRequest(), mockResponse());

        expect((findAll.mock.calls[0]?.[0] as any).order).toEqual([['name', 'ASC']]);
    });


    it('devuelve una lista vacía sin fallar', async () => {

        jest.spyOn(Cities, 'findAll').mockResolvedValue([] as never);

        const res = mockResponse();
        await getCities(mockRequest(), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).cities).toEqual([]);
    });
});


describe('getCityById', () => {

    it('responde 200 cuando existe', async () => {

        jest.spyOn(Cities, 'findByPk').mockResolvedValue({ id: 'c1' } as never);

        const res = mockResponse();
        await getCityById(mockRequest({ params: { id: 'c1' } }), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).city).toEqual({ id: 'c1' });
    });


    it('lanza 404 cuando no existe', async () => {

        jest.spyOn(Cities, 'findByPk').mockResolvedValue(null as never);

        await expect(
            getCityById(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });
});


describe('createCity', () => {

    it('responde 201 con la ciudad creada', async () => {

        jest.spyOn(Cities, 'create').mockResolvedValue({ id: 'c1', name: 'medellín' } as never);

        const res = mockResponse();
        await createCity(
            mockRequest({ body: { name: 'medellín', code_name: 'mde' } }),
            res
        );

        expect(statusOf(res)).toBe(201);
        expect(bodyOf(res).newCity).toEqual({ id: 'c1', name: 'medellín' });
    });


    it('pasa al modelo el cuerpo ya validado', async () => {

        const create = jest.spyOn(Cities, 'create').mockResolvedValue({ id: 'c1' } as never);

        await createCity(
            mockRequest({ body: { name: 'medellín', code_name: 'mde' } }),
            mockResponse()
        );

        expect(create).toHaveBeenCalledWith({ name: 'medellín', code_name: 'mde' });
    });


    it('deja subir el error de unicidad al manejador global', async () => {

        // El 409 por code_name duplicado lo traduce errorHandler
        // a partir del UniqueConstraintError de Sequelize.
        jest.spyOn(Cities, 'create')
            .mockRejectedValue(new Error('duplicate key') as never);

        await expect(
            createCity(mockRequest({ body: { name: 'x', code_name: 'y' } }), mockResponse())
        ).rejects.toThrow('duplicate key');
    });
});


describe('updateCity', () => {

    it('responde 200 y aplica los cambios', async () => {

        const ciudad = instancia({ id: 'c1', name: 'medellín' });
        jest.spyOn(Cities, 'findByPk').mockResolvedValue(ciudad as never);

        const res = mockResponse();
        await updateCity(
            mockRequest({ params: { id: 'c1' }, body: { name: 'medellín norte' } }),
            res
        );

        expect(statusOf(res)).toBe(200);
        expect(ciudad.update).toHaveBeenCalledWith({ name: 'medellín norte' });
    });


    it('lanza 404 si la ciudad no existe', async () => {

        jest.spyOn(Cities, 'findByPk').mockResolvedValue(null as never);

        await expect(
            updateCity(
                mockRequest({ params: { id: 'c1' }, body: { name: 'x' } }),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 404 });
    });
});


describe('deleteCity', () => {

    it('borra la ciudad cuando nada depende de ella', async () => {

        const ciudad = instancia({ id: 'c1' });
        jest.spyOn(Cities, 'findByPk').mockResolvedValue(ciudad as never);
        jest.spyOn(Address_user, 'count').mockResolvedValue(0 as never);
        jest.spyOn(Campus, 'count').mockResolvedValue(0 as never);

        const res = mockResponse();
        await deleteCity(mockRequest({ params: { id: 'c1' } }), res);

        expect(ciudad.destroy).toHaveBeenCalled();
        expect(statusOf(res)).toBe(200);
    });


    it('lanza 409 si tiene direcciones asociadas', async () => {

        const ciudad = instancia({ id: 'c1' });
        jest.spyOn(Cities, 'findByPk').mockResolvedValue(ciudad as never);
        jest.spyOn(Address_user, 'count').mockResolvedValue(3 as never);
        jest.spyOn(Campus, 'count').mockResolvedValue(0 as never);

        await expect(
            deleteCity(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({
            status: 409,
            details: [{ label: 'direcciones', count: 3 }],
        });

        expect(ciudad.destroy).not.toHaveBeenCalled();
    });


    it('detalla las dos tablas cuando ambas bloquean', async () => {

        jest.spyOn(Cities, 'findByPk').mockResolvedValue(instancia({ id: 'c1' }) as never);
        jest.spyOn(Address_user, 'count').mockResolvedValue(2 as never);
        jest.spyOn(Campus, 'count').mockResolvedValue(1 as never);

        await expect(
            deleteCity(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({
            details: [
                { label: 'direcciones', count: 2 },
                { label: 'sedes', count: 1 },
            ],
        });
    });


    it('cuenta los dependientes por el id de la ciudad', async () => {

        jest.spyOn(Cities, 'findByPk').mockResolvedValue(instancia({ id: 'c1' }) as never);
        const count = jest.spyOn(Address_user, 'count').mockResolvedValue(0 as never);
        jest.spyOn(Campus, 'count').mockResolvedValue(0 as never);

        await deleteCity(mockRequest({ params: { id: 'c1' } }), mockResponse());

        expect(count).toHaveBeenCalledWith({ where: { city_id: 'c1' } });
    });


    it('lanza 404 si la ciudad no existe', async () => {

        jest.spyOn(Cities, 'findByPk').mockResolvedValue(null as never);

        await expect(
            deleteCity(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });
});
