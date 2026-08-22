import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import Type_identification from "./type_identification.model.js";

// Representa la tabla "identification" de PostgreSQL.
class Identification extends Model {

    // Clave primaria de la identificación.
    declare id: string;

    // FK que apunta a type_identification.id.
    declare type_identification_id: string;

    // Número de identificación.
    declare number: string;
}

Identification.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Genera automáticamente un UUID
            // al crear una identificación.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY.
            primaryKey: true,
        },

        // ==========================================
        // TYPE IDENTIFICATION ID
        // ==========================================
        type_identification_id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // El tipo de identificación es obligatorio.
            allowNull: false,

            // FK:
            // identification.type_identification_id
            //        ↓
            // type_identification.id
            references: {
                model: Type_identification,
                key: "id",
            },
        },

        // ==========================================
        // NUMBER
        // ==========================================
        number: {
            // PostgreSQL: varchar(20)
            type: DataTypes.STRING(20),

            // Obligatorio.
            allowNull: false,

            // No pueden existir dos identificaciones
            // con el mismo número.
            unique: true,
        },
    },
    {
        // Conexión a PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "identification",

        // Tu tabla no tiene createdAt ni updatedAt.
        timestamps: false,
    }
);


// ==========================================
// HOOK: BEFORE CREATE
// ==========================================

// Convierte el número a minúsculas antes de crear.
//
// Esto solamente tiene sentido si permites
// identificaciones alfanuméricas y quieres
// almacenarlas siempre en minúsculas.
Identification.beforeCreate((identification) => {
    identification.number =
        identification.number.toLowerCase();
});


// ==========================================
// HOOK: BEFORE UPDATE
// ==========================================

// Mantiene el número en minúsculas al actualizar.
Identification.beforeUpdate((identification) => {
    identification.number =
        identification.number.toLowerCase();
});


// ==========================================
// RELACIÓN
// ==========================================

// Una Identification pertenece a un
// Type_identification.
Identification.belongsTo(Type_identification, {
    foreignKey: "type_identification_id",
    as: "type_identification",
});


// Un Type_identification puede tener
// muchas Identification.
Type_identification.hasMany(Identification, {
    foreignKey: "type_identification_id",
    as: "identifications",
});

export default Identification;