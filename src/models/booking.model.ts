import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import User from "./user.model.js";
import Book from "./book.model.js";

class Booking extends Model{
    declare id: number;
    declare user_id: number;
    declare book_id: number;
    declare status: 'pending'| 'completed'| 'cancelled';
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
            defaultValue: 'pending',
            allowNull: false
        }
    },{
        sequelize: db
    }
)

Booking.belongsTo(User, {foreignKey: 'user_id'})
Booking.belongsTo(Book, {foreignKey: 'book_id'})

export default Booking;