import express, { type Request, type Response } from 'express';
import Room from '../models/room.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    
    try {

        const rooms = await Room.findAll()

        res.json(rooms)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
    ;
    
});

export default router;
