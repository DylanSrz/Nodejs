import express, { type Request, type Response } from 'express'
import * as bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'

const router = express.Router()

// POST // registro de usuario con email y password
router.post('/register', async (req: Request, res: Response) => {

    const {name, email, password} = req.body

    const emailExist = await User.findOne({email})

    if (emailExist) {
        return res.status(409).json('usuario ya existe')
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const user = await User.create(
        {
            name,
            email,
            passwordHash
        }
    )

    res.status(201).json({message: 'usuario creado', user})
})


// POST // sistema de login de usuario.
router.post('/login', async (req: Request, res: Response) => {

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
        return res.status(401).json({message: 'email no existe'})
    }

    const passwordOk = bcrypt.compareSync(password, user.passwordHash)

    if (!passwordOk) {
        return res.status(401).json({message: 'contraseña incorrecta'})
    }

    res.json({message: 'Login exitoso', user})

})

export default router