import express, { type Request, type Response } from 'express';
import Schedule from '../models/schedule.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    
    try {

        const schedule = await Schedule.findAll()

        res.json(schedule)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});

export default router;
