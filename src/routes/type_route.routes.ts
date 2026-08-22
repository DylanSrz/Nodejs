import express, { type Request, type Response } from 'express';
import Type_route from '../models/type_route.model.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'type.route' });
});

export default router;
