import { QueryInterface } from "sequelize";
import { randomUUID } from "crypto";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkInsert("cities", [
        {
            id: randomUUID(),
            name: "Bogotá",
            code_name: "11001",
        },
        {
            id: randomUUID(),
            name: "Medellín",
            code_name: "05001",
        },
        {
            id: randomUUID(),
            name: "Cali",
            code_name: "76001",
        },
        {
            id: randomUUID(),
            name: "Barranquilla",
            code_name: "08001",
        },
        {
            id: randomUUID(),
            name: "Cartagena de Indias",
            code_name: "13001",
        },
        {
            id: randomUUID(),
            name: "Cúcuta",
            code_name: "54001",
        },
        {
            id: randomUUID(),
            name: "Soledad",
            code_name: "08758",
        },
        {
            id: randomUUID(),
            name: "Bucaramanga",
            code_name: "68001",
        },
        {
            id: randomUUID(),
            name: "Ibagué",
            code_name: "73001",
        },
        {
            id: randomUUID(),
            name: "Santa Marta",
            code_name: "47001",
        },
        {
            id: randomUUID(),
            name: "Villavicencio",
            code_name: "50001",
        },
        {
            id: randomUUID(),
            name: "Pereira",
            code_name: "66001",
        },
        {
            id: randomUUID(),
            name: "Manizales",
            code_name: "17001",
        },
        {
            id: randomUUID(),
            name: "Valledupar",
            code_name: "20001",
        },
        {
            id: randomUUID(),
            name: "Pasto",
            code_name: "52001",
        },
        {
            id: randomUUID(),
            name: "Montería",
            code_name: "23001",
        },
        {
            id: randomUUID(),
            name: "Neiva",
            code_name: "41001",
        },
        {
            id: randomUUID(),
            name: "Armenia",
            code_name: "63001",
        },
        {
            id: randomUUID(),
            name: "Sincelejo",
            code_name: "70001",
        },
        {
            id: randomUUID(),
            name: "Popayán",
            code_name: "19001",
        },
        {
            id: randomUUID(),
            name: "Tunja",
            code_name: "15001",
        },
        {
            id: randomUUID(),
            name: "Florencia",
            code_name: "18001",
        },
        {
            id: randomUUID(),
            name: "Riohacha",
            code_name: "44001",
        },
        {
            id: randomUUID(),
            name: "Quibdó",
            code_name: "27001",
        },
        {
            id: randomUUID(),
            name: "Yopal",
            code_name: "85001",
        },
        {
            id: randomUUID(),
            name: "Mocoa",
            code_name: "86001",
        },
        {
            id: randomUUID(),
            name: "Leticia",
            code_name: "91001",
        },
        {
            id: randomUUID(),
            name: "San Andrés",
            code_name: "88001",
        },
        {
            id: randomUUID(),
            name: "Arauca",
            code_name: "81001",
        },
        {
            id: randomUUID(),
            name: "Puerto Carreño",
            code_name: "99001",
        },
    ]);

}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete("cities", {});

}
