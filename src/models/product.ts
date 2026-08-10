import { DataTypes, Model } from "sequelize";
import  db  from "../config/db.js";

class Product extends Model{
    declare id: number
    declare name: string
    declare price: number
    declare status: boolean
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize: db,
        tableName: 'Product'
    }
)

export default Product