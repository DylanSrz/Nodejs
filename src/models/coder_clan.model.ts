import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

import Clan from "./clan.model.js";
import User from "./user.model.js";


// Representa la tabla intermedia "coder_clan".
// Esta tabla relaciona:
// User ←──── Coder_clan ────→ Clan
// Además, almacena información adicional
// sobre la relación:
// - start_date
// - end_date
class Coder_clan extends Model {

    // FK que apunta a clan.id.
    declare clan_id: string;

    // FK que apunta a user.id.
    declare coder_id: string;

    // Fecha en la que el coder comienza
    // a pertenecer al clan.
    declare start_date: Date;

    // Fecha en la que el coder deja
    // de pertenecer al clan.
    // Puede ser NULL mientras siga
    // perteneciendo al clan.
    declare end_date: Date | null;

    // Fecha de creación del registro.
    declare createdAt: Date;

    // Fecha de última actualización.
    declare updatedAt: Date;
}

Coder_clan.init(
    {
        clan_id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // Foreign Key:
            // coder_clan.clan_id
            //          ↓
            // clan.id
            references: {
                model: Clan,
                key: "id",
            },
        },
        coder_id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // Foreign Key:
            // coder_clan.coder_id
            //          ↓
            // user.id
            references: {
                model: User,
                key: "id",
            },
        },
        start_date: {
            // PostgreSQL: date.
            // DATEONLY representa solamente
            // la fecha, sin hora.
            type: DataTypes.DATEONLY,

            // Campo obligatorio.
            allowNull: false,
        },
        end_date: {
            // PostgreSQL: date.
            type: DataTypes.DATEONLY,

            // Puede ser NULL.
            // NULL significa que el coder
            // todavía pertenece al clan.
            allowNull: true,
        },
    }, {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "coder_clan",

        // Sequelize administrará:
        // createdAt
        // updatedAt
        timestamps: true,

        // ÍNDICE COMPUESTO
        // ==================================================
        indexes: [
            {
                // Una combinación clan + coder
                // no debería repetirse.
                name: "uq_coder_clan",

                // Hace única la combinación.
                unique: true,

                // Columnas que forman la combinación.
                fields: [
                    "clan_id",
                    "coder_id",
                ],
            },
        ],
    }
);

// ASOCIACIÓN: CODER_CLAN → CLAN
// ======================================================
// Cada registro de Coder_clan pertenece
// a un único Clan.
// Clan
//   │
//   │ 1
//   │
//   │ N
//   ▼
// Coder_clan
Coder_clan.belongsTo(Clan, {
    foreignKey: "clan_id",
    as: "clan",
});
// ASOCIACIÓN: CODER_CLAN → USER
// ======================================================
// Cada registro de Coder_clan pertenece
// a un único User.
// User
//   │
//   │ 1
//   │
//   │ N
//   ▼
// Coder_clan
// A nivel de negocio, ese User debería
// tener el rol "coder".
Coder_clan.belongsTo(User, {
    foreignKey: "coder_id",
    as: "coder",
});


export default Coder_clan;