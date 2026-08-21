import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";

class Identification extends Model {

    declare id: string
    declare type_identification_id: string
    declare number: string

}

Identification.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        type_identification_id: {
            type: DataTypes.UUID,
            
        }
    }, {
        sequelize: db
    }
)

export default Identification