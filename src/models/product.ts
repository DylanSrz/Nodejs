import { DataTypes, Model } from "sequelize";
import  db  from "../config/db.js";
import Category from "./category.js";

class Product extends Model{
    declare id: number
    declare name: string
    declare price: number
    declare status: boolean
    declare category_id: number
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
        },
        category_id: {
            type: DataTypes.INTEGER
            // allowNull: false
        }
    }, {
        sequelize: db,
    }
)

Product.belongsTo(Category, {foreignKey: 'category_id'})

export default Product