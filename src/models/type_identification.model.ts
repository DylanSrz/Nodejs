import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Type_identification extends Model {

    declare id: string
    declare name: string
    declare code_name: string

}

Type_identification.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        code_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        sequelize: db
    }
)

Type_identification.beforeCreate(type_identification => {
    type_identification.name = type_identification.name.toLowerCase()
    type_identification.code_name = type_identification.code_name.toLowerCase()
})

Type_identification.beforeUpdate(type_identification => {
    type_identification.name = type_identification.name.toLowerCase()
    type_identification.code_name = type_identification.code_name.toLowerCase()
})

export default Type_identification