
import { DataTypes, QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {

    await context.createTable('Bookings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },

            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Books',
                key: 'id'
            },

            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM('pending', 'cancelled', 'completed'),
            defaultValue: 'pending'
        }
    });

}

export async function down({ context }: { context: QueryInterface }) {

    await context.dropTable('Bookings');

}