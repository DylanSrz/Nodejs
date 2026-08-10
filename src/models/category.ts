import { DataTypes, Model } from "sequelize";
import  db  from "../config/db.js";

class Category extends Model{
    declare id: number
    declare name: string
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize: db,
        tableName: 'Product'
    }
)

export default Category