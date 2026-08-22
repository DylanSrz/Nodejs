import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Roles extends Model {
    declare id: string;
    declare name: string;
}

Roles.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isIn: [["admin", "team leader", "coder"]],
            },
        },
    },
    {
        sequelize: db,
        tableName: "roles",
        timestamps: false,
    }
);

Roles.beforeCreate((role) => {
    role.name = role.name.toLowerCase();
});

Roles.beforeUpdate((role) => {
    role.name = role.name.toLowerCase();
});

export default Roles;