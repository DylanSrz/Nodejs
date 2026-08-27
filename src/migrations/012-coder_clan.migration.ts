import { DataTypes, type QueryInterface } from "sequelize";

export async function up({context}: {context: QueryInterface}) {

    await context.createTable('coder_clan', {

        clan_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "clan",
                key: "id",
            },
        },
        coder_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        }
        
    })
}

export async function down({context}: {context: QueryInterface}) {

    await context.dropTable('coder_clan')
}