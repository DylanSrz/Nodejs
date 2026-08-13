import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Book extends Model{
    declare id: number;
    declare name: string;
    declare author: string;
    declare availability: boolean;
}

Book.init(
    {
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
            allowNull: false
        },
        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    },{
        sequelize: db
    }
)

Book.beforeCreate(book => {
    book.name = book.name.toLowerCase();
    book.author = book.author.toLowerCase();
})

Book.beforeUpdate(book => {
    book.name = book.name.toLowerCase();
    book.author = book.author.toLowerCase();
})

export default Book;