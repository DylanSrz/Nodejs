import express, { type Request, type Response } from 'express';
import Type_route from '../models/type_route.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    
    try {

        const type_routes = await Type_route.findAll()

        res.json(type_routes)

    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Error en el servidor'})
    }

});

export default router;
