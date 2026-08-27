import { randomUUID } from "crypto";
import { QueryInterface, QueryTypes } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    const cities = await context.sequelize.query<{
        id: string
        code_name: string
    }>(
        `
        SELECT id, code_name
        FROM cities
        WHERE code_name IN ('08001')
        `,
        {
            type: QueryTypes.SELECT
        }
    )

    const barranquilla = cities.find(
        (city) => city.code_name === "08001"
    )

    if (!barranquilla) {
        throw new Error(
            "La ciudad de Barranquilla (08001) no existe en la tabla cities."
        );
    }

    await context.bulkInsert("address_user", [
        {
            id: randomUUID(),
            city_id: barranquilla.id,
            address: "carrera 45 No. 70 - 133"
        },
        {
            id: randomUUID(),
            city_id: barranquilla.id,
            address: "calle 45 no. 38 - 245"
        },
        {
            id: randomUUID(),
            city_id: barranquilla.id,
            address: "calle 72 no. 60 - 27"
        }
    ])
}

export async function down({
    context
}: {
    context: QueryInterface
}) {
    await context.bulkDelete("address_user", {})
}