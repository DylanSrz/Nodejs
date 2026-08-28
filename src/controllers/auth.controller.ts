import type { Request, Response } from "express";
import User from "../models/user.model.js";
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Roles from "../models/role.model.js";

export const loginController = async (req: Request, res: Response) => {

    try {
    const {email, password} = req.body

    const user = await User.findOne({where: {email}})
    if (!user) {
        return res.status(403).json({message: 'correo no existe.'})
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
        return res.status(403).json({message: 'password no es valida.'})
    }

    const role = await Roles.findByPk(user.role_id)
    if (!role) {
        return res.status(403).json({message: 'Rol no existe'})
    }
    
    const token = jwt.sign({id: user.id, role: role.name}, process.env.JWT_SECRET!, {expiresIn: '1h'})
    res.status(201).json({message: 'Login exitoso.', token})

    } catch(error) {
        res.status(401).json({message: 'Credential invalidddd'})
    }
}