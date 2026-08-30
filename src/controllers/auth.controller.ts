import type { Request, Response } from "express";
import User from "../models/user.model.js";
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Roles from "../models/role.model.js";
import Address_user from "../models/address_user.model.js";
import Identification from "../models/identification.model.js";


// ======================================================
// LOGIN
// ======================================================
//
// Verifica el correo, compara la contraseña con bcrypt y
// firma un JWT con el id y el rol del usuario.
//
// El token expira en una hora.
//
export const loginController = async (req: Request, res: Response) => {

    const {email, password} = req.body

    // El modelo guarda el correo en minúsculas.
    const user = await User.findOne({
        where: { email: String(email).toLowerCase() },
    })

    if (!user) {
        return res.status(403).json({message: 'correo no existe.'})
    }

    // Un usuario dado de baja no puede entrar.
    if (!user.is_active) {
        return res.status(403).json({message: 'El usuario está inactivo.'})
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash)

    if (!passwordValid) {
        return res.status(403).json({message: 'password no es valida.'})
    }

    const role = await Roles.findByPk(user.role_id)

    if (!role) {
        return res.status(403).json({message: 'Rol no existe'})
    }

    const secretKey = process.env.JWT_SECRET

    // Sin secreto no se puede firmar: es un fallo de
    // configuración, no de las credenciales.
    if (!secretKey) {
        console.error('JWT_SECRET no está definido en las variables de entorno.')
        return res.status(500).json({message: 'Error interno del servidor.'})
    }

    const token = jwt.sign(
        {id: user.id, role: role.name},
        secretKey,
        {expiresIn: '1h'}
    )

    res.status(201).json({message: 'Login exitoso.', token})
}


// ======================================================
// PERFIL DEL USUARIO AUTENTICADO
// ======================================================
//
// Devuelve los datos de quien está usando el token, sin
// necesidad de conocer su id.
//
// Se monta detrás de verifyToken, así que req.user siempre
// llega cargado.
//
export const meController = async (req: Request, res: Response) => {

    const auth = req.user

    if (!auth) {
        return res.status(401).json({message: 'Token no proporcionado'})
    }

    const user = await User.findByPk(auth.id, {
        attributes: { exclude: ['password_hash'] },
        include: [
            { model: Roles, as: 'role' },
            { model: Address_user, as: 'address_user' },
            { model: Identification, as: 'identification' },
        ],
    })

    if (!user) {
        return res.status(404).json({message: 'El usuario no encontrado.'})
    }

    res.status(200).json({message: 'Perfil del usuario autenticado.', user})
}
