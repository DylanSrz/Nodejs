import express, { type Request, type Response } from 'express';
import Cities from '../models/cities.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    try {

        const cities = await Cities.findAll()

        res.json(cities)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }
});

export default router;
