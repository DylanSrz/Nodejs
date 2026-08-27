import { QueryInterface, QueryTypes } from "sequelize";


export async function up({
    context
}: {
    context: QueryInterface
}) {

    // *==================================================*
    // *OBTENER EL CLAN*
    // *==================================================*

    const clans = await context.sequelize.query<{
        id: string;
        name: string;
    }>(
        `
        SELECT id, name
        FROM clan
        WHERE name = 'centurión'
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const clan = clans.find(
        (item) => item.name === "centurión"
    );

    if (!clan) {
        throw new Error(
            "El clan 'centurión' no existe en la tabla clan."
        );
    }


    // *==================================================*
    // *OBTENER EL CODER*
    // *==================================================*

    const users = await context.sequelize.query<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    }>(
        `
        SELECT
            id,
            first_name,
            last_name,
            email
        FROM "user"
        WHERE email = 'dylansuarez@coder.com'
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const coder = users.find(
        (user) => user.email === "dylansuarez@coder.com"
    );

    if (!coder) {
        throw new Error(
            "El coder dylan suarez no existe en la tabla user."
        );
    }


    // *==================================================*
    // *CREAR LA RELACIÓN CODER → CLAN*
    // *==================================================*

    await context.bulkInsert("coder_clan", [
        {
            clan_id: clan.id,

            coder_id: coder.id,

            start_date: "2026-02-23",

            end_date: null,

            createdAt: new Date(),

            updatedAt: new Date()
        }
    ]);
}


export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.sequelize.query(
        `
        DELETE FROM coder_clan
        WHERE clan_id = (
            SELECT id
            FROM clan
            WHERE name = 'centurión'
        )
        AND coder_id = (
            SELECT id
            FROM "user"
            WHERE email = 'dylansuarez@coder.com'
        )
        `
    );

}
