import { randomUUID } from "crypto";
import { QueryInterface, QueryTypes } from "sequelize";
import bcrypt from "bcrypt";

export async function up({
    context
}: {
    context: QueryInterface
}) {

    // ==================================================
    // OBTENER EL ROL 
    // ==================================================

    const roles = await context.sequelize.query<{
        id: string;
        name: string;
    }>(
        `
        SELECT id, name
        FROM roles
        WHERE name IN ('admin', 'team leader', 'coder')
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const roleAdmin = roles.find(
        (role) => role.name === "admin"
    )

    const roleTeamLeader = roles.find(
        (role) => role.name === "team leader"
    )

    const roleCoder = roles.find(
        (role) => role.name === "coder"
    )

    if (!roleAdmin) {
        throw new Error(
            "El rol admin no existe en la tabla roles."
        );
    }

    if (!roleTeamLeader) {
        throw new Error(
            "El rol team leader no existe en la tabla roles."
        );
    }

    if (!roleCoder) {
        throw new Error(
            "El rol coder no existe en la tabla roles."
        );
    }

    // ==================================================
    // OBTENER LAS DIRECCIONES
    // ==================================================

    const addresses = await context.sequelize.query<{
        id: string;
        address: string;
    }>(
        `
        SELECT id, address
        FROM address_user
        WHERE address IN (
        'calle 72 no. 60 - 27',
        'calle 45 no. 38 - 245',
        'carrera 45 No. 70 - 133'
        )
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const addressAdmin = addresses.find(
        (address) => address.address === "calle 72 no. 60 - 27"
    )

    const addressTeamLeader = addresses.find(
        (address) => address.address === "calle 45 no. 38 - 245"
    )

    const addressCoder = addresses.find(
        (address) => address.address === "carrera 45 No. 70 - 133"
    )

    if (!addressAdmin) {
        throw new Error(
            "La direccion calle 72 no. 60 - 27 no existe en la tabla address_user."
        );
    }

    if (!addressTeamLeader) {
        throw new Error(
            "La direccion calle 45 no. 38 - 245 no existe en la tabla address_user."
        );
    }

    if (!addressCoder) {
        throw new Error(
            "La direccion carrera 45 No. 70 - 133 no existe en la tabla address_user."
        );
    }


    // ==================================================
    // OBTENER LAS IDENTIFICACIONES
    // ==================================================

    const identifications = await context.sequelize.query<{
        id: string;
        number: string;
    }>(
        `
        SELECT id, number
        FROM identification
        WHERE number IN ('8530798', '1111222333', '1045741377')
        `,
        {
            type: QueryTypes.SELECT
        }
    );

    const identificationAdmin = identifications.find(
        (identification) => identification.number === "8530798"
    )
    const identificationTeamLeader = identifications.find(
        (identification) => identification.number === "1111222333"
    )
    const identificationCoder = identifications.find(
        (identification) => identification.number === "1045741377"
    )

    if (!identificationAdmin) {
        throw new Error(
            "La identificación 8530798 no esta en la tabla identification."
        );
    }
    if (!identificationTeamLeader) {
        throw new Error(
            "La identificación 1111222333 no esta en la tabla identification."
        );
    }
    if (!identificationCoder) {
        throw new Error(
            "La identificación 1045741377 no esta en la tabla identification."
        );
    }


    // ==================================================
    // HASH DE LAS CONTRASEÑAS
    // ==================================================

    const passwordAdmin = await bcrypt.hash(
        "camilodelvalle123*",
        10
    );

    const passwordTeamLeader = await bcrypt.hash(
        "abrahanvilla123*",
        10
    );

    const passwordCoder = await bcrypt.hash(
        "dylansuarez123*",
        10
    );


    // ==================================================
    // CREAR LOS USUARIOS
    // ==================================================

    await context.bulkInsert("user", [
        {
            id: randomUUID(),
            first_name: "camilo",
            last_name: "del valle",
            email: "camilodelvalle@admin.com",
            password_hash: passwordAdmin,
            phone: "3001234567",
            birth_date: "1995-01-15",
            is_active: true,

            address_user_id: addressAdmin.id,
            identification_id: identificationAdmin.id,
            role_id: roleAdmin.id,

            createdAt: new Date(),
            updatedAt: new Date()
        },

        {
            id: randomUUID(),
            first_name: "abrahan",
            last_name: "villa",
            email: "abrahanvilla@teamleader.com",
            password_hash: passwordTeamLeader,
            phone: "3007654321",
            birth_date: "1998-06-20",
            is_active: true,

            address_user_id: addressTeamLeader.id,
            identification_id: identificationTeamLeader.id,
            role_id: roleTeamLeader.id,

            createdAt: new Date(),
            updatedAt: new Date()
        },

        {
            id: randomUUID(),
            first_name: "dylan alberto",
            last_name: "suárez laverde",
            email: "dylansuarez@coder.com",
            password_hash: passwordCoder,
            phone: "3207131117",
            birth_date: "2000-10-08",
            is_active: true,

            address_user_id: addressCoder.id,
            identification_id: identificationCoder.id,
            role_id: roleCoder.id,

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

    await context.bulkDelete("user", {});
}
