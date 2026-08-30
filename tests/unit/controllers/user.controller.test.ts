import { jest } from '@jest/globals';
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    updateStatus,
    deleteUser,
} from '../../../src/controllers/user.controller.js';
import User from '../../../src/models/user.model.js';
import Address_user from '../../../src/models/address_user.model.js';
import Identification from '../../../src/models/identification.model.js';
import Type_identification from '../../../src/models/type_identification.model.js';
import Cities from '../../../src/models/cities.model.js';
import Roles from '../../../src/models/role.model.js';
import Clan from '../../../src/models/clan.model.js';
import db from '../../../src/config/db.js';
import {
    mockRequest,
    mockResponse,
    statusOf,
    bodyOf,
} from '../../helpers/http.js';


const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';

const cuerpoNuevoUsuario = {
    first_name: 'ana',
    last_name: 'gómez',
    email: 'ana@correo.com',
    password: 'claveSegura123',
    phone: '3001112233',
    birth_date: '1997-03-21',
    city_id: UUID,
    address: 'calle 99 no. 8 - 7',
    type_identification_id: UUID,
    identification_number: '1234567890',
    role_id: UUID,
};


/** Instancia de modelo simulada, con los métodos que usan los controladores. */
const instancia = (datos: Record<string, unknown>) => ({
    ...datos,
    update: jest.fn(async function (this: any, cambios: Record<string, unknown>) {
        Object.assign(this, cambios);
        return this;
    }),
    destroy: jest.fn(async () => undefined),
    toJSON() {
        const { update, destroy, toJSON, ...resto } = this as any;
        return { ...resto };
    },
});


/** Transacción simulada, para no abrir una de verdad. */
const transaccionFalsa = () => ({
    commit: jest.fn(async () => undefined),
    rollback: jest.fn(async () => undefined),
});


describe('getUser', () => {

    it('responde 200 con la lista', async () => {

        jest.spyOn(User, 'findAll').mockResolvedValue([{ id: 'u1' }] as never);

        const res = mockResponse();
        await getUser(mockRequest(), res);

        expect(statusOf(res)).toBe(200);
        expect(bodyOf(res).users).toHaveLength(1);
    });


    it('excluye password_hash de la consulta', async () => {

        const findAll = jest.spyOn(User, 'findAll').mockResolvedValue([] as never);

        await getUser(mockRequest(), mockResponse());

        expect((findAll.mock.calls[0]?.[0] as any).attributes)
            .toEqual({ exclude: ['password_hash'] });
    });


    it('trae el rol, la dirección y la identificación', async () => {

        const findAll = jest.spyOn(User, 'findAll').mockResolvedValue([] as never);

        await getUser(mockRequest(), mockResponse());

        const alias = (findAll.mock.calls[0]?.[0] as any).include.map((i: any) => i.as);

        expect(alias).toEqual(['role', 'address_user', 'identification']);
    });
});


describe('getUserById', () => {

    it('responde 200 cuando el usuario existe', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 'u1' } as never);

        const res = mockResponse();
        await getUserById(mockRequest({ params: { id: 'u1' } }), res);

        expect(statusOf(res)).toBe(200);
    });


    it('responde 404 cuando no existe', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        const res = mockResponse();
        await getUserById(mockRequest({ params: { id: 'u1' } }), res);

        expect(statusOf(res)).toBe(404);
    });
});


describe('createUser', () => {

    /** Deja todas las comprobaciones previas en verde. */
    const conValidacionesOk = () => {
        jest.spyOn(Cities, 'findByPk').mockResolvedValue({ id: UUID } as never);
        jest.spyOn(Type_identification, 'findByPk').mockResolvedValue({ id: UUID } as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue({ id: UUID } as never);
        jest.spyOn(User, 'findOne').mockResolvedValue(null as never);
        jest.spyOn(Identification, 'findOne').mockResolvedValue(null as never);
    };


    it('responde 201 y crea los tres registros', async () => {

        conValidacionesOk();

        const tx = transaccionFalsa();
        jest.spyOn(db, 'transaction').mockResolvedValue(tx as never);

        const crearAddress = jest.spyOn(Address_user, 'create')
            .mockResolvedValue({ id: 'a1' } as never);
        const crearIdent = jest.spyOn(Identification, 'create')
            .mockResolvedValue({ id: 'i1' } as never);
        const crearUser = jest.spyOn(User, 'create')
            .mockResolvedValue(instancia({ id: 'u1', email: 'ana@correo.com' }) as never);

        const res = mockResponse();
        await createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), res);

        expect(statusOf(res)).toBe(201);
        expect(crearAddress).toHaveBeenCalled();
        expect(crearIdent).toHaveBeenCalled();
        expect(crearUser).toHaveBeenCalled();
        expect(tx.commit).toHaveBeenCalled();
    });


    it('enlaza el usuario con la dirección y la identificación recién creadas', async () => {

        conValidacionesOk();
        jest.spyOn(db, 'transaction').mockResolvedValue(transaccionFalsa() as never);
        jest.spyOn(Address_user, 'create').mockResolvedValue({ id: 'a1' } as never);
        jest.spyOn(Identification, 'create').mockResolvedValue({ id: 'i1' } as never);

        const crearUser = jest.spyOn(User, 'create')
            .mockResolvedValue(instancia({ id: 'u1' }) as never);

        await createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse());

        expect(crearUser.mock.calls[0]?.[0]).toMatchObject({
            address_user_id: 'a1',
            identification_id: 'i1',
        });
    });


    it('pasa la contraseña en claro a password_hash, para que la hashee el hook', async () => {

        conValidacionesOk();
        jest.spyOn(db, 'transaction').mockResolvedValue(transaccionFalsa() as never);
        jest.spyOn(Address_user, 'create').mockResolvedValue({ id: 'a1' } as never);
        jest.spyOn(Identification, 'create').mockResolvedValue({ id: 'i1' } as never);

        const crearUser = jest.spyOn(User, 'create')
            .mockResolvedValue(instancia({ id: 'u1' }) as never);

        await createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse());

        expect((crearUser.mock.calls[0]?.[0] as any).password_hash).toBe('claveSegura123');
    });


    it('no devuelve password_hash en la respuesta', async () => {

        conValidacionesOk();
        jest.spyOn(db, 'transaction').mockResolvedValue(transaccionFalsa() as never);
        jest.spyOn(Address_user, 'create').mockResolvedValue({ id: 'a1' } as never);
        jest.spyOn(Identification, 'create').mockResolvedValue({ id: 'i1' } as never);
        jest.spyOn(User, 'create').mockResolvedValue(
            instancia({ id: 'u1', password_hash: '$2b$10$loquesea' }) as never
        );

        const res = mockResponse();
        await createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), res);

        expect(bodyOf(res).newUser).not.toHaveProperty('password_hash');
    });


    describe('comprobaciones previas a la transacción', () => {

        it('lanza 404 si la ciudad no existe', async () => {

            jest.spyOn(Cities, 'findByPk').mockResolvedValue(null as never);

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toMatchObject({ status: 404 });
        });


        it('lanza 404 si el tipo de identificación no existe', async () => {

            jest.spyOn(Cities, 'findByPk').mockResolvedValue({ id: UUID } as never);
            jest.spyOn(Type_identification, 'findByPk').mockResolvedValue(null as never);

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toMatchObject({ status: 404 });
        });


        it('lanza 404 si el rol no existe', async () => {

            jest.spyOn(Cities, 'findByPk').mockResolvedValue({ id: UUID } as never);
            jest.spyOn(Type_identification, 'findByPk').mockResolvedValue({ id: UUID } as never);
            jest.spyOn(Roles, 'findByPk').mockResolvedValue(null as never);

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toMatchObject({ status: 404 });
        });


        it('lanza 409 si el correo ya está registrado', async () => {

            conValidacionesOk();
            jest.spyOn(User, 'findOne').mockResolvedValue({ id: 'otro' } as never);

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toMatchObject({ status: 409 });
        });


        it('busca el correo duplicado en minúsculas', async () => {

            conValidacionesOk();
            const findOne = jest.spyOn(User, 'findOne').mockResolvedValue(null as never);
            jest.spyOn(db, 'transaction').mockResolvedValue(transaccionFalsa() as never);
            jest.spyOn(Address_user, 'create').mockResolvedValue({ id: 'a1' } as never);
            jest.spyOn(Identification, 'create').mockResolvedValue({ id: 'i1' } as never);
            jest.spyOn(User, 'create').mockResolvedValue(instancia({ id: 'u1' }) as never);

            await createUser(
                mockRequest({ body: { ...cuerpoNuevoUsuario, email: 'ANA@Correo.COM' } }),
                mockResponse()
            );

            expect(findOne).toHaveBeenCalledWith({ where: { email: 'ana@correo.com' } });
        });


        it('lanza 409 si el número de identificación ya existe', async () => {

            conValidacionesOk();
            jest.spyOn(Identification, 'findOne').mockResolvedValue({ id: 'otro' } as never);

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toMatchObject({ status: 409 });
        });


        it('no abre la transacción si una comprobación falla', async () => {

            jest.spyOn(Cities, 'findByPk').mockResolvedValue(null as never);
            const transaction = jest.spyOn(db, 'transaction');

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toThrow();

            expect(transaction).not.toHaveBeenCalled();
        });
    });


    describe('cuando falla dentro de la transacción', () => {

        it('revierte y propaga el error', async () => {

            conValidacionesOk();

            const tx = transaccionFalsa();
            jest.spyOn(db, 'transaction').mockResolvedValue(tx as never);
            jest.spyOn(Address_user, 'create').mockResolvedValue({ id: 'a1' } as never);
            jest.spyOn(Identification, 'create')
                .mockRejectedValue(new Error('fallo al insertar') as never);
            jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), mockResponse())
            ).rejects.toThrow('fallo al insertar');

            expect(tx.rollback).toHaveBeenCalled();
            expect(tx.commit).not.toHaveBeenCalled();
        });


        it('no deja la petición sin respuesta', async () => {

            // El bug original: el catch hacía rollback y
            // terminaba sin responder, dejando al cliente
            // esperando hasta el timeout. Ahora relanza para
            // que el manejador global conteste.
            conValidacionesOk();

            const tx = transaccionFalsa();
            jest.spyOn(db, 'transaction').mockResolvedValue(tx as never);
            jest.spyOn(Address_user, 'create')
                .mockRejectedValue(new Error('cualquier fallo') as never);
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const res = mockResponse();

            await expect(
                createUser(mockRequest({ body: { ...cuerpoNuevoUsuario } }), res)
            ).rejects.toThrow();

            expect(res.json).not.toHaveBeenCalled();
        });
    });
});


describe('updateUser', () => {

    it('responde 200 y aplica los cambios', async () => {

        const usuario = instancia({ id: 'u1', email: 'ana@correo.com', is_active: true });
        jest.spyOn(User, 'findByPk').mockResolvedValue(usuario as never);

        const res = mockResponse();
        await updateUser(
            mockRequest({ params: { id: 'u1' }, body: { phone: '3009998877' } }),
            res
        );

        expect(statusOf(res)).toBe(200);
        expect(usuario.update).toHaveBeenCalledWith({ phone: '3009998877' });
    });


    it('lanza 404 si el usuario no existe', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        await expect(
            updateUser(mockRequest({ params: { id: 'u1' }, body: { phone: '3001112233' } }),
                mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });


    it('traslada password a password_hash para que el hook la rehashee', async () => {

        const usuario = instancia({ id: 'u1', email: 'ana@correo.com' });
        jest.spyOn(User, 'findByPk').mockResolvedValue(usuario as never);

        await updateUser(
            mockRequest({ params: { id: 'u1' }, body: { password: 'nuevaClave456' } }),
            mockResponse()
        );

        const cambios = usuario.update.mock.calls[0]?.[0] as any;

        expect(cambios.password_hash).toBe('nuevaClave456');
        expect(cambios).not.toHaveProperty('password');
    });


    it('valida el rol nuevo antes de asignarlo', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue(instancia({ id: 'u1' }) as never);
        jest.spyOn(Roles, 'findByPk').mockResolvedValue(null as never);

        await expect(
            updateUser(mockRequest({ params: { id: 'u1' }, body: { role_id: UUID } }),
                mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });


    it('lanza 409 si el correo nuevo ya está tomado', async () => {

        jest.spyOn(User, 'findByPk')
            .mockResolvedValue(instancia({ id: 'u1', email: 'ana@correo.com' }) as never);
        jest.spyOn(User, 'findOne').mockResolvedValue({ id: 'otro' } as never);

        await expect(
            updateUser(mockRequest({ params: { id: 'u1' }, body: { email: 'tomado@correo.com' } }),
                mockResponse())
        ).rejects.toMatchObject({ status: 409 });
    });


    it('no busca duplicados si el correo no cambia', async () => {

        jest.spyOn(User, 'findByPk')
            .mockResolvedValue(instancia({ id: 'u1', email: 'ana@correo.com' }) as never);
        const findOne = jest.spyOn(User, 'findOne');

        await updateUser(
            mockRequest({ params: { id: 'u1' }, body: { email: 'ana@correo.com' } }),
            mockResponse()
        );

        expect(findOne).not.toHaveBeenCalled();
    });


    it('no devuelve password_hash', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue(
            instancia({ id: 'u1', email: 'ana@correo.com', password_hash: '$2b$10$x' }) as never
        );

        const res = mockResponse();
        await updateUser(
            mockRequest({ params: { id: 'u1' }, body: { phone: '3001112233' } }),
            res
        );

        expect(bodyOf(res).user).not.toHaveProperty('password_hash');
    });
});


describe('updateStatus', () => {

    it('invierte is_active de true a false', async () => {

        const usuario = instancia({ id: 'u1', is_active: true });
        jest.spyOn(User, 'findByPk').mockResolvedValue(usuario as never);

        const res = mockResponse();
        await updateStatus(mockRequest({ params: { id: 'u1' } }), res);

        expect(usuario.update).toHaveBeenCalledWith({ is_active: false });
        expect(statusOf(res)).toBe(200);
    });


    it('invierte is_active de false a true, reactivando al usuario', async () => {

        const usuario = instancia({ id: 'u1', is_active: false });
        jest.spyOn(User, 'findByPk').mockResolvedValue(usuario as never);

        await updateStatus(mockRequest({ params: { id: 'u1' } }), mockResponse());

        expect(usuario.update).toHaveBeenCalledWith({ is_active: true });
    });


    it('lanza 404 si el usuario no existe', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        await expect(
            updateStatus(mockRequest({ params: { id: 'u1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });
});


describe('deleteUser', () => {

    it('desactiva en lugar de borrar', async () => {

        const usuario = instancia({ id: 'u1', is_active: true });
        jest.spyOn(User, 'findByPk').mockResolvedValue(usuario as never);
        jest.spyOn(Clan, 'count').mockResolvedValue(0 as never);

        const res = mockResponse();
        await deleteUser(mockRequest({ params: { id: 'u1' } }), res);

        expect(usuario.update).toHaveBeenCalledWith({ is_active: false });
        expect(usuario.destroy).not.toHaveBeenCalled();
        expect(statusOf(res)).toBe(200);
    });


    it('lanza 409 si el usuario ya estaba inactivo', async () => {

        jest.spyOn(User, 'findByPk')
            .mockResolvedValue(instancia({ id: 'u1', is_active: false }) as never);

        await expect(
            deleteUser(mockRequest({ params: { id: 'u1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 409 });
    });


    it('lanza 409 si el usuario dirige un clan', async () => {

        jest.spyOn(User, 'findByPk')
            .mockResolvedValue(instancia({ id: 'u1', is_active: true }) as never);
        jest.spyOn(Clan, 'count').mockResolvedValue(1 as never);

        await expect(
            deleteUser(mockRequest({ params: { id: 'u1' } }), mockResponse())
        ).rejects.toThrow('team leader');
    });


    it('lanza 404 si el usuario no existe', async () => {

        jest.spyOn(User, 'findByPk').mockResolvedValue(null as never);

        await expect(
            deleteUser(mockRequest({ params: { id: 'u1' } }), mockResponse())
        ).rejects.toMatchObject({ status: 404 });
    });
});
