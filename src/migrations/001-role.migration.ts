import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('roles', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isIn: [["admin", "team leader", "coder"]]
            }
        }
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('roles')
}