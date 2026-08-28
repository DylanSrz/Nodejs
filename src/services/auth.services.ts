import User from "../models/user.model.js";
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Roles from '../models/role.model.js';

export const login = async (email: string, password: string) => {
    const user = await User.findOne({where: {email}})
    if (!user) {
        throw new Error("Credenciales invalidas.")
    }
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
        throw new Error("Credenciales invalidas.")
    }

    const role = await Roles.findByPk(user.role_id)

    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign(
        { id: user.id, role: role?.name},
        secretKey!,
        {expiresIn: '1h'}
    )

    return {token}
}
