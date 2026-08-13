
import { DataTypes, QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {

    await context.createTable('Users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

}

export async function down({ context }: { context: QueryInterface }) {

    await context.dropTable('Users');

}