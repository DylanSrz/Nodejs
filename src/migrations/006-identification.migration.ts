import { DataTypes, type QueryInterface } from "sequelize";

export async function up({ context }: { context: QueryInterface }) {
    await context.createTable("identification", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        type_identification_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "type_identification",
                key: "id",
            },
        },

        number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
    });
}

export async function down({ context }: { context: QueryInterface }) {
    await context.dropTable("identification");
}
