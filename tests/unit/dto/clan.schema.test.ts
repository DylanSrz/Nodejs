import { createClanSchema, updateClanSchema } from '../../../src/dto/clan.schema.js';
import {
    createCoderClanSchema,
    updateCoderClanSchema,
} from '../../../src/dto/coder_clan.schema.js';


const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';
const OTRO_UUID = '9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d';


describe('createClanSchema', () => {

    const valido = {
        name: 'clan hopper',
        schedule_id: UUID,
        type_route_id: UUID,
        room_id: UUID,
        tl_id: OTRO_UUID,
    };

    it('acepta un clan correcto', () => {
        expect(createClanSchema.safeParse(valido).success).toBe(true);
    });

    it.each(['name', 'schedule_id', 'type_route_id', 'room_id', 'tl_id'])
    ('rechaza si falta %s', (campo) => {

        const cuerpo: Record<string, unknown> = { ...valido };
        delete cuerpo[campo];

        expect(createClanSchema.safeParse(cuerpo).success).toBe(false);
    });

    it.each(['schedule_id', 'type_route_id', 'room_id', 'tl_id'])
    ('exige que %s sea un uuid', (campo) => {
        expect(createClanSchema.safeParse({ ...valido, [campo]: 'no-es-uuid' }).success)
            .toBe(false);
    });

    it('rechaza un nombre de menos de 3 caracteres', () => {
        expect(createClanSchema.safeParse({ ...valido, name: 'ab' }).success).toBe(false);
    });

    it('rechaza un nombre que exceda la columna de 255', () => {
        expect(createClanSchema.safeParse({ ...valido, name: 'a'.repeat(256) }).success)
            .toBe(false);
    });
});


describe('updateClanSchema', () => {

    it('permite cambiar solo el team leader', () => {
        expect(updateClanSchema.safeParse({ tl_id: UUID }).success).toBe(true);
    });

    it('rechaza un cuerpo vacío', () => {
        expect(updateClanSchema.safeParse({}).success).toBe(false);
    });

    it('sigue validando el formato de lo que se envía', () => {
        expect(updateClanSchema.safeParse({ room_id: 'x' }).success).toBe(false);
    });
});


describe('createCoderClanSchema', () => {

    const valido = {
        clan_id: UUID,
        coder_id: OTRO_UUID,
        start_date: '2026-02-01',
    };

    it('acepta una asignación sin fecha de salida', () => {
        expect(createCoderClanSchema.safeParse(valido).success).toBe(true);
    });

    it('acepta una asignación con fecha de salida posterior', () => {
        expect(createCoderClanSchema.safeParse({ ...valido, end_date: '2026-11-30' }).success)
            .toBe(true);
    });

    it('acepta end_date en null, que significa "sigue en el clan"', () => {
        expect(createCoderClanSchema.safeParse({ ...valido, end_date: null }).success)
            .toBe(true);
    });

    it('acepta que ambas fechas sean el mismo día', () => {
        expect(createCoderClanSchema.safeParse({ ...valido, end_date: '2026-02-01' }).success)
            .toBe(true);
    });

    it('rechaza una fecha de salida anterior a la de entrada', () => {
        expect(createCoderClanSchema.safeParse({ ...valido, end_date: '2026-01-01' }).success)
            .toBe(false);
    });

    it('señala end_date como el campo problemático', () => {

        const result = createCoderClanSchema.safeParse({ ...valido, end_date: '2026-01-01' });

        if (!result.success) {
            expect(result.error.issues[0]?.path).toEqual(['end_date']);
            expect(result.error.issues[0]?.message)
                .toBe('end_date no puede ser anterior a start_date.');
        }
    });

    it('exige start_date', () => {
        const { start_date, ...sinFecha } = valido;
        expect(createCoderClanSchema.safeParse(sinFecha).success).toBe(false);
    });

    it('exige el formato YYYY-MM-DD en las fechas', () => {
        expect(createCoderClanSchema.safeParse({ ...valido, start_date: '01/02/2026' }).success)
            .toBe(false);
    });

    it.each(['clan_id', 'coder_id'])('exige que %s sea un uuid', (campo) => {
        expect(createCoderClanSchema.safeParse({ ...valido, [campo]: '123' }).success)
            .toBe(false);
    });
});


describe('updateCoderClanSchema', () => {

    it('permite cerrar la asignación enviando solo end_date', () => {
        expect(updateCoderClanSchema.safeParse({ end_date: '2026-11-30' }).success).toBe(true);
    });

    it('permite corregir solo start_date', () => {
        expect(updateCoderClanSchema.safeParse({ start_date: '2026-02-01' }).success).toBe(true);
    });

    it('rechaza un cuerpo vacío', () => {
        expect(updateCoderClanSchema.safeParse({}).success).toBe(false);
    });

    it('mantiene la coherencia cuando llegan las dos fechas', () => {
        expect(updateCoderClanSchema.safeParse({
            start_date: '2026-05-01', end_date: '2026-01-01',
        }).success).toBe(false);
    });

    it('acepta las dos fechas en orden correcto', () => {
        expect(updateCoderClanSchema.safeParse({
            start_date: '2026-01-01', end_date: '2026-05-01',
        }).success).toBe(true);
    });
});
