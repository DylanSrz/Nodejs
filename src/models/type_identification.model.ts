import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

// Representa la tabla "type_identification" de PostgreSQL.
class Type_identification extends Model {

    // Identificador único de la tabla.
    declare id: string;

    // Nombre descriptivo del tipo de identificación.
    declare name: string;

    // Código interno del tipo de identificación.
    declare code_name: string;
}

Type_identification.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Sequelize genera automáticamente un UUID
            // cuando se crea un nuevo registro.
            defaultValue: DataTypes.UUIDV4,

            // Corresponde a PRIMARY KEY.
            primaryKey: true,
        },

        // ==========================================
        // NAME
        // ==========================================
        name: {
            // PostgreSQL: varchar(255)
            type: DataTypes.STRING(255),

            // El campo no puede ser NULL.
            allowNull: false,

            // No pueden existir dos tipos de identificación
            // con el mismo nombre.
            unique: true,
        },

        // ==========================================
        // CODE_NAME
        // ==========================================
        code_name: {
            // PostgreSQL: varchar(255)
            type: DataTypes.STRING(255),

            // El campo es obligatorio.
            allowNull: false,

            // El código debe ser único.
            unique: true,
        },
    },
    {
        // Conexión a PostgreSQL.
        sequelize: db,

        // Indicamos explícitamente el nombre de la tabla.
        tableName: "type_identification",

        // La tabla PostgreSQL no tiene createdAt ni updatedAt.
        timestamps: false,
    }
);

// ==========================================
// HOOK: BEFORE CREATE
// ==========================================

// Se ejecuta antes de insertar un nuevo registro.
//
// Convierte "name" y "code_name" a minúsculas
// para mantener un formato consistente.
Type_identification.beforeCreate((type_identification) => {

    type_identification.name = type_identification.name.toLowerCase();
    type_identification.code_name = type_identification.code_name.toLowerCase();
});


// ==========================================
// HOOK: BEFORE UPDATE
// ==========================================

// Se ejecuta antes de actualizar un registro.
//
// Garantiza que cuando se modifiquen estos campos
// también se almacenen en minúsculas.
Type_identification.beforeUpdate((type_identification) => {

    type_identification.name = type_identification.name.toLowerCase();
    type_identification.code_name = type_identification.code_name.toLowerCase();
});


// Exportamos el modelo para poder utilizarlo
// en controllers, services, relaciones, etc.
export default Type_identification;