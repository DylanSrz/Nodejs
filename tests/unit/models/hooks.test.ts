import { jest } from '@jest/globals';
import * as bcrypt from 'bcrypt';
import User from '../../../src/models/user.model.js';
import Cities from '../../../src/models/cities.model.js';
import Roles from '../../../src/models/role.model.js';
import Campus from '../../../src/models/campus.model.js';
import Room from '../../../src/models/room.model.js';
import Schedule from '../../../src/models/schedule.model.js';
import Type_route from '../../../src/models/type_route.model.js';
import Type_identification from '../../../src/models/type_identification.model.js';
import Address_user from '../../../src/models/address_user.model.js';
import Identification from '../../../src/models/identification.model.js';
import Clan from '../../../src/models/clan.model.js';


// ======================================================
// HOOKS DE LOS MODELOS
// ======================================================
//
// Los hooks se declaran sobre el modelo y los dispara
// Sequelize al guardar. Aquí se invocan a mano con
// runHooks, sin tocar la base de datos:
//
//     await Modelo.runHooks('beforeCreate', instancia)
//
// Así se puede comprobar lo que hacen sobre el objeto.
//
// ======================================================

const runHooks = (modelo: unknown, hook: string, instancia: unknown) =>
    (modelo as { runHooks: (h: string, i: unknown) => Promise<void> })
        .runHooks(hook, instancia);


describe('User: hasheo de la contraseña', () => {

    it('beforeCreate convierte la contraseña en un hash bcrypt', async () => {

        const usuario: any = {
            first_name: 'ana',
            last_name: 'gómez',
            email: 'ana@correo.com',
            password_hash: 'claveEnClaro123',
        };

        await runHooks(User, 'beforeCreate', usuario);

        expect(usuario.password_hash).not.toBe('claveEnClaro123');
        expect(usuario.password_hash).toMatch(/^\$2[aby]\$/);
    });


    it('el hash generado valida contra la contraseña original', async () => {

        const usuario: any = {
            first_name: 'ana', last_name: 'gómez',
            email: 'ana@correo.com', password_hash: 'claveEnClaro123',
        };

        await runHooks(User, 'beforeCreate', usuario);

        await expect(bcrypt.compare('claveEnClaro123', usuario.password_hash))
            .resolves.toBe(true);
    });


    it('el hash no valida contra otra contraseña', async () => {

        const usuario: any = {
            first_name: 'ana', last_name: 'gómez',
            email: 'ana@correo.com', password_hash: 'claveEnClaro123',
        };

        await runHooks(User, 'beforeCreate', usuario);

        await expect(bcrypt.compare('otraClave', usuario.password_hash))
            .resolves.toBe(false);
    });


    it('beforeUpdate rehashea cuando la contraseña cambió', async () => {

        const usuario: any = {
            first_name: 'ana', last_name: 'gómez',
            email: 'ana@correo.com',
            password_hash: 'nuevaClave456',
            changed: jest.fn(() => true),
        };

        await runHooks(User, 'beforeUpdate', usuario);

        expect(usuario.password_hash).toMatch(/^\$2[aby]\$/);
        await expect(bcrypt.compare('nuevaClave456', usuario.password_hash))
            .resolves.toBe(true);
    });


    it('beforeUpdate NO vuelve a hashear si la contraseña no cambió', async () => {

        // Esta es la razón de ser de la comprobación "changed":
        // sin ella, cualquier actualización hashearía el hash ya
        // guardado y la contraseña dejaría de funcionar.
        const hashGuardado = await bcrypt.hash('claveOriginal', 4);

        const usuario: any = {
            first_name: 'ana', last_name: 'gómez',
            email: 'ana@correo.com',
            password_hash: hashGuardado,
            changed: jest.fn(() => false),
        };

        await runHooks(User, 'beforeUpdate', usuario);

        expect(usuario.password_hash).toBe(hashGuardado);
        await expect(bcrypt.compare('claveOriginal', usuario.password_hash))
            .resolves.toBe(true);
    });


    it('beforeUpdate consulta el cambio sobre password_hash', async () => {

        const changed = jest.fn(() => false);

        await runHooks(User, 'beforeUpdate', {
            first_name: 'ana', last_name: 'gómez',
            email: 'ana@correo.com', password_hash: 'x', changed,
        });

        expect(changed).toHaveBeenCalledWith('password_hash');
    });
});


describe('User: normalización a minúsculas', () => {

    it('beforeCreate baja nombre, apellido y correo', async () => {

        const usuario: any = {
            first_name: 'ANA MARÍA',
            last_name: 'GÓMEZ',
            email: 'ANA@Correo.COM',
            password_hash: 'claveEnClaro123',
        };

        await runHooks(User, 'beforeCreate', usuario);

        expect(usuario.first_name).toBe('ana maría');
        expect(usuario.last_name).toBe('gómez');
        expect(usuario.email).toBe('ana@correo.com');
    });


    it('beforeUpdate mantiene la normalización', async () => {

        const usuario: any = {
            first_name: 'ANA',
            last_name: 'GÓMEZ',
            email: 'ANA@Correo.COM',
            password_hash: 'x',
            changed: () => false,
        };

        await runHooks(User, 'beforeUpdate', usuario);

        expect(usuario.first_name).toBe('ana');
        expect(usuario.email).toBe('ana@correo.com');
    });
});


describe('normalización en el resto de modelos', () => {

    // Cada modelo con campos de texto baja sus valores a
    // minúsculas antes de guardarlos.

    it('Cities normaliza nombre y código', async () => {

        const ciudad: any = { name: 'MEDELLÍN', code_name: 'MDE' };

        await runHooks(Cities, 'beforeCreate', ciudad);

        expect(ciudad.name).toBe('medellín');
        expect(ciudad.code_name).toBe('mde');
    });


    it('Roles normaliza el nombre', async () => {

        const rol: any = { name: 'ADMIN' };

        await runHooks(Roles, 'beforeCreate', rol);

        expect(rol.name).toBe('admin');
    });


    it('Type_route normaliza el nombre', async () => {

        const ruta: any = { name: 'Ruta Básica' };

        await runHooks(Type_route, 'beforeCreate', ruta);

        expect(ruta.name).toBe('ruta básica');
    });


    it('Schedule normaliza el nombre', async () => {

        const jornada: any = { name: 'AM', start_time: '06:00:00', end_time: '12:59:59' };

        await runHooks(Schedule, 'beforeCreate', jornada);

        expect(jornada.name).toBe('am');
    });


    it('Type_identification normaliza nombre y código', async () => {

        const tipo: any = { name: 'Cédula De Ciudadanía', code_name: 'CC' };

        await runHooks(Type_identification, 'beforeCreate', tipo);

        expect(tipo.name).toBe('cédula de ciudadanía');
        expect(tipo.code_name).toBe('cc');
    });


    it('Campus normaliza nombre y dirección', async () => {

        const sede: any = { name: 'SEDE PRINCIPAL', address: 'CALLE 10 No. 20 - 30' };

        await runHooks(Campus, 'beforeCreate', sede);

        expect(sede.name).toBe('sede principal');
        expect(sede.address).toBe('calle 10 no. 20 - 30');
    });


    it('Room normaliza el nombre', async () => {

        const salon: any = { name: 'SALÓN 101', capacity: 30 };

        await runHooks(Room, 'beforeCreate', salon);

        expect(salon.name).toBe('salón 101');
    });


    it('Address_user normaliza la dirección', async () => {

        const direccion: any = { address: 'CARRERA 45 No. 70 - 133' };

        await runHooks(Address_user, 'beforeCreate', direccion);

        expect(direccion.address).toBe('carrera 45 no. 70 - 133');
    });


    it('Identification normaliza el número', async () => {

        const identificacion: any = { number: 'AB-12345' };

        await runHooks(Identification, 'beforeCreate', identificacion);

        expect(identificacion.number).toBe('ab-12345');
    });


    it('Clan normaliza el nombre', async () => {

        const clan: any = { name: 'CLAN HOPPER' };

        await runHooks(Clan, 'beforeCreate', clan);

        expect(clan.name).toBe('clan hopper');
    });
});


describe('coherencia entre modelos y datos base', () => {

    it('el nombre normalizado de un rol coincide con lo que valida checkRole', async () => {

        // checkRole compara contra 'team leader' en minúsculas;
        // el hook garantiza que así se guarde.
        const rol: any = { name: 'Team Leader' };

        await runHooks(Roles, 'beforeCreate', rol);

        expect(rol.name).toBe('team leader');
    });
});
