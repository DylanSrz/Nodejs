import { QueryInterface, Op, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    const cities = await context.sequelize.query<{
        id: string;
        code_name: string;
    }>(
        `
        SELECT id, code_name
        FROM cities
        WHERE code_name IN ('08001', '05001');
        `,
        {
            type: QueryTypes.SELECT,
        }
    );

    const barranquilla = cities.find(
        (city) => city.code_name === "08001"
    );

    const medellin = cities.find(
        (city) => city.code_name === "05001"
    );

    if (!barranquilla) {
        throw new Error(
            "La ciudad de Barranquilla (08001) no existe en la tabla cities."
        );
    }

    if (!medellin) {
        throw new Error(
            "La ciudad de Medellín (05001) no existe en la tabla cities."
        );
    }

    await context.bulkInsert("campus", [
        {
            id: randomUUID(),
            name: "riwi barranquilla",
            city_id: barranquilla.id,
            address: "calle 40 No. 46 - 223",
        },
        {
            id: randomUUID(),
            name: "riwi medellín",
            city_id: medellin.id,
            address: "calle 16 No. 55 - 129, piso 3",
        },
    ]);
}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete("campus", {
        name: {
            [Op.in]: [
                "riwi barranquilla",
                "riwi medellín",
            ],
        },
    });

}