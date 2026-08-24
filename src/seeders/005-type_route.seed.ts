import { randomUUID } from "crypto";
import { QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {
    
    await context.bulkInsert("type_route", [
        {
            id: randomUUID(),
            name: "ruta básica"
        },
        {
            id: randomUUID(),
            name: "ruta avanzada"
        }
    ])
}

export async function down({
    context
}: {
    context: QueryInterface
}) {
    await context.bulkDelete("type_route", {})
}