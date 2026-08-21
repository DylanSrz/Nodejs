import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Type_route extends Model {

    declare id: string
    declare name: string

}

Type_route.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.ENUM('basica', 'avanzada'),
            unique: true,
            allowNull: false
        }
    }, {
        sequelize: db
    }
)

Type_route.beforeCreate(type_route => {
    type_route.name = type_route.name.toLowerCase()
})

Type_route.beforeUpdate(type_route => {
    type_route.name = type_route.name.toLowerCase()
})

export default Type_route