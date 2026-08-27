import { randomUUID } from "crypto";
import { QueryInterface, QueryTypes } from "sequelize";

export async function up({context}: {context: QueryInterface}) {
    
    const type_identification = await context.sequelize.query<{
        id: string
        code_name: string
    }>(
        `
        SELECT id, code_name
        FROM type_identification
        WHERE code_name IN ('cc', 'ti')
        `,
        {
            type: QueryTypes.SELECT
        }
    )

    const cc = type_identification.find(
        (type) => type.code_name === "cc"
    )
    
    const ti = type_identification.find(
        (type) => type.code_name === "ti"
    )

    if (!cc) {
        throw new Error(
            "El tipo de documento cedula de ciudadania (cc) no existe en la tabla type_identification."
        )
    }

    if (!ti) {
        throw new Error(
            "El tipo de documento tarjeta de identidad (ti) no eiste en la tabla de type_identification."
        )
    }
    
    await context.bulkInsert("identification", [
        {
            id: randomUUID(),
            type_identification_id: cc.id,
            number: "8530798"
        },
        {
            id: randomUUID(),
            type_identification_id: ti.id,
            number: "1111222333"
        },
        {
            id: randomUUID(),
            type_identification_id: cc.id,
            number: "1045741377"
        }
        
    ])
}

export async function down({
    context
}: {
    context: QueryInterface
}) {
    await context.bulkDelete("identification", {})
}