import { jest } from '@jest/globals';
import {
    getCoderClans,
    getCoderClanById,
    createCoderClan,
    updateCoderClan,
    deleteCoderClan,
} from '../../../src/controllers/coder_clan.controller.js';
import Coder_clan from '../../../src/models/coder_clan.model.js';
import Clan from '../../../src/models/clan.model.js';
import User from '../../../src/models/user.model.js';
import Roles from '../../../src/models/role.model.js';
import {
    mockRequest,
    mockResponse,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


const CLAN_ID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';
const CODER_ID = '9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d';

const admin = { id: 'admin-1', role: 'admin' };

const instancia = (datos: Record<string, unknown>) => ({
    ...datos,
    update: jest.fn(async function (this: any, cambios: Record<string, unknown>) {
        Object.assign(this, cambios);
        return this;
    }),
    destroy: jest.fn(async () => undefined),
});


/** Clan existente y coder válido: el camino feliz. */
const escenarioValido = () => {
    jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
    jest.spyOn(User, 'findByPk')
        .mockResolvedValue({ id: CODER_ID, role_id: 'rol-coder', is_active: true } as never);
    jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-coder' } as never);
    jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(null as never);
};


describe('getCoderClans', () => {

    it('responde 200 con las asignaciones', async () => {

        jest.spyOn(Coder_clan, 'findAll').mockResolvedValue([{ clan_id: CLAN_ID }] as never);

        const res = mockResponse();
        await getCoderClans(mockRequest(), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).coder_clans).toHaveLength(1);
    });


    it('trae el clan y el coder', async () => {

        const findAll = jest.spyOn(Coder_clan, 'findAll').mockResolvedValue([] as never);

        await getCoderClans(mockRequest(), mockResponse());

        const alias = (findAll.mock.calls[0]?.[0] as any).include.map((i: any) => i.as);

        expect(alias).toEqual(['clan', 'coder']);
    });
});


describe('getCoderClanById', () => {

    it('busca por la clave compuesta', async () => {

        const findOne = jest.spyOn(Coder_clan, 'findOne')
            .mockResolvedValue({ clan_id: CLAN_ID } as never);

        await getCoderClanById(
            mockRequest({ params: { clan_id: CLAN_ID, coder_id: CODER_ID } }),
            mockResponse()
        );

        expect((findOne.mock.calls[0]?.[0] as any).where)
            .toEqual({ clan_id: CLAN_ID, coder_id: CODER_ID });
    });


    it('responde 404 si la asignación no existe', async () => {

        jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(null as never);

        const res = mockResponse();
        await getCoderClanById(
            mockRequest({ params: { clan_id: CLAN_ID, coder_id: CODER_ID } }),
            res
        );

        expect(statusOf(res)).toBe(404);
    });
});


describe('createCoderClan', () => {

    const cuerpo = { clan_id: CLAN_ID, coder_id: CODER_ID, start_date: '2026-02-01' };


    it('responde 201 cuando todo es correcto', async () => {

        escenarioValido();
        jest.spyOn(Coder_clan, 'create').mockResolvedValue({ clan_id: CLAN_ID } as never);

        const res = mockResponse();
        await createCoderClan(mockRequest({ body: { ...cuerpo }, user: admin } as never), res);

        expect(statusOf(res)).toBe(201);
    });


    it('guarda end_date como null cuando no se envía', async () => {

        escenarioValido();
        const create = jest.spyOn(Coder_clan, 'create')
            .mockResolvedValue({ clan_id: CLAN_ID } as never);

        await createCoderClan(
            mockRequest({ body: { ...cuerpo }, user: admin } as never),
            mockResponse()
        );

        expect((create.mock.calls[0]?.[0] as any).end_date).toBeNull();
    });


    it('lanza 404 si el clan no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue(null as never);

        await expect(
            createCoderClan(
                mockRequest({ body: { ...cuerpo }, user: admin } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 404 });
    });


    it('bloquea a un team leader sobre un clan ajeno', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);

        await expect(
            createCoderClan(
                mockRequest({
                    body: { ...cuerpo },
                    user: { id: 'tl-9', role: 'team leader' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 403 });
    });


    it('permite al team leader asignar coders a su propio clan', async () => {

        escenarioValido();
        jest.spyOn(Coder_clan, 'create').mockResolvedValue({ clan_id: CLAN_ID } as never);

        const res = mockResponse();
        await createCoderClan(
            mockRequest({
                body: { ...cuerpo },
                user: { id: 'tl-1', role: 'team leader' },
            } as never),
            res
        );

        expect(statusOf(res)).toBe(201);
    });


    it('lanza 404 si el coder no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        await expect(
            createCoderClan(
                mockRequest({ body: { ...cuerpo }, user: admin } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 404 });
    });


    it('responde 403 si el usuario no tiene rol coder', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(User, 'findByPk')
            .mockResolvedValue({ id: CODER_ID, role_id: 'rol-tl', is_active: true } as never);
        jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-coder' } as never);

        const res = mockResponse();
        await createCoderClan(mockRequest({ body: { ...cuerpo }, user: admin } as never), res);

        expect(statusOf(res)).toBe(403);
        expect(bodyOf(res).message).toBe('El usuario indicado no tiene el rol coder.');
    });


    it('lanza 409 si el coder está inactivo', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(User, 'findByPk')
            .mockResolvedValue({ id: CODER_ID, role_id: 'rol-coder', is_active: false } as never);
        jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-coder' } as never);

        await expect(
            createCoderClan(
                mockRequest({ body: { ...cuerpo }, user: admin } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 409 });
    });


    it('lanza 409 si esa pareja ya está registrada', async () => {

        escenarioValido();
        jest.spyOn(Coder_clan, 'findOne')
            .mockResolvedValue({ clan_id: CLAN_ID, coder_id: CODER_ID } as never);

        await expect(
            createCoderClan(
                mockRequest({ body: { ...cuerpo }, user: admin } as never),
                mockResponse()
            )
        ).rejects.toThrow('Ese coder ya está asignado a este clan.');
    });
});


describe('updateCoderClan', () => {

    const params = { clan_id: CLAN_ID, coder_id: CODER_ID };


    it('responde 200 y actualiza las fechas', async () => {

        const asignacion = instancia({
            clan_id: CLAN_ID, coder_id: CODER_ID,
            start_date: '2026-02-01', end_date: null,
        });

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(asignacion as never);

        const res = mockResponse();
        await updateCoderClan(
            mockRequest({ params, body: { end_date: '2026-11-30' }, user: admin } as never),
            res
        );

        expect(statusOf(res)).toBe(200);
        expect(asignacion.update).toHaveBeenCalledWith({ end_date: '2026-11-30' });
    });


    it('compara la fecha nueva contra la que ya estaba guardada', async () => {

        // Solo llega end_date, así que start_date sale del registro.
        const asignacion = instancia({
            clan_id: CLAN_ID, coder_id: CODER_ID,
            start_date: '2026-05-01', end_date: null,
        });

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(asignacion as never);

        await expect(
            updateCoderClan(
                mockRequest({ params, body: { end_date: '2026-01-01' }, user: admin } as never),
                mockResponse()
            )
        ).rejects.toThrow('end_date no puede ser anterior a start_date.');

        expect(asignacion.update).not.toHaveBeenCalled();
    });


    it('lanza 404 si la asignación no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(null as never);

        await expect(
            updateCoderClan(
                mockRequest({ params, body: { end_date: '2026-11-30' }, user: admin } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 404 });
    });


    it('bloquea a un team leader sobre un clan ajeno', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);

        await expect(
            updateCoderClan(
                mockRequest({
                    params, body: { end_date: '2026-11-30' },
                    user: { id: 'tl-9', role: 'team leader' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 403 });
    });
});


describe('deleteCoderClan', () => {

    const params = { clan_id: CLAN_ID, coder_id: CODER_ID };


    it('retira al coder del clan', async () => {

        const asignacion = instancia({ clan_id: CLAN_ID, coder_id: CODER_ID });

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(asignacion as never);

        const res = mockResponse();
        await deleteCoderClan(mockRequest({ params, user: admin } as never), res);

        expect(asignacion.destroy).toHaveBeenCalled();
        expect(statusOf(res)).toBe(200);
    });


    it('lanza 404 si la asignación no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);
        jest.spyOn(Coder_clan, 'findOne').mockResolvedValue(null as never);

        await expect(
            deleteCoderClan(mockRequest({ params, user: admin } as never), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });


    it('bloquea a un team leader sobre un clan ajeno', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: CLAN_ID, tl_id: 'tl-1' } as never);

        await expect(
            deleteCoderClan(
                mockRequest({
                    params, user: { id: 'tl-9', role: 'team leader' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 403 });
    });
});
