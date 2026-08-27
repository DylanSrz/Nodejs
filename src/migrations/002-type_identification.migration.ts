import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('type_identification', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        code_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        }
        
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('type_identification')
}