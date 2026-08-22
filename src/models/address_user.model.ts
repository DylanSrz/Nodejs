import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

import Cities from "./cities.model.js";


// Representa la tabla "address_user" de PostgreSQL.
class Address_user extends Model {

    // Identificador único de la dirección.
    declare id: string;

    // FK que apunta a cities.id.
    declare city_id: string;

    // Dirección física del usuario.
    declare address: string;
}


Address_user.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Genera automáticamente un UUID
            // al crear una nueva dirección.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY.
            primaryKey: true,
        },


        // ==========================================
        // CITY ID
        // ==========================================
        city_id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // La ciudad es obligatoria.
            allowNull: false,

            // FK:
            //
            // address_user.city_id
            //          ↓
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
        tableName: "address_user",

        // Tu tabla no tiene createdAt ni updatedAt.
        timestamps: false,
    }
);


// ==========================================
// HOOK: BEFORE CREATE AND UPDATE
// ==========================================

// Se ejecuta antes de crear una dirección.
//
// Convierte la dirección a minúsculas.
Address_user.beforeCreate((address_user) => {

    address_user.address = address_user.address.toLowerCase();
});

// Se ejecuta antes de actualizar una dirección.
//
// Mantiene la dirección en minúsculas.
Address_user.beforeUpdate((address_user) => {

    address_user.address = address_user.address.toLowerCase();
});


// ==========================================
// RELACIÓN
// ==========================================

// Una dirección pertenece a una ciudad.
//
// Address_user
//      |
//      | city_id
//      ↓
//    Cities
//

Address_user.belongsTo(Cities, {
    foreignKey: "city_id",
    as: "city",
});


// Exportamos el modelo.
export default Address_user;