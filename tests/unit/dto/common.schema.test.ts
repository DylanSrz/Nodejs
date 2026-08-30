import z from 'zod';
import {
    idParamSchema,
    coderClanParamsSchema,
    dateOnly,
    timeOnly,
    toUpdateSchema,
} from '../../../src/dto/common.schema.js';


// uuid v4 válido según RFC 4122: la versión es el primer
// dígito del tercer grupo y la variante el del cuarto.
const UUID = '3f0c2b9a-1d4e-4a7b-8c9d-0e1f2a3b4c5d';


describe('idParamSchema', () => {

    it('acepta un uuid válido', () => {
        expect(idParamSchema.safeParse({ id: UUID }).success).toBe(true);
    });

    it.each([
        ['texto suelto', 'no-es-uuid'],
        ['cadena vacía', ''],
        ['número con formato de uuid pero variante inválida', '11111111-1111-1111-1111-111111111111'],
    ])('rechaza %s', (_caso, valor) => {
        expect(idParamSchema.safeParse({ id: valor }).success).toBe(false);
    });

    it('explica el problema en el mensaje', () => {
        const result = idParamSchema.safeParse({ id: 'x' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0]?.message)
                .toBe('El parámetro id debe ser un uuid válido.');
        }
    });
});


describe('coderClanParamsSchema', () => {

    it('acepta los dos uuid de la clave compuesta', () => {
        expect(coderClanParamsSchema.safeParse({ clan_id: UUID, coder_id: UUID }).success)
            .toBe(true);
    });

    it('rechaza si falta uno de los dos', () => {
        expect(coderClanParamsSchema.safeParse({ clan_id: UUID }).success).toBe(false);
    });

    it('rechaza si uno de los dos no es uuid', () => {
        expect(coderClanParamsSchema.safeParse({ clan_id: UUID, coder_id: 'x' }).success)
            .toBe(false);
    });
});


describe('dateOnly', () => {

    const schema = dateOnly('birth_date');

    it.each(['2026-01-15', '1999-12-31', '2000-02-29'])('acepta %s', (valor) => {
        expect(schema.safeParse(valor).success).toBe(true);
    });

    it.each([
        ['formato con barras', '15/01/2026'],
        ['fecha con hora', '2026-01-15T00:00:00Z'],
        ['año de dos cifras', '26-01-15'],
        ['texto', 'ayer'],
        ['vacío', ''],
    ])('rechaza %s', (_caso, valor) => {
        expect(schema.safeParse(valor).success).toBe(false);
    });

    it('nombra el campo en el mensaje de error', () => {
        const result = schema.safeParse('mal');
        if (!result.success) {
            expect(result.error.issues[0]?.message)
                .toBe('birth_date debe tener el formato YYYY-MM-DD.');
        }
    });
});


describe('timeOnly', () => {

    const schema = timeOnly('start_time');

    it.each(['00:00:00', '06:00:00', '13:30:45', '23:59:59'])('acepta %s', (valor) => {
        expect(schema.safeParse(valor).success).toBe(true);
    });

    it.each([
        ['hora fuera de rango', '24:00:00'],
        ['minutos fuera de rango', '10:60:00'],
        ['segundos fuera de rango', '10:00:60'],
        ['sin segundos', '10:00'],
        ['texto', 'mañana'],
    ])('rechaza %s', (_caso, valor) => {
        expect(schema.safeParse(valor).success).toBe(false);
    });
});


describe('toUpdateSchema', () => {

    const base = z.object({
        name: z.string().min(3),
        code_name: z.string().min(2),
    });

    const update = toUpdateSchema(base);

    it('permite enviar un solo campo', () => {
        expect(update.safeParse({ name: 'medellín' }).success).toBe(true);
    });

    it('permite enviarlos todos', () => {
        expect(update.safeParse({ name: 'medellín', code_name: 'mde' }).success).toBe(true);
    });

    it('rechaza un cuerpo vacío', () => {
        // Un PUT sin datos no tiene nada que actualizar.
        expect(update.safeParse({}).success).toBe(false);
    });

    it('sigue aplicando las reglas de cada campo', () => {
        // "ab" incumple el min(3) del esquema base.
        expect(update.safeParse({ name: 'ab' }).success).toBe(false);
    });

    it('avisa de que hace falta al menos un campo', () => {
        const result = update.safeParse({});
        if (!result.success) {
            expect(result.error.issues[0]?.message)
                .toBe('Debe enviar al menos un campo para actualizar.');
        }
    });
});
