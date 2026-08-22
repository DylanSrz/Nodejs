import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

// Representa la tabla "cities" de PostgreSQL.
class Cities extends Model {

    // Identificador único de la ciudad.
    declare id: string;

    // Nombre de la ciudad.
    declare name: string;

    // Código único de la ciudad.
    declare code_name: string;
}

Cities.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Genera automáticamente un UUID al crear
            // un nuevo registro.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY de la tabla.
            primaryKey: true,
        },

        // ==========================================
        // NAME
        // ==========================================
        name: {
            // PostgreSQL: varchar(255)
            type: DataTypes.STRING(255),

            // El nombre de la ciudad es obligatorio.
            allowNull: false,
        },

        // ==========================================
        // CODE_NAME
        // ==========================================
        code_name: {
            // PostgreSQL: varchar(255)
            type: DataTypes.STRING(255),

            // No puede haber dos ciudades con
            // el mismo code_name.
            unique: true,

            // El código es obligatorio.
            allowNull: false,
        },
    },
    {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla en PostgreSQL.
        tableName: "cities",

        // La tabla no tiene createdAt ni updatedAt.
        timestamps: false,
    }
);


// ==========================================
// HOOK: BEFORE CREATE
// ==========================================

// Se ejecuta antes de insertar una ciudad.
//
// Convierte el nombre y el código a minúsculas
// para mantener un formato consistente.
Cities.beforeCreate((city) => {

    city.name = city.name.toLowerCase();

    city.code_name = city.code_name.toLowerCase();
});


// ==========================================
// HOOK: BEFORE UPDATE
// ==========================================

// Se ejecuta antes de actualizar una ciudad.
//
// Mantiene name y code_name en minúsculas.
Cities.beforeUpdate((city) => {

    city.name = city.name.toLowerCase();

    city.code_name = city.code_name.toLowerCase();
});


// Exportamos el modelo.
export default Cities;