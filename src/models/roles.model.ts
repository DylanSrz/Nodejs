import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Roles extends Model {

    declare id: string
    declare name: string;

}

Roles.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.ENUM('admin', 'team leader', 'coder'),
            unique: true,
            allowNull: false
        }
    }, {
        sequelize: db
    }
)

Roles.beforeCreate(roles => {
    roles.name = roles.name.toLowerCase();
})

Roles.beforeUpdate(roles => {
    roles.name = roles.name.toLowerCase();
})

export default Roles