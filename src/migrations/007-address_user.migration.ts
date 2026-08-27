import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('address_user', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        city_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "cities",
                key: "id",
            }
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('address_user')
}