import type { Request, Response } from "express";
import { login } from "../services/auth.services.js";

export const loginController = async (req: Request, res: Response) => {
    const {email, password} = req.body

    try {
        const data = await login(email, password)
        res.json(data)
    } catch(error) {
        res.status(401).json({message: 'Credentials invalid'})
    }
}