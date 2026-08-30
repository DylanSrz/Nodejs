import { createUserSchema, updateUserSchema } from '../../../src/dto/user.schema.js';


const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';

// Cuerpo válido de referencia: cada prueba lo altera en un
// solo campo para aislar la regla que quiere comprobar.
const valido = {
    first_name: 'juan',
    last_name: 'pérez',
    email: 'juanperez@correo.com',
    password: 'unaClaveSegura1',
    phone: '3001112233',
    birth_date: '1999-05-12',
    city_id: UUID,
    address: 'calle 10 no. 20 - 30',
    type_identification_id: UUID,
    identification_number: '1234567890',
    role_id: UUID,
};

const con = (cambios: Record<string, unknown>) => ({ ...valido, ...cambios });


describe('createUserSchema', () => {

    it('acepta un cuerpo completo y correcto', () => {
        expect(createUserSchema.safeParse(valido).success).toBe(true);
    });


    describe('campos obligatorios', () => {

        it.each(Object.keys(valido))('rechaza si falta %s', (campo) => {

            const cuerpo: Record<string, unknown> = { ...valido };
            delete cuerpo[campo];

            expect(createUserSchema.safeParse(cuerpo).success).toBe(false);
        });
    });


    describe('email', () => {

        it.each([
            'sin-arroba',
            'sin@dominio',
            '@sindestinatario.com',
            'con espacio@correo.com',
        ])('rechaza %s', (email) => {
            expect(createUserSchema.safeParse(con({ email })).success).toBe(false);
        });

        it('acepta un correo con subdominio', () => {
            expect(createUserSchema.safeParse(con({ email: 'a.b@mail.correo.co' })).success)
                .toBe(true);
        });
    });


    describe('password', () => {

        it('rechaza menos de 8 caracteres', () => {
            expect(createUserSchema.safeParse(con({ password: '1234567' })).success).toBe(false);
        });

        it('acepta exactamente 8 caracteres', () => {
            expect(createUserSchema.safeParse(con({ password: '12345678' })).success).toBe(true);
        });

        it('rechaza más de 72 caracteres, el límite de bcrypt', () => {
            expect(createUserSchema.safeParse(con({ password: 'a'.repeat(73) })).success)
                .toBe(false);
        });
    });


    describe('phone', () => {

        it.each(['3001112233', '+57 300 111 2233', '300-111-2233'])
        ('acepta %s', (phone) => {
            expect(createUserSchema.safeParse(con({ phone })).success).toBe(true);
        });

        it('rechaza letras', () => {
            expect(createUserSchema.safeParse(con({ phone: '300ABC1234' })).success).toBe(false);
        });

        it('rechaza menos de 7 caracteres', () => {
            expect(createUserSchema.safeParse(con({ phone: '123456' })).success).toBe(false);
        });

        it('rechaza más de 20 caracteres, el ancho de la columna', () => {
            expect(createUserSchema.safeParse(con({ phone: '1'.repeat(21) })).success).toBe(false);
        });
    });


    describe('llaves foráneas', () => {

        it.each(['city_id', 'type_identification_id', 'role_id'])
        ('%s debe ser un uuid', (campo) => {
            expect(createUserSchema.safeParse(con({ [campo]: 'no-es-uuid' })).success)
                .toBe(false);
        });

        it('rechaza un uuid con variante inválida', () => {
            expect(createUserSchema.safeParse(
                con({ role_id: '11111111-1111-1111-1111-111111111111' })
            ).success).toBe(false);
        });
    });


    describe('nombres', () => {

        it.each(['first_name', 'last_name'])('%s exige al menos 3 caracteres', (campo) => {
            expect(createUserSchema.safeParse(con({ [campo]: 'ab' })).success).toBe(false);
        });
    });


    describe('birth_date', () => {

        it('exige el formato YYYY-MM-DD', () => {
            expect(createUserSchema.safeParse(con({ birth_date: '12/05/1999' })).success)
                .toBe(false);
        });
    });


    it('informa de todos los campos con problemas a la vez', () => {

        const result = createUserSchema.safeParse(
            con({ email: 'malo', password: '123', phone: 'abc' })
        );

        expect(result.success).toBe(false);
        if (!result.success) {
            const campos = result.error.issues.map((i) => i.path[0]);
            expect(campos).toEqual(expect.arrayContaining(['email', 'password', 'phone']));
        }
    });
});


describe('updateUserSchema', () => {

    it('permite actualizar un solo campo', () => {
        expect(updateUserSchema.safeParse({ phone: '3009998877' }).success).toBe(true);
    });

    it('rechaza un cuerpo vacío', () => {
        expect(updateUserSchema.safeParse({}).success).toBe(false);
    });

    it('acepta is_active, que no existe en la creación', () => {
        expect(updateUserSchema.safeParse({ is_active: false }).success).toBe(true);
    });

    it('rechaza is_active si no es booleano', () => {
        expect(updateUserSchema.safeParse({ is_active: 'no' }).success).toBe(false);
    });

    it('sigue validando el formato de los campos enviados', () => {
        expect(updateUserSchema.safeParse({ email: 'malo' }).success).toBe(false);
    });

    it('no admite los campos de dirección ni de identificación', () => {

        // Esos datos viven en otras tablas y se editan por sus
        // propios endpoints. Zod los descarta en lugar de
        // intentar escribirlos en "user".
        const result = updateUserSchema.safeParse({ phone: '3001112233', address: 'calle 1' });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).not.toHaveProperty('address');
        }
    });
});
