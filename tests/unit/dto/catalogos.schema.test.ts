import { createRoleSchema, updateRoleSchema } from '../../../src/dto/role.schema.js';
import { createCitySchema, updateCitySchema } from '../../../src/dto/cities.schema.js';
import {
    createScheduleSchema,
    updateScheduleSchema,
} from '../../../src/dto/schedule.schema.js';
import { createTypeRouteSchema } from '../../../src/dto/type_route.schema.js';
import {
    createTypeIdentificationSchema,
} from '../../../src/dto/type_identification.schema.js';
import { createRoomSchema } from '../../../src/dto/room.schema.js';
import { createCampusSchema } from '../../../src/dto/campus.schema.js';
import {
    createIdentificationSchema,
} from '../../../src/dto/identification.schema.js';
import {
    createAddressUserSchema,
} from '../../../src/dto/address_user.schema.js';
import { loginSchema } from '../../../src/dto/auth.schema.js';


const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';


describe('role.schema', () => {

    it.each(['admin', 'team leader', 'coder'])('acepta el rol %s', (name) => {
        expect(createRoleSchema.safeParse({ name }).success).toBe(true);
    });

    it.each(['superadmin', 'Admin', 'teamleader', ''])('rechaza %s', (name) => {
        // El modelo Roles valida con isIn exactamente estos tres
        // valores, así que el esquema tiene que coincidir.
        expect(createRoleSchema.safeParse({ name }).success).toBe(false);
    });

    it('el update rechaza un cuerpo vacío', () => {
        expect(updateRoleSchema.safeParse({}).success).toBe(false);
    });
});


describe('cities.schema', () => {

    it('acepta nombre y código', () => {
        expect(createCitySchema.safeParse({ name: 'medellín', code_name: 'mde' }).success)
            .toBe(true);
    });

    it('exige el código, que es la columna única', () => {
        expect(createCitySchema.safeParse({ name: 'medellín' }).success).toBe(false);
    });

    it('rechaza un nombre de menos de 3 caracteres', () => {
        expect(createCitySchema.safeParse({ name: 'me', code_name: 'mde' }).success)
            .toBe(false);
    });

    it('rechaza un código de menos de 2 caracteres', () => {
        expect(createCitySchema.safeParse({ name: 'medellín', code_name: 'm' }).success)
            .toBe(false);
    });

    it('rechaza un nombre que exceda la columna de 255', () => {
        expect(createCitySchema.safeParse({ name: 'a'.repeat(256), code_name: 'mde' }).success)
            .toBe(false);
    });

    it('el update permite cambiar solo el nombre', () => {
        expect(updateCitySchema.safeParse({ name: 'medellín' }).success).toBe(true);
    });
});


describe('schedule.schema', () => {

    const valido = { name: 'am', start_time: '06:00:00', end_time: '12:59:59' };

    it('acepta una jornada coherente', () => {
        expect(createScheduleSchema.safeParse(valido).success).toBe(true);
    });

    it.each(['am', 'pm'])('acepta la jornada %s', (name) => {
        expect(createScheduleSchema.safeParse({ ...valido, name }).success).toBe(true);
    });

    it('rechaza una jornada que no sea am ni pm', () => {
        expect(createScheduleSchema.safeParse({ ...valido, name: 'noche' }).success)
            .toBe(false);
    });

    it('rechaza que la hora de fin sea anterior a la de inicio', () => {
        expect(createScheduleSchema.safeParse({
            ...valido, start_time: '13:00:00', end_time: '06:00:00',
        }).success).toBe(false);
    });

    it('rechaza que ambas horas sean iguales', () => {
        expect(createScheduleSchema.safeParse({
            ...valido, start_time: '06:00:00', end_time: '06:00:00',
        }).success).toBe(false);
    });

    it('señala end_time como el campo problemático', () => {
        const result = createScheduleSchema.safeParse({
            ...valido, start_time: '13:00:00', end_time: '06:00:00',
        });
        if (!result.success) {
            expect(result.error.issues[0]?.path).toEqual(['end_time']);
        }
    });

    it('el update admite una sola hora, sin la regla cruzada', () => {
        // En un PUT puede llegar solo start_time; no hay contra
        // qué compararla en el propio cuerpo.
        expect(updateScheduleSchema.safeParse({ start_time: '07:00:00' }).success).toBe(true);
    });
});


describe('type_route.schema', () => {

    it.each(['ruta básica', 'ruta avanzada'])('acepta %s', (name) => {
        // Son los valores que carga el seeder y que valida el
        // modelo Type_route.
        expect(createTypeRouteSchema.safeParse({ name }).success).toBe(true);
    });

    it.each(['basica', 'avanzada', 'ruta media'])('rechaza %s', (name) => {
        expect(createTypeRouteSchema.safeParse({ name }).success).toBe(false);
    });
});


describe('type_identification.schema', () => {

    it('acepta nombre y abreviatura', () => {
        expect(createTypeIdentificationSchema.safeParse({
            name: 'cédula de ciudadanía', code_name: 'cc',
        }).success).toBe(true);
    });

    it('acepta que falte code_name, porque la columna admite null', () => {
        expect(createTypeIdentificationSchema.safeParse({
            name: 'cédula de ciudadanía',
        }).success).toBe(true);
    });

    it('exige el nombre', () => {
        expect(createTypeIdentificationSchema.safeParse({ code_name: 'cc' }).success)
            .toBe(false);
    });
});


describe('room.schema', () => {

    const valido = { name: 'salón 101', capacity: 30, campus_id: UUID };

    it('acepta un salón correcto', () => {
        expect(createRoomSchema.safeParse(valido).success).toBe(true);
    });

    it('exige capacidad de al menos 1, como el modelo', () => {
        expect(createRoomSchema.safeParse({ ...valido, capacity: 0 }).success).toBe(false);
    });

    it('rechaza capacidad negativa', () => {
        expect(createRoomSchema.safeParse({ ...valido, capacity: -5 }).success).toBe(false);
    });

    it('rechaza capacidad decimal', () => {
        expect(createRoomSchema.safeParse({ ...valido, capacity: 12.5 }).success).toBe(false);
    });

    it('rechaza capacidad como cadena', () => {
        expect(createRoomSchema.safeParse({ ...valido, capacity: '30' }).success).toBe(false);
    });

    it('exige que campus_id sea un uuid', () => {
        expect(createRoomSchema.safeParse({ ...valido, campus_id: 'x' }).success).toBe(false);
    });
});


describe('campus.schema', () => {

    const valido = { name: 'sede principal', city_id: UUID, address: 'calle 10 no. 20 - 30' };

    it('acepta una sede correcta', () => {
        expect(createCampusSchema.safeParse(valido).success).toBe(true);
    });

    it('exige la ciudad', () => {
        const { city_id, ...sinCiudad } = valido;
        expect(createCampusSchema.safeParse(sinCiudad).success).toBe(false);
    });

    it('rechaza una dirección demasiado corta', () => {
        expect(createCampusSchema.safeParse({ ...valido, address: 'ca' }).success).toBe(false);
    });
});


describe('identification.schema', () => {

    const valido = { type_identification_id: UUID, number: '1045741377' };

    it('acepta una identificación correcta', () => {
        expect(createIdentificationSchema.safeParse(valido).success).toBe(true);
    });

    it('rechaza un número con símbolos', () => {
        expect(createIdentificationSchema.safeParse({ ...valido, number: '104.574.137' }).success)
            .toBe(false);
    });

    it('acepta letras y guiones, por si el documento los lleva', () => {
        expect(createIdentificationSchema.safeParse({ ...valido, number: 'AB-12345' }).success)
            .toBe(true);
    });

    it('rechaza más de 20 caracteres, el ancho de la columna', () => {
        expect(createIdentificationSchema.safeParse({ ...valido, number: '1'.repeat(21) }).success)
            .toBe(false);
    });
});


describe('address_user.schema', () => {

    it('acepta una dirección correcta', () => {
        expect(createAddressUserSchema.safeParse({
            city_id: UUID, address: 'carrera 45 no. 70 - 133',
        }).success).toBe(true);
    });

    it('exige que city_id sea un uuid', () => {
        expect(createAddressUserSchema.safeParse({
            city_id: '123', address: 'carrera 45 no. 70 - 133',
        }).success).toBe(false);
    });
});


describe('auth.schema', () => {

    it('acepta credenciales completas', () => {
        expect(loginSchema.safeParse({
            email: 'admin@correo.com', password: 'lo-que-sea',
        }).success).toBe(true);
    });

    it('exige un correo con formato válido', () => {
        expect(loginSchema.safeParse({ email: 'admin', password: 'x' }).success).toBe(false);
    });

    it('exige la contraseña', () => {
        expect(loginSchema.safeParse({ email: 'admin@correo.com' }).success).toBe(false);
    });

    it('rechaza una contraseña vacía', () => {
        expect(loginSchema.safeParse({ email: 'admin@correo.com', password: '' }).success)
            .toBe(false);
    });

    it('no impone longitud mínima al iniciar sesión', () => {
        // La regla de 8 caracteres es de la creación de usuarios.
        // Aquí solo se comprueba contra el hash guardado.
        expect(loginSchema.safeParse({ email: 'a@b.co', password: '123' }).success).toBe(true);
    });
});
