import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

import Schedule from "./schedule.model.js";
import Type_route from "./type_route.model.js";
import Room from "./room.model.js";
import User from "./user.model.js";


// Representa la tabla "clan" de PostgreSQL.
class Clan extends Model {

    // Identificador único del clan.
    declare id: string;

    // Nombre del clan.
    declare name: string;

    // FOREIGN KEYS
    // ==================================================

    // FK que apunta a schedule.id.
    declare schedule_id: string;

    // FK que apunta a type_route.id.
    declare type_route_id: string;

    // FK que apunta a room.id.
    declare room_id: string;

    // FK que apunta a user.id.
    // Representa al Team Leader del clan.
    declare tl_id: string;

    // Fecha de creación del clan.
    declare createdAt: Date;

    // Fecha de última actualización.
    declare updatedAt: Date;
}


Clan.init(
    {
        id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Genera automáticamente un UUID.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY.
            primaryKey: true,
        },
        name: {
            // PostgreSQL: varchar(255).
            type: DataTypes.STRING(255),

            // Campo obligatorio.
            allowNull: false,

            // El nombre del clan debe ser único.
            unique: true,
        },
        schedule_id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // Foreign Key:
            // clan.schedule_id
            //       ↓
            // schedule.id
            references: {
                model: Schedule,
                key: "id",
            },
        },
        type_route_id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // Foreign Key:
            // clan.type_route_id
            //       ↓
            // type_route.id
            references: {
                model: Type_route,
                key: "id",
            },
        },
        room_id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // Foreign Key:
            // clan.room_id
            //       ↓
            // room.id
            references: {
                model: Room,
                key: "id",
            },
        },
        tl_id: {
            // PostgreSQL: uuid.
            type: DataTypes.UUID,

            // Todo clan debe tener un Team Leader.
            allowNull: false,

            // UNIQUE:
            // Un Team Leader solamente puede
            // estar asignado a un Clan.
            unique: true,

            // Foreign Key:
            // clan.tl_id
            //       ↓
            // user.id
            references: {
                model: User,
                key: "id",
            },
        },
    }, {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "clan",

        // Sequelize administrará:
        // createdAt
        // updatedAt
        timestamps: true,

        // ÍNDICE COMPUESTO ÚNICO
        // ==================================================
        indexes: [
            {
                // Mismo nombre definido en PostgreSQL.
                name: "uq_clan_room_schedule",

                // El conjunto de room_id + schedule_id
                // debe ser único.
                unique: true,

                // Columnas que forman el índice.
                fields: [
                    "room_id",
                    "schedule_id",
                ],
            },
        ],
    }
);


// HOOK: BEFORE CREATE AND UPDATE
// ======================================================

// Convierte el nombre del clan
// a minúsculas antes de guardarlo.
Clan.beforeCreate((clan) => {

    clan.name = clan.name.toLowerCase();
});

// Convierte el nombre del clan
// a minúsculas antes de actualizarlo.
Clan.beforeUpdate((clan) => {

    clan.name = clan.name.toLowerCase();
});


// ASOCIACIÓN: CLAN → SCHEDULE
// ======================================================
// Cada Clan pertenece a un Schedule.
// Schedule
//    │
//    │ 1
//    │
//    │ N
//    ▼
//  Clan
Clan.belongsTo(Schedule, {
    foreignKey: "schedule_id",
    as: "schedule",
});

// ASOCIACIÓN: CLAN → TYPE_ROUTE
// ======================================================
// Cada Clan pertenece a un Type_route.
// Type_route
//     │
//     │ 1
//     │
//     │ N
//     ▼
//   Clan
Clan.belongsTo(Type_route, {
    foreignKey: "type_route_id",
    as: "type_route",
});

// ASOCIACIÓN: CLAN → ROOM
// ======================================================
// Cada Clan pertenece a una Room.
// Room
//   │
//   │ 1
//   │
//   │ N
//   ▼
// Clan
Clan.belongsTo(Room, {
    foreignKey: "room_id",
    as: "room",
});

// ASOCIACIÓN: CLAN → USER / TEAM LEADER
// ======================================================
// Cada Clan tiene un Team Leader.
// Como tl_id es UNIQUE:
// User (Team Leader)
//        1
//        │
//        │
//        1
//       Clan
// Un usuario solamente puede ser
// Team Leader de un Clan.
Clan.belongsTo(User, {
    foreignKey: "tl_id",
    as: "team_leader",
});


export default Clan;