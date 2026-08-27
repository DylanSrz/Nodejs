import { randomUUID } from "crypto";
import { QueryInterface, QueryTypes } from "sequelize";


export async function up({
    context
}: {
    context: QueryInterface
}) {

    // *==================================================*
    // *OBTENER EL SCHEDULE*
    // *==================================================*

    const schedules = await context.sequelize.query<{
        id: string;
        name: string;
    }>(
        `
        SELECT id, name
        FROM schedule
        WHERE name = 'pm'
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const schedulePm = schedules.find(
        (item) => item.name === "pm"
    );

    if (!schedulePm) {
        throw new Error(
            "El schedule 'pm' no existe en la tabla schedule."
        );
    }


    // *==================================================*
    // *OBTENER EL TIPO DE RUTA*
    // *==================================================*

    const typeRoutes = await context.sequelize.query<{
        id: string;
        name: string;
    }>(
        `
        SELECT id, name
        FROM type_route
        WHERE name = 'ruta avanzada'
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const typeRouteAvanzada = typeRoutes.find(
        (route) => route.name === "ruta avanzada"
    );

    if (!typeRouteAvanzada) {
        throw new Error(
            "El tipo de ruta 'ruta avanzada' no existe en la tabla type_route."
        );
    }


    // *==================================================*
    // *OBTENER LA SALA 3 DE RIWI BARRANQUILLA*
    // *==================================================*

    const rooms = await context.sequelize.query<{
        id: string;
        name: string;
        campus_id: string;
    }>(
        `
        SELECT
            room.id,
            room.name,
            room.campus_id
        FROM room
        INNER JOIN campus
            ON room.campus_id = campus.id
        WHERE room.name = 'sala 3'
        AND campus.name = 'riwi barranquilla'
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const room3Baq = rooms.find(
        (item) => item.name === "sala 3"
    );

    if (!room3Baq) {
        throw new Error(
            "La sala 3 del campus Riwi Barranquilla no existe en la tabla room."
        );
    }


    // *==================================================*
    // *OBTENER EL TEAM LEADER*
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
        WHERE email = 'abrahanvilla@teamleader.com'
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const teamLeader = users.find(
        (user) => user.email === "abrahanvilla@teamleader.com"
    );

    if (!teamLeader) {
        throw new Error(
            "El Team Leader abrahan villa no existe en la tabla user."
        );
    }


    // *==================================================*
    // *CREAR EL CLAN*
    // *==================================================*

    await context.bulkInsert("clan", [
        {
            id: randomUUID(),
            name: "centurión",
            
            schedule_id: schedulePm.id,
            type_route_id: typeRouteAvanzada.id,
            room_id: room3Baq.id,
            tl_id: teamLeader.id,

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

    await context.bulkDelete("clan", {
        name: "centurión"
    });

}
