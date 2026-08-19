import { Schema, model } from "mongoose";

interface ITl {
    name: string,
    email: string,
    jornada: 'am'|'pm'
}

const TlSchema = new Schema<ITl>(

    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        jornada: {
            type: String,
            required: true,
            enum: ['am', 'pm'],
            default: 'am'
        }
    }, {
        timestamps: true
    }
)

export const Tl = model<ITl>('Tl', TlSchema)