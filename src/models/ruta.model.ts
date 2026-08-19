import { Schema, model, Types } from "mongoose"

interface IRuta {
    name: string
    dificultad: 'facil'|'dificil'
    tl: Types.ObjectId
}

const rutaSchema = new Schema<IRuta>(

    {
        name: {
            type: String,
            required: true,
        },
        dificultad: {
            type: String,
            required: true,
            enum: ['facil', 'dificil'],
            default: 'facil'
        },
        tl: {
            type: Schema.Types.ObjectId,
            ref: 'Tl',
            required: true
        }
    }, {
        timestamps: true
    }

)

export const Ruta = model<IRuta>('Ruta', rutaSchema)