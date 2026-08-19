import { Schema, model, Types } from "mongoose";

interface ICoder {
    name: string,
    email: string,
    clan: Types.ObjectId
}

const coderSchema = new Schema<ICoder>(

    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        clan: {
            type: Schema.Types.ObjectId,
            ref: 'Clan',
            required: true
        }
    }, {
        timestamps: true
    }

)

export const Coder = model<ICoder>('Coder', coderSchema)