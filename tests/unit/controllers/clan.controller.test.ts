import { jest } from '@jest/globals';
import {
    getClan,
    getClanById,
    createClan,
    updateClan,
    deleteClan,
    getClanCoders,
    ensureCanManageClan,
} from '../../../src/controllers/clan.controller.js';
import Clan from '../../../src/models/clan.model.js';
import User from '../../../src/models/user.model.js';
import Roles from '../../../src/models/role.model.js';
import Schedule from '../../../src/models/schedule.model.js';
import Type_route from '../../../src/models/type_route.model.js';
import Room from '../../../src/models/room.model.js';
import Coder_clan from '../../../src/models/coder_clan.model.js';
import {
    mockRequest,
    mockResponse,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';

const cuerpoClan = {
    name: 'clan hopper',
    schedule_id: UUID,
    type_route_id: UUID,
    room_id: UUID,
    tl_id: 'tl-1',
};

const instancia = (datos: Record<string, unknown>) => ({
    ...datos,
    update: jest.fn(async function (this: any, cambios: Record<string, unknown>) {
        Object.assign(this, cambios);
        return this;
    }),
    destroy: jest.fn(async () => undefined),
});


/** Team leader activo y libre; el camino feliz. */
const teamLeaderValido = () => {
    jest.spyOn(User, 'findByPk')
        .mockResolvedValue({ id: 'tl-1', role_id: 'rol-tl', is_active: true } as never);
    jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-tl' } as never);
    jest.spyOn(Clan, 'findOne').mockResolvedValue(null as never);
};

/** Las demás llaves foráneas existen. */
const referenciasValidas = () => {
    jest.spyOn(Schedule, 'findByPk').mockResolvedValue({ id: UUID } as never);
    jest.spyOn(Type_route, 'findByPk').mockResolvedValue({ id: UUID } as never);
    jest.spyOn(Room, 'findByPk').mockResolvedValue({ id: UUID } as never);
};


describe('ensureCanManageClan', () => {

    const clan = { id: 'c1', tl_id: 'tl-1' } as never;


    it('deja pasar a un admin sobre cualquier clan', () => {

        const req = mockRequest({ user: { id: 'otro', role: 'admin' } } as never);

        expect(() => ensureCanManageClan(req, clan)).not.toThrow();
    });


    it('deja pasar al team leader sobre el clan que dirige', () => {

        const req = mockRequest({ user: { id: 'tl-1', role: 'team leader' } } as never);

        expect(() => ensureCanManageClan(req, clan)).not.toThrow();
    });


    it('bloquea al team leader sobre un clan ajeno', () => {

        const req = mockRequest({ user: { id: 'tl-9', role: 'team leader' } } as never);

        expect(() => ensureCanManageClan(req, clan))
            .toThrow('Solo puede gestionar el clan que usted dirige.');
    });


    it('bloquea con 403 a un coder', () => {

        const req = mockRequest({ user: { id: 'tl-1', role: 'coder' } } as never);

        expect(() => ensureCanManageClan(req, clan)).toThrow(
            expect.objectContaining({ status: 403 }) as Error
        );
    });


    it('bloquea si no hay usuario en la petición', () => {

        expect(() => ensureCanManageClan(mockRequest(), clan)).toThrow();
    });
});


describe('getClan', () => {

    it('responde 200 con los clanes', async () => {

        jest.spyOn(Clan, 'findAll').mockResolvedValue([{ id: 'c1' }] as never);

        const res = mockResponse();
        await getClan(mockRequest(), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).clans).toHaveLength(1);
    });


    it('trae jornada, ruta, salón y team leader', async () => {

        const findAll = jest.spyOn(Clan, 'findAll').mockResolvedValue([] as never);

        await getClan(mockRequest(), mockResponse());

        const alias = (findAll.mock.calls[0]?.[0] as any).include.map((i: any) => i.as);

        expect(alias).toEqual(['schedule', 'type_route', 'room', 'team_leader']);
    });


    it('no expone el hash del team leader', async () => {

        const findAll = jest.spyOn(Clan, 'findAll').mockResolvedValue([] as never);

        await getClan(mockRequest(), mockResponse());

        const tl = (findAll.mock.calls[0]?.[0] as any).include
            .find((i: any) => i.as === 'team_leader');

        expect(tl.attributes).toEqual({ exclude: ['password_hash'] });
    });
});


describe('getClanById', () => {

    it('responde 200 con el clan cuando existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: 'c1', name: 'hopper' } as never);

        const res = mockResponse();
        await getClanById(mockRequest({ params: { id: 'c1' } }), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).clan).toEqual({ id: 'c1', name: 'hopper' });
    });


    it('responde 404 si el clan no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue(null as never);

        const res = mockResponse();
        await getClanById(mockRequest({ params: { id: 'c1' } }), res);

        expect(statusOf(res)).toBe(404);
    });
});


describe('createClan', () => {

    it('responde 201 cuando todo es correcto', async () => {

        teamLeaderValido();
        referenciasValidas();
        jest.spyOn(Clan, 'create').mockResolvedValue({ id: 'c1' } as never);

        const res = mockResponse();
        await createClan(mockRequest({ body: { ...cuerpoClan } }), res);

        expect(statusOf(res)).toBe(201);
        expect(bodyOf(res).newClan).toEqual({ id: 'c1' });
    });


    describe('validación del team leader', () => {

        it('responde 404 si el usuario indicado no existe', async () => {

            jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

            const res = mockResponse();
            await createClan(mockRequest({ body: { ...cuerpoClan } }), res);

            expect(statusOf(res)).toBe(404);
            expect(bodyOf(res).message).toBe('TL not found.');
        });


        it('responde 403 si el usuario no tiene rol team leader', async () => {

            jest.spyOn(User, 'findByPk')
                .mockResolvedValue({ id: 'tl-1', role_id: 'rol-coder', is_active: true } as never);
            jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-tl' } as never);

            const res = mockResponse();
            await createClan(mockRequest({ body: { ...cuerpoClan } }), res);

            expect(statusOf(res)).toBe(403);
            expect(bodyOf(res).message).toBe('El rol no cumple los requisitos');
        });


        it('responde 409 si el team leader está inactivo', async () => {

            jest.spyOn(User, 'findByPk')
                .mockResolvedValue({ id: 'tl-1', role_id: 'rol-tl', is_active: false } as never);
            jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-tl' } as never);

            const res = mockResponse();
            await createClan(mockRequest({ body: { ...cuerpoClan } }), res);

            expect(statusOf(res)).toBe(409);
        });


        it('responde 409 si ya dirige otro clan', async () => {

            // La columna tl_id es única: un team leader por clan.
            jest.spyOn(User, 'findByPk')
                .mockResolvedValue({ id: 'tl-1', role_id: 'rol-tl', is_active: true } as never);
            jest.spyOn(Roles, 'findOne').mockResolvedValue({ id: 'rol-tl' } as never);
            jest.spyOn(Clan, 'findOne').mockResolvedValue({ id: 'otro-clan' } as never);

            const res = mockResponse();
            await createClan(mockRequest({ body: { ...cuerpoClan } }), res);

            expect(statusOf(res)).toBe(409);
            expect(bodyOf(res).message).toBe('Ese team leader ya está asignado a otro clan.');
        });


        it('no crea el clan si la validación falla', async () => {

            jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);
            const create = jest.spyOn(Clan, 'create');

            await createClan(mockRequest({ body: { ...cuerpoClan } }), mockResponse());

            expect(create).not.toHaveBeenCalled();
        });
    });


    describe('validación de las demás referencias', () => {

        it.each([
            ['la jornada', Schedule],
            ['la ruta', Type_route],
            ['el salón', Room],
        ])('lanza 404 si %s no existe', async (_caso, modelo) => {

            teamLeaderValido();
            referenciasValidas();
            jest.spyOn(modelo as any, 'findByPk').mockResolvedValue(null as never);

            await expect(
                createClan(mockRequest({ body: { ...cuerpoClan } }), mockResponse())
            ).rejects.toMatchObject({ status: 404 });
        });
    });


    it('lanza 409 si el nombre del clan ya existe', async () => {

        teamLeaderValido();
        referenciasValidas();

        // La primera consulta es la del team leader (null);
        // la segunda, la del nombre duplicado.
        jest.spyOn(Clan, 'findOne')
            .mockResolvedValueOnce(null as never)
            .mockResolvedValueOnce({ id: 'otro' } as never);

        await expect(
            createClan(mockRequest({ body: { ...cuerpoClan } }), mockResponse())
        ).rejects.toMatchObject({ status: 409 });
    });
});


describe('updateClan', () => {

    it('responde 200 y aplica los cambios', async () => {

        const clan = instancia({ id: 'c1', name: 'clan viejo', tl_id: 'tl-1' });
        jest.spyOn(Clan, 'findByPk').mockResolvedValue(clan as never);
        jest.spyOn(Clan, 'findOne').mockResolvedValue(null as never);

        const res = mockResponse();
        await updateClan(
            mockRequest({
                params: { id: 'c1' },
                body: { name: 'clan nuevo' },
                user: { id: 'admin', role: 'admin' },
            } as never),
            res
        );

        expect(statusOf(res)).toBe(200);
        expect(clan.update).toHaveBeenCalledWith({ name: 'clan nuevo' });
    });


    it('lanza 404 si el clan no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue(null as never);

        await expect(
            updateClan(
                mockRequest({
                    params: { id: 'c1' },
                    body: { name: 'x' },
                    user: { id: 'admin', role: 'admin' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 404 });
    });


    it('bloquea a un team leader sobre un clan ajeno', async () => {

        jest.spyOn(Clan, 'findByPk')
            .mockResolvedValue(instancia({ id: 'c1', tl_id: 'tl-1' }) as never);

        await expect(
            updateClan(
                mockRequest({
                    params: { id: 'c1' },
                    body: { name: 'x' },
                    user: { id: 'tl-9', role: 'team leader' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 403 });
    });


    it('permite al team leader actualizar su propio clan', async () => {

        const clan = instancia({ id: 'c1', name: 'viejo', tl_id: 'tl-1' });
        jest.spyOn(Clan, 'findByPk').mockResolvedValue(clan as never);
        jest.spyOn(Clan, 'findOne').mockResolvedValue(null as never);

        const res = mockResponse();
        await updateClan(
            mockRequest({
                params: { id: 'c1' },
                body: { name: 'nuevo' },
                user: { id: 'tl-1', role: 'team leader' },
            } as never),
            res
        );

        expect(statusOf(res)).toBe(200);
    });


    it('no revalida el team leader si no cambia', async () => {

        const clan = instancia({ id: 'c1', name: 'viejo', tl_id: 'tl-1' });
        jest.spyOn(Clan, 'findByPk').mockResolvedValue(clan as never);
        jest.spyOn(Clan, 'findOne').mockResolvedValue(null as never);
        const findByPkUser = jest.spyOn(User, 'findByPk');

        await updateClan(
            mockRequest({
                params: { id: 'c1' },
                body: { tl_id: 'tl-1' },
                user: { id: 'admin', role: 'admin' },
            } as never),
            mockResponse()
        );

        expect(findByPkUser).not.toHaveBeenCalled();
    });


    it.each([
        ['schedule_id', Schedule],
        ['type_route_id', Type_route],
        ['room_id', Room],
    ])('lanza 404 si el nuevo %s no existe', async (campo, modelo) => {

        jest.spyOn(Clan, 'findByPk')
            .mockResolvedValue(instancia({ id: 'c1', name: 'x', tl_id: 'tl-1' }) as never);
        referenciasValidas();
        jest.spyOn(modelo as any, 'findByPk').mockResolvedValue(null as never);

        await expect(
            updateClan(
                mockRequest({
                    params: { id: 'c1' },
                    body: { [campo as string]: UUID },
                    user: { id: 'admin', role: 'admin' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 404 });
    });


    it('lanza 409 si el nombre nuevo ya lo usa otro clan', async () => {

        jest.spyOn(Clan, 'findByPk')
            .mockResolvedValue(instancia({ id: 'c1', name: 'viejo', tl_id: 'tl-1' }) as never);
        jest.spyOn(Clan, 'findOne').mockResolvedValue({ id: 'otro' } as never);

        await expect(
            updateClan(
                mockRequest({
                    params: { id: 'c1' },
                    body: { name: 'nombre tomado' },
                    user: { id: 'admin', role: 'admin' },
                } as never),
                mockResponse()
            )
        ).rejects.toMatchObject({ status: 409 });
    });


    it('valida el team leader nuevo cuando cambia', async () => {

        jest.spyOn(Clan, 'findByPk')
            .mockResolvedValue(instancia({ id: 'c1', name: 'x', tl_id: 'tl-1' }) as never);
        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        const res = mockResponse();
        await updateClan(
            mockRequest({
                params: { id: 'c1' },
                body: { tl_id: 'tl-2' },
                user: { id: 'admin', role: 'admin' },
            } as never),
            res
        );

        expect(statusOf(res)).toBe(404);
    });
});


describe('getClanCoders', () => {

    it('responde 200 con los coders del clan', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: 'c1' } as never);
        jest.spyOn(Coder_clan, 'findAll')
            .mockResolvedValue([{ clan_id: 'c1', coder_id: 'u1' }] as never);

        const res = mockResponse();
        await getClanCoders(mockRequest({ params: { id: 'c1' } }), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).members).toHaveLength(1);
    });


    it('filtra por el clan pedido', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: 'c1' } as never);
        const findAll = jest.spyOn(Coder_clan, 'findAll').mockResolvedValue([] as never);

        await getClanCoders(mockRequest({ params: { id: 'c1' } }), mockResponse());

        expect((findAll.mock.calls[0]?.[0] as any).where).toEqual({ clan_id: 'c1' });
    });


    it('no expone el hash de los coders', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue({ id: 'c1' } as never);
        const findAll = jest.spyOn(Coder_clan, 'findAll').mockResolvedValue([] as never);

        await getClanCoders(mockRequest({ params: { id: 'c1' } }), mockResponse());

        expect((findAll.mock.calls[0]?.[0] as any).include[0].attributes)
            .toEqual({ exclude: ['password_hash'] });
    });


    it('lanza 404 si el clan no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue(null as never);

        await expect(
            getClanCoders(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });
});


describe('deleteClan', () => {

    it('borra el clan cuando no tiene coders', async () => {

        const clan = instancia({ id: 'c1' });
        jest.spyOn(Clan, 'findByPk').mockResolvedValue(clan as never);
        jest.spyOn(Coder_clan, 'count').mockResolvedValue(0 as never);

        const res = mockResponse();
        await deleteClan(mockRequest({ params: { id: 'c1' } }), res);

        expect(clan.destroy).toHaveBeenCalled();
        expect(statusOf(res)).toBe(200);
    });


    it('lanza 409 si todavía tiene coders asignados', async () => {

        const clan = instancia({ id: 'c1' });
        jest.spyOn(Clan, 'findByPk').mockResolvedValue(clan as never);
        jest.spyOn(Coder_clan, 'count').mockResolvedValue(4 as never);

        await expect(
            deleteClan(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({
            status: 409,
            details: [{ label: 'coders asignados', count: 4 }],
        });

        expect(clan.destroy).not.toHaveBeenCalled();
    });


    it('lanza 404 si el clan no existe', async () => {

        jest.spyOn(Clan, 'findByPk').mockResolvedValue(null as never);

        await expect(
            deleteClan(mockRequest({ params: { id: 'c1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });
});
