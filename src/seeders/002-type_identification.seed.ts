import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkInsert("type_identification", [
        {
            id: randomUUID(),
            name: "cédula de ciudadanía",
            code_name: "cc",
        },
        {
            id: randomUUID(),
            name: "tarjeta de identidad",
            code_name: "ti",
        },
        {
            id: randomUUID(),
            name: "cédula de extranjería",
            code_name: "ce",
        },
        {
            id: randomUUID(),
            name: "pasaporte",
            code_name: "pa",
        },
        {
            id: randomUUID(),
            name: "permiso por protección temporal",
            code_name: "ppt",
        },
    ]);

}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete("type_identification", {});

}