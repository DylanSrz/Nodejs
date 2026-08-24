import express, { type Request, type Response } from 'express';
import Type_identification from '../models/type_identification.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    
    try {

        const type_identification = await Type_identification.findAll()

        res.json(type_identification)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor.'})
    }
});

export default router;
