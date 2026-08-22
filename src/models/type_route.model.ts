import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

// Representa la tabla "type_route" de PostgreSQL.
class Type_route extends Model {

    // Identificador único del tipo de ruta.
    declare id: string;

    // Nombre del tipo de ruta.
    // Ejemplos: "basica" y "avanzada".
    declare name: string;
}

Type_route.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Sequelize genera automáticamente
            // un UUID al crear el registro.
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

            // No pueden existir dos tipos de ruta
            // con el mismo nombre.
            unique: true,

            // Regla de negocio:
            // solamente permitimos estos dos tipos.
            //
            // Esto NO crea un ENUM en PostgreSQL.
            // Es una validación realizada por Sequelize.
            validate: {
                isIn: [["basica", "avanzada"]],
            },
        },
    },
    {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "type_route",

        // La tabla no tiene createdAt ni updatedAt.
        timestamps: false,
    }
);


// ==========================================
// HOOK: BEFORE CREATE
// ==========================================

// Se ejecuta antes de insertar un nuevo tipo de ruta.
//
// Garantiza que el nombre se almacene en minúsculas.
Type_route.beforeCreate((type_route) => {

    type_route.name = type_route.name.toLowerCase();
});


// ==========================================
// HOOK: BEFORE UPDATE
// ==========================================

// Se ejecuta antes de actualizar un tipo de ruta.
//
// Garantiza que el nombre permanezca en minúsculas.
Type_route.beforeUpdate((type_route) => {

    type_route.name = type_route.name.toLowerCase();
});


// Exportamos el modelo.
export default Type_route;