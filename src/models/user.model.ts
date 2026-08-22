import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

import Address_user from "./address_user.model.js";
import Identification from "./identification.model.js";
import Roles from "./role.model.js";


class User extends Model {

    // Identificador único del usuario.
    declare id: string;

    // Nombre del usuario.
    declare first_name: string;

    // Apellido del usuario.
    declare last_name: string;

    // Correo electrónico del usuario.
    declare email: string;

    // Contraseña almacenada como hash.
    declare password_hash: string;

    // Número de teléfono.
    declare phone: string;

    // Fecha de nacimiento.
    declare birth_date: Date;

    // Indica si el usuario está activo.
    declare is_active: boolean;


    // FOREIGN KEYS
    // ==================================================

    // FK que apunta a address_user.id.
    declare address_user_id: string;

    // FK que apunta a identification.id.
    declare identification_id: string;

    // FK que apunta a roles.id.
    declare role_id: string;

    // TIMESTAMPS
    // ==================================================

    // Fecha y hora en la que se creó el usuario.
    declare createdAt: Date;

    // Fecha y hora de la última actualización.
    declare updatedAt: Date;
}

// CONFIGURACIÓN DEL MODELO

User.init(
    {
        id: {
            // PostgreSQL: UUID.
            type: DataTypes.UUID,

            // Sequelize genera automáticamente el UUID.
            defaultValue: DataTypes.UUIDV4,

            // PRIMARY KEY.
            primaryKey: true,
        },
        first_name: {
            // PostgreSQL: varchar(255).
            type: DataTypes.STRING(255),

            // Campo obligatorio.
            allowNull: false,
        },
        last_name: {
            // PostgreSQL: varchar(255).
            type: DataTypes.STRING(255),

            // Campo obligatorio.
            allowNull: false,
        },
        email: {
            // PostgreSQL: varchar(255).
            type: DataTypes.STRING(255),

            // Campo obligatorio.
            allowNull: false,

            // No pueden existir dos usuarios
            // con el mismo correo.
            unique: true,

            // Validación para comprobar que tenga
            // un formato válido de correo electrónico.
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            // PostgreSQL: varchar(255).
            type: DataTypes.STRING(255),

            // Campo obligatorio.
            allowNull: false,
        },
        phone: {
            // PostgreSQL: varchar(20).
            type: DataTypes.STRING(20),

            // Campo obligatorio.
            allowNull: false,
        },
        birth_date: {
            // PostgreSQL: date.
            // DATEONLY almacena solamente la fecha,
            // sin hora.
            type: DataTypes.DATEONLY,

            // Campo obligatorio.
            allowNull: false,
        },
        is_active: {
            // PostgreSQL: boolean.
            type: DataTypes.BOOLEAN,

            // Por defecto, el usuario está activo.
            defaultValue: true,

            // No puede ser NULL.
            allowNull: false,
        },
        address_user_id: {
            // PostgreSQL: UUID.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // UNIQUE permite establecer una relación 1:1
            // entre User y Address_user.
            unique: true,

            // Foreign Key:
            // user.address_user_id
            //          ↓
            // address_user.id
            references: {
                model: Address_user,
                key: "id",
            },
        },
        identification_id: {
            // PostgreSQL: UUID.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // UNIQUE permite establecer una relación 1:1
            // entre User e Identification.
            unique: true,

            // Foreign Key:
            //
            // user.identification_id
            //          ↓
            // identification.id
            references: {
                model: Identification,
                key: "id",
            },
        },
        role_id: {
            // PostgreSQL: UUID.
            type: DataTypes.UUID,

            // Campo obligatorio.
            allowNull: false,

            // Foreign Key:
            // user.role_id
            //      ↓
            // roles.id
            references: {
                model: Roles,
                key: "id",
            },
        },
    }, {
        // Conexión con PostgreSQL.
        sequelize: db,

        // Nombre exacto de la tabla.
        tableName: "user",

        // Sequelize creará y administrará automáticamente:
        //
        // createdAt
        // updatedAt
        timestamps: true,
    }
);


// ======================================================
// HOOK: BEFORE CREATE AND UPDATE
// ======================================================

// Se ejecuta antes de crear un usuario.
//
// Convierte nombre, apellido y email
// a minúsculas antes de guardarlos.
User.beforeCreate((user) => {

    user.first_name = user.first_name.toLowerCase();

    user.last_name = user.last_name.toLowerCase();

    user.email = user.email.toLowerCase();
});

// Se ejecuta antes de actualizar un usuario.
//
// Mantiene nombre, apellido y email
// en minúsculas.
User.beforeUpdate((user) => {

    user.first_name = user.first_name.toLowerCase();

    user.last_name = user.last_name.toLowerCase();

    user.email = user.email.toLowerCase();
});


// ASOCIACIÓN: USER → ADDRESS_USER
// ======================================================

// Un usuario pertenece a una dirección.
//
// Como address_user_id es UNIQUE,
// esta relación es 1:1.
//
// User
//   │
//   │ 1
//   │
//   ▼
// Address_user
User.belongsTo(Address_user, {
    foreignKey: "address_user_id",
    as: "address_user",
});


// ASOCIACIÓN: USER → IDENTIFICATION
// ======================================================

// Un usuario pertenece a una identificación.
//
// Como identification_id es UNIQUE,
// esta relación es 1:1.
//
// User
//   │
//   │ 1
//   │
//   ▼
// Identification
User.belongsTo(Identification, {
    foreignKey: "identification_id",
    as: "identification",
});


// ASOCIACIÓN: USER → ROLE
// ======================================================

// Un usuario pertenece a un rol.
//
// Muchos usuarios pueden tener el mismo rol.
//
// User N ───── 1 Roles
User.belongsTo(Roles, {
    foreignKey: "role_id",
    as: "role",
});


// EXPORTACIÓN
export default User;