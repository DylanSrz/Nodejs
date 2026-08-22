import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

import Cities from "./cities.model.js";


// Representa la tabla "campus" de PostgreSQL.
class Campus extends Model {

    // Identificador único del campus.
    declare id: string;

    // Nombre del campus.
    declare name: string;

    // FK que apunta a cities.id.
    declare city_id: string;

    // Dirección del campus.
    declare address: string;
}


Campus.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Genera automáticamente un UUID
            // al crear un campus.
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

            // El nombre es obligatorio.
            allowNull: false,

            // El nombre del campus debe ser único
            // en toda la tabla.
            unique: true,
        },


        // ==========================================
        // CITY ID
        // ==========================================
        city_id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Todo campus debe pertenecer a una ciudad.
            allowNull: false,

            // FK:
            //
            // campus.city_id
            //       ↓
            // cities.id
            references: {
                model: Cities,
                key: "id",
            },
        },


        // ==========================================
        // ADDRESS
        // ==========================================
        address: {
            // PostgreSQL: varchar(255)
            type: DataTypes.STRING(255),

            // La dirección es obligatoria.
            allowNull: false,
        },
    },
    {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "campus",

        // No existen createdAt ni updatedAt
        // en tu tabla PostgreSQL.
        timestamps: false,
    }
);


// ==========================================
// HOOK: BEFORE CREATE AND UPDATE
// ==========================================

// Se ejecuta antes de crear un campus.
//
// Convertimos los campos de texto
// a minúsculas para mantener consistencia.
Campus.beforeCreate((campus) => {

    campus.name = campus.name.toLowerCase();

    campus.address = campus.address.toLowerCase();
});


// Se ejecuta antes de actualizar un campus.
//
// Mantenemos name y address en minúsculas.
Campus.beforeUpdate((campus) => {

    campus.name = campus.name.toLowerCase();

    campus.address = campus.address.toLowerCase();
});


// ==========================================
// RELACIÓN: CAMPUS → CITY
// ==========================================

// Cada campus pertenece a una ciudad.
//
// Cities
//   │
//   │ 1
//   │
//   │ N
//   ↓
// Campus
Campus.belongsTo(Cities, {
    foreignKey: "city_id",
    as: "city",
});


// Exportamos el modelo.
export default Campus;