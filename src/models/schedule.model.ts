import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import { setFlagsFromString } from "node:v8";

class  Schedule extends Model {

    declare id: string
    declare name: string
    declare start_time: string
    declare end_time: string

}

Schedule.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.ENUM('am', 'pm'),
            unique: true,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        sequelize: db
    }
)

Schedule.beforeCreate(schedule => {
    schedule.name = schedule.name.toLowerCase()
    schedule.start_time = schedule.start_time.toLowerCase()
    schedule.end_time = schedule.end_time.toLowerCase()
})

Schedule.beforeUpdate(schedule => {
    schedule.name = schedule.name.toLowerCase()
    schedule.start_time = schedule.start_time.toLowerCase()
    schedule.end_time = schedule.end_time.toLowerCase()
})

export default Schedule