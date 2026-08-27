import { QueryInterface, Op, QueryTypes } from "sequelize";
import { randomUUID } from "crypto";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    const campuses = await context.sequelize.query<{
        id: string;
        name: string;
    }>(
        `
        SELECT id, name
        FROM campus
        WHERE name IN ('riwi barranquilla', 'riwi medellín');
        `,
        {
            type: QueryTypes.SELECT,
        }
    );

    const barranquilla = campuses.find(
        (campus) => campus.name === "riwi barranquilla"
    );

    const medellin = campuses.find(
        (campus) => campus.name === "riwi medellín"
    );

    if (!barranquilla) {
        throw new Error(
            "El campus 'Riwi Barranquilla' no existe en la tabla campus."
        );
    }

    if (!medellin) {
        throw new Error(
            "El campus 'Riwi Medellín' no existe en la tabla campus."
        );
    }

    await context.bulkInsert("room", [
        {
            id: randomUUID(),
            name: "sala 1",
            capacity: 30,
            campus_id: barranquilla.id,
        },
        {
            id: randomUUID(),
            name: "sala 2",
            capacity: 30,
            campus_id: barranquilla.id,
        },
        {
            id: randomUUID(),
            name: "sala 3",
            capacity: 30,
            campus_id: barranquilla.id,
        },
        {
            id: randomUUID(),
            name: "sala 4",
            capacity: 30,
            campus_id: barranquilla.id,
        },
        {
            id: randomUUID(),
            name: "sala 1",
            capacity: 30,
            campus_id: medellin.id,
        },
        {
            id: randomUUID(),
            name: "sala 2",
            capacity: 30,
            campus_id: medellin.id,
        },
        {
            id: randomUUID(),
            name: "sala 3",
            capacity: 30,
            campus_id: medellin.id,
        },
        {
            id: randomUUID(),
            name: "sala 4",
            capacity: 30,
            campus_id: medellin.id,
        },
        {
            id: randomUUID(),
            name: "sala 5",
            capacity: 30,
            campus_id: medellin.id,
        },
        {
            id: randomUUID(),
            name: "sala 6",
            capacity: 30,
            campus_id: medellin.id,
        },
    ]);
}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete("room", {
        name: {
            [Op.in]: [
                "sala 1",
                "sala 2",
                "sala 3",
                "sala 4",
                "sala 5",
                "sala 6",
            ],
        },
    });

}