
import { DataTypes, QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {

    await context.createTable('Books', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

}

export async function down({ context }: { context: QueryInterface }) {

    await context.dropTable('Books');

}