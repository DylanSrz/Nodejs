import { Schema, model, Types } from "mongoose";

interface IClan {
    name: string
    sala: number
    jornada: 'am'|'pm'
    ruta: Types.ObjectId
}

const ClanSchema = new Schema<IClan>(

    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        sala:  {
            type: Number,
            required: true,
        },
        jornada: {
            type: String,
            required: true,
            enum: ['am', 'pm'],
            default: 'am'
        },
        ruta: {
            type: Schema.Types.ObjectId,
            ref: 'Ruta',
            required: true
        }
    }, {
        timestamps: true
    }

)

export const Clan = model<IClan>('Clan', ClanSchema)