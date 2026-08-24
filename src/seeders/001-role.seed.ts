import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkInsert("roles", [
        {
            id: randomUUID(),
            name: "admin",
        },
        {
            id: randomUUID(),
            name: "team leader",
        },
        {
            id: randomUUID(),
            name: "coder",
        },
    ]);

}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete("roles", {});

}