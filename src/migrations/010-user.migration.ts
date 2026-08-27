import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('user', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        address_user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: "address_user",
                key: "id",
            }
        },
        identification_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: "identification",
                key: "id",
            }
        },
        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            }
        }
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('user')
}