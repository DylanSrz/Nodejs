import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

// Representa la tabla "schedule" de PostgreSQL.
class Schedule extends Model {

    // Identificador único del horario.
    declare id: string;

    // Nombre del horario.
    // Por ejemplo: "am" o "pm".
    declare name: string;

    // Hora de inicio.
    // PostgreSQL TIME se maneja como string en Sequelize.
    // Ejemplo: "08:00:00".
    declare start_time: string;

    // Hora de finalización.
    // Ejemplo: "12:00:00".
    declare end_time: string;
}

Schedule.init(
    {
        // ==========================================
        // ID
        // ==========================================
        id: {
            // PostgreSQL: uuid
            type: DataTypes.UUID,

            // Sequelize genera automáticamente
            // un UUID para nuevos registros.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY.
            primaryKey: true,
        },

        // ==========================================
        // NAME
        // ==========================================
        name: {
            // PostgreSQL: varchar(50)
            type: DataTypes.STRING(50),

            // El nombre del horario es obligatorio.
            allowNull: false,

            // No pueden existir dos horarios
            // con el mismo nombre.
            unique: true,

            // Aunque PostgreSQL utiliza VARCHAR,
            // nuestra regla de negocio permite solamente
            // estos dos valores.
            validate: {
                isIn: [["am", "pm"]],
            },
        },

        // ==========================================
        // START TIME
        // ==========================================
        start_time: {
            // PostgreSQL: time
            type: DataTypes.TIME,

            // La hora de inicio es obligatoria.
            allowNull: false,
        },

        // ==========================================
        // END TIME
        // ==========================================
        end_time: {
            // PostgreSQL: time
            type: DataTypes.TIME,

            // La hora de finalización es obligatoria.
            allowNull: false,
        },
    },
    {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "schedule",

        // La tabla no tiene createdAt ni updatedAt.
        timestamps: false,
    }
);


// ==========================================
// HOOK: BEFORE CREATE
// ==========================================

// Se ejecuta antes de crear un horario.
//
// Solamente convertimos "name" a minúsculas.
//
// NO modificamos start_time ni end_time,
// porque son valores de tipo TIME.
Schedule.beforeCreate((schedule) => {

    schedule.name = schedule.name.toLowerCase();
});


// ==========================================
// HOOK: BEFORE UPDATE
// ==========================================

// Se ejecuta antes de actualizar un horario.
//
// Mantenemos "name" en minúsculas.
Schedule.beforeUpdate((schedule) => {

    schedule.name = schedule.name.toLowerCase();
});


// Exportamos el modelo.
export default Schedule;