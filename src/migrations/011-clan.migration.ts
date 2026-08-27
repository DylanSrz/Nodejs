import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('clan', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        schedule_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "schedule",
                key: "id",
            },
        },
        type_route_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "type_route",
                key: "id",
            },
        },
        room_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "room",
                key: "id",
            }
        },
        tl_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: "user",
                key: "id",
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
}
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('clan')
}