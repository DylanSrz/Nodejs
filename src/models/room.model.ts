import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Campus from "./campus.model.js";


// Representa la tabla "room" de PostgreSQL.
class Room extends Model {

    // Identificador único de la sala.
    declare id: string;

    // Nombre de la sala.
    declare name: string;

    // Capacidad máxima de la sala.
    declare capacity: number;

    // FK que apunta a campus.id.
    declare campus_id: string;
}


Room.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Genera automáticamente un UUID
            // al crear una sala.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY.
            primaryKey: true,
        },


        // ==========================================
        // NAME
        // ==========================================
        name: {
            // PostgreSQL: varchar(255)
            type: DataTypes.STRING(255),

            // El nombre de la sala es obligatorio.
            allowNull: false,
        },


        // ==========================================
        // CAPACITY
        // ==========================================
        capacity: {
            // PostgreSQL: int
            type: DataTypes.INTEGER,

            // La capacidad es obligatoria.
            allowNull: false,

            // La capacidad debe ser como mínimo 1.
            validate: {
                min: 1,
            },
        },


        // ==========================================
        // CAMPUS ID
        // ==========================================
        campus_id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Toda sala debe pertenecer a un campus.
            allowNull: false,

            // FK:
            //
            // room.campus_id
            //       ↓
            // campus.id
            references: {
                model: Campus,
                key: "id",
            },
        },
    },

    {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "room",

        // No existen createdAt ni updatedAt.
        timestamps: false,

        // ==========================================
        // ÍNDICE COMPUESTO ÚNICO
        // ==========================================
        //
        // Evita que un mismo campus tenga
        // dos salas con el mismo nombre.
        //
        // Permite:
        //
        // Campus A → Sala 1
        // Campus B → Sala 1
        //
        // Pero NO permite:
        //
        // Campus A → Sala 1
        // Campus A → Sala 1
        indexes: [
            {
                // Mismo nombre definido en PostgreSQL.
                name: "uq_room_campus_name",

                // El índice debe ser único.
                unique: true,

                // Columnas que forman el índice.
                fields: ["campus_id", "name"],
            },
        ],
    }
);


// ==========================================
// HOOK: BEFORE CREATE AND UPDATE
// ==========================================

// Convierte el nombre de la sala
// a minúsculas antes de crearla.
Room.beforeCreate((room) => {

    room.name = room.name.toLowerCase();
});


// Convierte el nombre de la sala
// a minúsculas antes de actualizarla.
Room.beforeUpdate((room) => {

    room.name = room.name.toLowerCase();
});


// ==========================================
// RELACIÓN: ROOM → CAMPUS
// ==========================================

// Una sala pertenece a un solo campus.
//
// Campus
//   │
//   │ 1
//   │
//   │ N
//   ↓
// Room
Room.belongsTo(Campus, {
    foreignKey: "campus_id",
    as: "campus",
});


// Exportamos el modelo.
export default Room;