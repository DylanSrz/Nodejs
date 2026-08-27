import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('cities', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        code_name: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
        }
        
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('cities')
}