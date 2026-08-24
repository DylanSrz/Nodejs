import express, { type Request, type Response } from 'express';
import Campus from '../models/campus.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    
    try {

        const campus = await Campus.findAll()

        res.json(campus)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});

export default router;
