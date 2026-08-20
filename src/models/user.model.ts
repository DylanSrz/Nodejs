import { Schema, model } from 'mongoose'

interface IUser {
    name: string,
    email:  string,
    passwordHash: string
}

const UserSchema = new Schema<IUser>(

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
        passwordHash: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    }

)

export const User = model<IUser>('User', UserSchema)