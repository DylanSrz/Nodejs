import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkInsert("schedule", [
        {
            id: randomUUID(),
            name: "am",
            start_time: "06:00:00",
            end_time: "12:59:59",
        },
        {
            id: randomUUID(),
            name: "pm",
            start_time: "13:00:00",
            end_time: "21:00:00",
        },
    ]);

}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete("schedule", {});

}
