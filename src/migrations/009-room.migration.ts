import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('room', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            }
        },
        campus_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "campus",
                key: "id",
            },
        }
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('room')
}