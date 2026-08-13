import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class User extends Model{
    declare id: number;
    declare name: string;
    declare email: string;
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },{
        sequelize: db
    }
)

export default User;